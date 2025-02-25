"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SavedAnalysis, SavedAnalysisList } from '@/types/analysis';

interface AnalysisContextType {
  savedAnalyses: SavedAnalysisList;
  saveAnalysis: (analysis: Omit<SavedAnalysis, 'id' | 'date'>) => void;
  deleteAnalysis: (id: string) => void;
  reorderAnalyses: (startIndex: number, endIndex: number) => void;
  selectedAnalysisId: string | null;
  setSelectedAnalysisId: (id: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysisList>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  
  // Load saved analyses from localStorage on component mount
  useEffect(() => {
    const storedAnalyses = localStorage.getItem('savedAnalyses');
    if (storedAnalyses) {
      try {
        setSavedAnalyses(JSON.parse(storedAnalyses));
      } catch (error) {
        console.error('Failed to parse saved analyses:', error);
      }
    }
  }, []);
  
  // Save analyses to localStorage whenever they change
  useEffect(() => {
    try {
      // Convert image URLs to smaller thumbnails before saving
      const analysesForStorage = savedAnalyses.map(analysis => {
        // For each analysis, check if we need to resize the images
        if (analysis.imageUrls && analysis.imageUrls.length > 0) {
          // Only store the first image as thumbnail for list view
          const thumbnail = analysis.imageUrls[0];
          return {
            ...analysis,
            // Store only one thumbnail to save space
            imageUrls: [thumbnail]
          };
        }
        return analysis;
      });
      
      localStorage.setItem('savedAnalyses', JSON.stringify(analysesForStorage));
    } catch (error) {
      console.error('Failed to save analyses to localStorage:', error);
      // If quota exceeded, try to remove the oldest analyses
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        if (savedAnalyses.length > 1) {
          // Remove the oldest analyses and try again
          const reducedAnalyses = savedAnalyses.slice(0, Math.max(1, savedAnalyses.length - 1));
          setSavedAnalyses(reducedAnalyses);
        }
      }
    }
  }, [savedAnalyses]);

  // Add a new analysis to the saved list
  const saveAnalysis = (analysis: Omit<SavedAnalysis, 'id' | 'date'>) => {
    const newAnalysis: SavedAnalysis = {
      ...analysis,
      id: `analysis-${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    setSavedAnalyses(prev => [newAnalysis, ...prev]);
    setSelectedAnalysisId(newAnalysis.id);
  };

  // Delete an analysis from the saved list
  const deleteAnalysis = (id: string) => {
    setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== id));
    if (selectedAnalysisId === id) {
      setSelectedAnalysisId(null);
    }
  };

  // Reorder analyses (for drag and drop functionality)
  const reorderAnalyses = (startIndex: number, endIndex: number) => {
    const result = Array.from(savedAnalyses);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setSavedAnalyses(result);
  };

  const value = {
    savedAnalyses,
    saveAnalysis,
    deleteAnalysis,
    reorderAnalyses,
    selectedAnalysisId,
    setSelectedAnalysisId,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}