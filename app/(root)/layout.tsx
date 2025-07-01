'use client';

import { SessionProvider } from "next-auth/react";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <SessionProvider>
        <Header></Header>
        <main className="flex-1 wrapper">
          {children}
        </main>
        <Footer></Footer>
      </SessionProvider>
    </div>
  );
}