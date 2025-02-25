import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";

interface MobileSidebarProps {
  response: string | Record<string, any> | null;
  isLoading: boolean;
}

export function MobileSidebar({ response, isLoading }: MobileSidebarProps) {
  return (
    <>
      {/* Left Sidebar (Mobile) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <LeftSidebar />
        </SheetContent>
      </Sheet>

      {/* Right Sidebar (Mobile) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto lg:hidden">
            View Results
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0">
          <RightSidebar response={response} isLoading={isLoading} />
        </SheetContent>
      </Sheet>
    </>
  );
}