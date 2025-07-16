import type { Metadata } from "next";
import { Roboto, Inter, Merriweather, Dancing_Script } from "next/font/google";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import NextAuthSessionProvider from "@/components/SessionProvider";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: '400',
  subsets: ['latin'],
})

// Primary Sans
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Secondary Serif/Display
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Cursive accent
const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap"
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
        className={`
        ${roboto.variable} 
        ${inter.variable} 
        ${merriweather.variable}
        ${dancingScript.variable}
        antialiased flex flex-col min-h-screen`}
      >
        <NextAuthSessionProvider>
          <Toaster richColors />
          <Header></Header>
          <main className="flex-1 wrapper">{children}</main>
          <Footer></Footer>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
