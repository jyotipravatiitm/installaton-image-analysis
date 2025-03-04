import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from '@/components/providers/session-provider';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { AnalysisProvider } from '@/context/analysis-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Image Analysis',
  description: 'Analyze electrical wiring and component images with AI',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <AnalysisProvider>
            {children}
            <Toaster />
          </AnalysisProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
