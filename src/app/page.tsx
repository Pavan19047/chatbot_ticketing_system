import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md neubrutalist-border neubrutalist-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Ticket className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl font-extrabold">
            Museum Buddy
          </CardTitle>
          <p className="text-muted-foreground">
            Your friendly guide to museum tickets.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Choose your language</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona tu idioma
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              asChild
              size="lg"
              className="w-full neubrutalist-border neubrutalist-shadow-sm hover:neubrutalist-shadow transition-shadow"
            >
              <Link href="/chat?lang=en">English</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="w-full neubrutalist-border neubrutalist-shadow-sm hover:neubrutalist-shadow transition-shadow"
            >
              <Link href="/chat?lang=es">Español</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Museum Buddy. All rights reserved.</p>
      </footer>
    </div>
  );
}
