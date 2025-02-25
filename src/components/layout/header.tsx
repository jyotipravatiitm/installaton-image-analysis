"use client";

import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { useSession } from "next-auth/react";
import { AuthStatus } from "@/components/auth/auth-status";

interface HeaderProps {
  response: string | Record<string, any> | null;
  isLoading: boolean;
}

export function Header({ response, isLoading }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-background z-10 h-16 flex items-center px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar response={response} isLoading={isLoading} />
        <h1 className="text-xl font-bold md:ml-0">Enphase Image Analysis</h1>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <AuthStatus session={session} />
      </div>
    </header>
  );
}