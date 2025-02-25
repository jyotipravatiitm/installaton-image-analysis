"use client";

import { SavedAnalysis } from "@/types/analysis";
import { useAnalysis } from "@/context/analysis-context";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger 
} from "@/components/ui/context-menu";

interface SavedAnalysisItemProps {
  analysis: SavedAnalysis;
  index: number;
}

export function SavedAnalysisItem({ analysis, index }: SavedAnalysisItemProps) {
  const { deleteAnalysis, selectedAnalysisId, setSelectedAnalysisId } = useAnalysis();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: analysis.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const isSelected = selectedAnalysisId === analysis.id;
  
  // Format the date as "X time ago"
  const formattedDate = formatDistanceToNow(parseISO(analysis.date), { addSuffix: true });
  
  // Truncate title if too long
  const truncatedTitle = analysis.title.length > 30
    ? `${analysis.title.substring(0, 30)}...`
    : analysis.title;
  
  const handleSelect = () => {
    setSelectedAnalysisId(analysis.id);
    
    // Clear the form when selecting a saved analysis
    window.dispatchEvent(new CustomEvent('clear-form'));
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAnalysis(analysis.id);
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          style={style}
          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer mb-1 group ${
            isSelected 
              ? "bg-primary/10 border-l-4 border-primary" 
              : "hover:bg-muted border-l-4 border-transparent"
          }`}
          onClick={handleSelect}
          {...attributes}
        >
          <div
            {...listeners}
            className="touch-none flex h-full cursor-grab items-center opacity-0 group-hover:opacity-70"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{truncatedTitle}</h4>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent>
        <ContextMenuItem onClick={handleSelect}>View</ContextMenuItem>
        <ContextMenuItem onClick={handleDelete} className="text-destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}