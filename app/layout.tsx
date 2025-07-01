import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import NextAuthSessionProvider from "@/components/SessionProvider";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: `${APP_DESCRIPTION}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextAuthSessionProvider>
          <Toaster />
          <Header></Header>
         <main className="flex-1 wrapper">{children}</main> 
          <Footer></Footer>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
