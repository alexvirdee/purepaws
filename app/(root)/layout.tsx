import NextAuthSessionProvider from "@/components/SessionProvider";
import Header from "@/components/shared/header";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <NextAuthSessionProvider>
        <Header></Header>
        <main className="flex-1 wrapper">
          {children}
        </main>
        <Footer></Footer>
      </NextAuthSessionProvider>
    </div>
  );
}