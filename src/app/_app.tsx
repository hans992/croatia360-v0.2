// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Ili vaš odabrani font, npr. Geist
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css'; // Provjerite je li ovo ispravna putanja do vašeg global.css

// Konfiguracija fonta (primjer s Inter, prilagodite ako koristite Geist)
const inter = Inter({ subsets: ['latin'] });

// Osnovni metadata, možete proširiti
export const metadata: Metadata = {
  title: 'Croatia360',
  description: 'Pametni pristup hrvatskom turizmu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Ispravno tipiziranje za children
}) {
  return (
    <html lang="hr" suppressHydrationWarning> {/* suppressHydrationWarning je koristan s next-themes */}
      <body className={inter.className}> {/* Primijenite klasu fonta */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange // Ovo može pomoći kod nekih tranzicija
        >
          <main>{children}</main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}