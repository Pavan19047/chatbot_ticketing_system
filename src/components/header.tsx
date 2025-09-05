'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ticket, LayoutDashboard, Menu, X, Heart, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
];

interface HeaderProps {
  currentLang?: string;
  onLanguageChange?: (lang: 'en' | 'hi') => void;
}

export function Header({ currentLang = 'en', onLanguageChange }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/chat', label: 'Chat', icon: Ticket },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              TicketBharat
            </span>
            <p className="text-xs text-gray-500 -mt-1">India's Entertainment Hub</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1 rounded-full border bg-card p-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Button
                  key={href}
                  asChild
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className={cn('rounded-full', {
                    'shadow-sm': isActive,
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
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Star className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              <Heart className="w-3 h-3 mr-1" />
              Made in India
            </Badge>
          </div>
          
          {/* Language Selector */}
          {onLanguageChange && (
            <div className="flex items-center gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLang === lang.code ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onLanguageChange(lang.code as 'en' | 'hi')}
                  className={`text-sm ${
                    currentLang === lang.code 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                      : "hover:bg-orange-50"
                  }`}
                >
                  {lang.native}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Button
                    key={href}
                    asChild
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </Button>
                );
              })}
            </nav>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <Star className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                <Heart className="w-3 h-3 mr-1" />
                Made in India
              </Badge>
            </div>
            
            {onLanguageChange && (
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLang === lang.code ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onLanguageChange(lang.code as 'en' | 'hi');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-sm ${
                      currentLang === lang.code 
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                        : "hover:bg-orange-50"
                    }`}
                  >
                    {lang.native}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
