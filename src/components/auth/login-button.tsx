"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface LoginButtonProps {
  mode?: "modal" | "redirect";
  className?: string;
}

export function LoginButton({ mode = "redirect", className }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      className={className}
      disabled={isLoading}
      variant="outline"
      size="lg"
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
      ) : (
        <>
          <FcGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </>
      )}
    </Button>
  );
}