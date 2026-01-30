"use client";

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import Image from 'next/image'
import { Menu, X, Search, Briefcase, LayoutDashboard } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ThemeToggle } from './ThemeProvider';

const navigation = [
    { name: 'Find Gigs', href: '/find', icon: Search },
    { name: 'Post a Job', href: '/post', icon: Briefcase },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
]

const Navbar = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true) }, []);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'
            }`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>

                    {/* Logo Section */}
                    <Link href={'/'} className="flex items-center gap-3 group">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden">
                            <Image
                                src="/icon.png"
                                alt="Middlemint"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-bold text-lg tracking-tight hidden sm:block group-hover:text-[var(--accent-primary)] transition-colors">
                            Middlemint
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-1'>
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side: Theme Toggle, Wallet & Mobile Toggle */}
                    <div className="flex items-center gap-2">

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Wallet Button */}
                        {mounted && (
                            <WalletMultiButton style={{
                                background: 'linear-gradient(135deg, #00B4D8, #1E3A8A)',
                                height: '40px',
                                padding: '0 20px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '14px',
                                fontWeight: '600',
                                fontFamily: 'Inter, sans-serif',
                                border: 'none',
                                boxShadow: '0 2px 12px rgba(0, 180, 216, 0.35)',
                                transition: 'all 0.2s ease',
                            }} />
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="px-4 py-3 space-y-1 glass-strong border-t border-[var(--border-subtle)]">
                    <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        href='/'
                        className='flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all'
                    >
                        Home
                    </Link>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;