import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Remove Inter
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

// const inter = Inter({ subsets: ["latin"] }); // Remove Inter usage

export const metadata: Metadata = {
  title: "Croatia360 - Premium Vodič kroz Hrvatsku", // Updated title for a more premium feel
  description: "Vaš personalizirani AI vodič za otkrivanje čuda Hrvatske. Sofisticirano, elegantno, nezaboravno.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans"> 
      <body> 
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main> 
          <Footer />
          <Toaster />
        </div>
      </body>
    </html>
  );
}

