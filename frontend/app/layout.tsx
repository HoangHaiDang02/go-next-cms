import './globals.css';
import type { Metadata } from 'next';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'CMS Demo',
  description: 'Next.js + Go Gin CMS starter'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: '70vh', padding: '1rem' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

