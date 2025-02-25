"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAnalysis } from "@/context/analysis-context";
import { AnalysisActionBar } from "@/components/analysis-action-bar";

interface RightSidebarProps {
  response: string | Record<string, any> | null;
  isLoading: boolean;
  prompt?: string;
  imageUrls?: string[];
}

export function RightSidebar({ 
  response, 
  isLoading, 
  prompt = "", 
  imageUrls = [] 
}: RightSidebarProps) {
  const { savedAnalyses, selectedAnalysisId } = useAnalysis();
  
  // If there's a selected analysis, use that instead of the current response
  const selectedAnalysis = selectedAnalysisId 
    ? savedAnalyses.find(a => a.id === selectedAnalysisId)
    : null;
  
  // Determine what to display
  const displayResponse = selectedAnalysis ? selectedAnalysis.response : response;
  const displayPrompt = selectedAnalysis ? selectedAnalysis.prompt : prompt;
  const displayImageUrls = selectedAnalysis ? selectedAnalysis.imageUrls : imageUrls;
  
  return (
    <div className="h-full border-l bg-background flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Analysis Results</h2>
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Analyzing..." : displayResponse ? "Analysis complete" : "No results yet"}
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!isLoading && !displayResponse && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
            <p>Upload an image and enter a prompt to see analysis results here.</p>
          </div>
        )}
        
        {!isLoading && displayResponse && (
          <div className="space-y-4">
            {selectedAnalysis && (
              <div className="mb-4 space-y-2">
                <h3 className="text-sm font-medium">Analysis Images</h3>
                <div className="flex flex-wrap gap-2">
                  {displayImageUrls.map((url, index) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`Analysis image ${index + 1}`} 
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {typeof displayResponse === 'object' ? (
              <DisplayJson data={displayResponse} />
            ) : (
              <div className="whitespace-pre-wrap text-sm">{displayResponse}</div>
            )}
          </div>
        )}
      </ScrollArea>
      
      {!isLoading && displayResponse && !selectedAnalysis && (
        <AnalysisActionBar 
          prompt={displayPrompt} 
          response={displayResponse} 
          imageUrls={displayImageUrls}
        />
      )}
    </div>
  );
}

function DisplayJson({ data }: { data: Record<string, any> }) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <h3 className="text-sm font-medium capitalize">{key}</h3>
          
          {Array.isArray(value) ? (
            <ul className="space-y-2">
              {value.map((item, index) => (
                <li key={index} className="bg-muted/50 p-3 rounded-md text-sm">
                  {typeof item === 'object' && item !== null ? (
                    <DisplayJson data={item} />
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          ) : typeof value === 'object' && value !== null ? (
            <div className="pl-4 border-l-2 border-muted">
              <DisplayJson data={value} />
            </div>
          ) : (
            <p className="text-sm">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}