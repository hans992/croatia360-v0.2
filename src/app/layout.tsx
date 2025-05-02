import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner"; // Assuming Toaster is needed later

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Croatia360 - Pametni pristup hrvatskom turizmu",
  description: "Vaš pametni vodič za planiranje savršenog odmora u Hrvatskoj.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">{/* Set language to Croatian */}
      <body className={inter.className}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster /> {/* Include Toaster for notifications */}
      </body>
    </html>
  );
}

