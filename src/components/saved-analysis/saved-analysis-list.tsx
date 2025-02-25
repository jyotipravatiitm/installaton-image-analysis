"use client";

import { useAnalysis } from "@/context/analysis-context";
import { SavedAnalysisItem } from "./saved-analysis-item";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

export function SavedAnalysisList() {
  const { savedAnalyses, reorderAnalyses } = useAnalysis();
  const [showAll, setShowAll] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // If there are more than 5 analyses, only show the first 5 unless showAll is true
  const displayedAnalyses = showAll ? savedAnalyses : savedAnalyses.slice(0, 5);
  const hasMoreToShow = savedAnalyses.length > 5 && !showAll;
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = savedAnalyses.findIndex(a => a.id === active.id);
      const newIndex = savedAnalyses.findIndex(a => a.id === over.id);
      
      reorderAnalyses(oldIndex, newIndex);
    }
  }
  
  if (savedAnalyses.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <SaveIcon className="h-8 w-8 mx-auto mb-3 opacity-50" />
        <p>No saved analyses yet.</p>
        <p className="text-sm">Analyze an image and save the results.</p>
      </div>
    );
  }
  
  return (
    <div>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={savedAnalyses.map(a => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {displayedAnalyses.map((analysis, index) => (
            <SavedAnalysisItem
              key={analysis.id}
              analysis={analysis}
              index={index}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {hasMoreToShow && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-xs"
          onClick={() => setShowAll(true)}
        >
          Show all ({savedAnalyses.length})
        </Button>
      )}
      
      {showAll && savedAnalyses.length > 5 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-xs"
          onClick={() => setShowAll(false)}
        >
          Show less
        </Button>
      )}
    </div>
  );
}