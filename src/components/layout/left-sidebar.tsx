"use client";

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SavedAnalysisList } from "@/components/saved-analysis/saved-analysis-list";
import { 
  Image, 
  FileText, 
  Info, 
  Settings, 
  HelpCircle,
  User,
  History,
  BookmarkIcon
} from "lucide-react";

const samplePrompts = [
  {
    id: 1,
    title: "Wiring Comparison",
    prompt: "Compare and identify which parts of the wiring are correct, which are incorrect, and why. Then, provide clear steps to fix any mistakes. Please respond with JSON having the keys: correctWiring, incorrectWiring, stepsToFix",
    icon: <Image className="h-4 w-4 mr-2" />
  },
  {
    id: 2,
    title: "Breaker Size",
    prompt: "Identify the breaker sizes visible in this image. Check carefully and provide the size written on top of each breaker. Return as JSON.",
    icon: <FileText className="h-4 w-4 mr-2" />
  },
  {
    id: 3,
    title: "Safety Inspection",
    prompt: "Analyze this electrical panel and identify potential safety issues or code violations. List each issue and explain why it's problematic.",
    icon: <Info className="h-4 w-4 mr-2" />
  }
];

export function LeftSidebar() {
  return (
    <div className="h-full border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Enphase Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Upload images and analyze them
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Sample Prompts Section */}
          <div className="space-y-1 pb-4">
            <h3 className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              Sample Prompts
            </h3>
            <div className="space-y-1">
              {samplePrompts.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => window.dispatchEvent(new CustomEvent('set-prompt', { detail: item.prompt }))}
                >
                  {item.icon}
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Saved Analyses Section */}
          <div className="space-y-1 pb-4">
            <h3 className="text-sm font-medium flex items-center">
              <BookmarkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              Saved Analyses
            </h3>
            <div className="mt-2">
              <SavedAnalysisList />
            </div>
          </div>
          
          {/* Account Section */}
          <div className="space-y-1 pb-4 border-t pt-4">
            <h3 className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              Account
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left"
                asChild
              >
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left"
                asChild
              >
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Information Section */}
          <div className="space-y-1 pb-4">
            <h3 className="text-sm font-medium flex items-center">
              <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              Information
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                How to use
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left"
              >
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}