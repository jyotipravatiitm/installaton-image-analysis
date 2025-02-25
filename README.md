# Enphase Image Analysis Tool

A modern web application for analyzing electrical wiring and component images using Anthropic's Claude API.

## Features

- Modern UI with Next.js and Shadcn UI components
- Left sidebar with sample prompts
- Right sidebar for results visualization
- Mobile-responsive with slide-out sidebar menus
- Drag-and-drop image upload with preview
- Custom prompt field to instruct Claude on analysis
- JSON or text response visualization
- Toast notifications for status updates

## Tech Stack

- Next.js 14 (React framework)
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components
- Anthropic Claude API for image analysis
- React Dropzone for file uploads

## Setup

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Set your Anthropic API key in your environment:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Or add it to `.env.local`:

```
ANTHROPIC_API_KEY=your-api-key-here
```

## Running the application

Start the development server:

```bash
npm run dev
```

Then open your browser and go to `http://localhost:3000`

For production:

```bash
npm run build
npm start
```

## Usage

1. Upload one or more images using the drag-and-drop area or file browser
2. Enter your analysis instructions in the text area or select a sample prompt from the left sidebar
3. Click "Analyze Images" to send the request to Claude
4. View the analysis results in the right sidebar

## Sample Prompts

The application provides several ready-to-use prompts:

- Wiring Comparison - Compares actual wiring against correct wiring diagrams
- Breaker Size Identification - Analyzes electrical panel breaker sizes
- Safety Inspection - Identifies potential electrical safety issues or code violations

You can also create your own custom prompts based on your needs.

## Responsive Design

The application is fully responsive:
- Desktop: Full layout with left and right sidebars
- Tablet: Left sidebar and main content
- Mobile: Main content with slide-out menus for both sidebars