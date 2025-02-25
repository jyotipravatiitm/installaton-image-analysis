import { NextRequest, NextResponse } from 'next/server';
// No need for SDK import, using direct fetch

// Switch to using traditional Node.js fetch instead of Next.js fetch
const API_KEY = process.env.ANTHROPIC_API_KEY || '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';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const imageFiles = formData.getAll('images') as File[];

    if (!prompt || imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'Missing prompt or images' },
        { status: 400 }
      );
    }

    // Prepare content array
    const messageContent = [];

    // Add images to content array
    for (const file of imageFiles) {
      const buffer = await file.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString('base64');
      
      // Determine media type
      const fileType = file.type || 'image/jpeg';
      
      messageContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: fileType,
          data: base64Data,
        },
      });
    }

    // Add text prompt
    messageContent.push({
      type: 'text',
      text: prompt,
    });

    // Use fetch directly instead of the SDK
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: messageContent
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json(
        { error: `API error: ${errorData.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    
    // Extract text from response
    const textContent = responseData.content?.[0]?.text;
    
    if (!textContent) {
      return NextResponse.json(
        { error: 'No text content in response' },
        { status: 500 }
      );
    }

    // Try to parse as JSON if it looks like JSON
    if (textContent.trim().startsWith('{') && textContent.trim().endsWith('}')) {
      try {
        const parsed = JSON.parse(textContent);
        return NextResponse.json({ success: true, response: parsed });
      } catch (e) {
        // If JSON parsing fails, just return the raw text
      }
    }

    // Return the raw text
    return NextResponse.json({ success: true, response: textContent });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}