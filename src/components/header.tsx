'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ticket, LayoutDashboard } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/chat', label: 'Chat', icon: Ticket },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-10 w-full neubrutalist-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Ticket className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">Museum Buddy</span>
        </Link>
        <nav className="flex items-center gap-2 rounded-md border-2 border-black bg-white p-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Button
                key={href}
                asChild
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className={cn('neubrutalist-border', {
                  'bg-primary text-primary-foreground neubrutalist-shadow-sm': isActive,
                  'hover:bg-accent/50': !isActive,
                })}
              >
                <Link href={href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
