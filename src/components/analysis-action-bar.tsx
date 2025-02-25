"use client";

import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/context/analysis-context";
import { useToast } from "@/hooks/use-toast";
import { BookmarkPlus, Copy, Share2 } from "lucide-react";
import { useState } from "react";

interface AnalysisActionBarProps {
  prompt: string;
  response: string | Record<string, any> | null;
  imageUrls: string[]; // Array of image data URLs
}

export function AnalysisActionBar({ prompt, response, imageUrls }: AnalysisActionBarProps) {
  const { saveAnalysis } = useAnalysis();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Don't render the action bar if there's no response
  if (!response) return null;
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Generate a title from the prompt (first 40 chars)
      const title = prompt.length > 40 
        ? `${prompt.substring(0, 40)}...` 
        : prompt;
      
      // Resize images to reduce storage size
      const resizedImageUrls = await Promise.all(
        imageUrls.map(async (url) => {
          return await resizeImage(url, 400); // Resize to 400px max dimension
        })
      );
      
      // Save the analysis
      saveAnalysis({
        title,
        prompt,
        response,
        imageUrls: resizedImageUrls
      });
      
      toast({
        title: "Analysis saved",
        description: "Your analysis has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save the analysis. Try again with fewer images.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Helper function to resize images
  const resizeImage = (dataUrl: string, maxDimension: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxDimension) {
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get resized data URL
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality
        resolve(resizedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = dataUrl;
    });
  };
  
  const handleCopy = async () => {
    try {
      let textToCopy;
      
      if (typeof response === 'object') {
        textToCopy = JSON.stringify(response, null, 2);
      } else {
        textToCopy = response;
      }
      
      await navigator.clipboard.writeText(textToCopy);
      
      toast({
        title: "Copied to clipboard",
        description: "The analysis has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy the analysis to clipboard.",
      });
    }
  };
  
  return (
    <div className="flex items-center gap-2 p-2 border-t">
      <Button 
        size="sm" 
        variant="outline"
        className="gap-1"
        onClick={handleSave}
        disabled={isSaving}
      >
        <BookmarkPlus className="h-4 w-4" />
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
      
      <div className="ml-auto">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          title="Share analysis"
        >
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </div>
    </div>
  );
}