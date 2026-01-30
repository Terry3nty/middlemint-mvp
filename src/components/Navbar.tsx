"use client";

import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { Menu, X } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const navigation = [
    { name: 'Find Gigs', href: '/find' },
    { name: 'Post a Job', href: '/post' },
    { name: 'My Orders', href: '/dashboard' },
]

const Navbar = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true) }, []);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className='border-b border-white/10 bg-[#0f1014] text-white sticky top-0 z-50 backdrop-blur-md'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href={'/'} className="flex items-center gap-2">
                            <div className="relative w-8 h-8"></div>
                            <h2 className="font-bold text-xl tracking-tight hidden sm:block">Middlemint</h2>
                        </Link>
                    </div>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <div className='hidden md:block'>
                        <div className="flex items-baseline space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Wallet & Mobile Toggle */}
                    <div className="flex items-center gap-4">

                        {/* Wallet Button (Visible on both) */}
                        {mounted && (
                            <WalletMultiButton style={{
                                backgroundColor: '#512da8',
                                height: '40px',
                                borderRadius: '8px'
                            }} />
                        )}

                        {/* Mobile Menu Button (Hidden on Desktop) */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown (Only visible when open) */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#0f1014]">
                    <Link onClick={() => setIsMobileMenuOpen(false)} href='/' className='text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium' >Home</Link>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-300 hover:text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar;