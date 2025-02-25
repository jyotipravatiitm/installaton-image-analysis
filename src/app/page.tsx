'use client';

import React, { useState, useEffect } from 'react';
import { ImageUploadForm } from '@/components/image-upload-form';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Header } from '@/components/layout/header';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [response, setResponse] = useState<string | Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Listen for prompt changes from the sidebar
  useEffect(() => {
    const handleSetPrompt = (e: CustomEvent) => {
      setCurrentPrompt(e.detail);
    };
    
    window.addEventListener('set-prompt', handleSetPrompt as EventListener);
    
    return () => {
      window.removeEventListener('set-prompt', handleSetPrompt as EventListener);
    };
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setResponse(null);
    
    try {
      // Capture the prompt and images for saving later
      setCurrentPrompt(formData.get('prompt') as string);
      
      // Extract image files and convert to small data URLs
      const imageFiles = formData.getAll('images') as File[];
      const imageDataUrls = await Promise.all(
        imageFiles.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              // We'll use lower quality previews initially to save memory
              const url = e.target?.result as string;
              resolve(url);
            };
            reader.readAsDataURL(file);
          });
        })
      );
      
      // Only store up to 3 images to prevent memory issues
      setImageUrls(imageDataUrls.slice(0, 3));
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze images');
      }
      
      setResponse(result.response);
      toast({
        title: 'Analysis complete',
        description: 'Your images have been analyzed successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze images',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Sidebar */}
      <div className="hidden md:block w-64 h-full">
        <LeftSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header response={response} isLoading={isLoading} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <ImageUploadForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </main>
      </div>
      
      {/* Right Sidebar */}
      <div className="hidden lg:block w-80 h-full">
        <RightSidebar 
          response={response} 
          isLoading={isLoading} 
          prompt={currentPrompt}
          imageUrls={imageUrls}
        />
      </div>
    </div>
  );
}