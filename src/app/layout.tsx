import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'], 
  variable: '--font-poppins' 
});

export const metadata: Metadata = {
  title: 'TicketBharat - India\'s Premier Event Ticketing Platform',
  description: 'Book tickets for movies, concerts, sports, theater and comedy shows across India. AI-powered chatbot for seamless booking experience.',
  keywords: 'tickets, booking, movies, concerts, events, India, entertainment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎫</text></svg>" />
      </head>
      <body className={cn('h-full font-sans antialiased', inter.variable, poppins.variable)}>
        <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 font-body text-foreground">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
