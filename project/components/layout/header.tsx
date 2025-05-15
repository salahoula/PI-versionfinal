"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    
    return (
      <Link 
        href={href}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
          isActive 
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-6">
            MicroShop
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/about">About</NavLink>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container px-4 py-3 space-y-3">
            <Link 
              href="/" 
              className="block px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="block px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className="block px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {!isAuthenticated && (
              <div className="flex space-x-2 px-4 py-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="default" className="w-full" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}