"use client";

import React, { useState } from 'react'
import Link from "next/link"
import Image from 'next/image'
import { Button } from './ui/button' // or '@/components/ui/button'

const navigation = [
    { name: 'Find Talent', href: '/find' },
    { name: 'Post a gig', href: '/post' },
    { name: 'My Orders', href: '/dashboard' },
]

const Navbar = () => {
    // 1. The Memory (State)
    const [btnText, setBtnText] = useState("Connect Wallet");

    // 2. The Logic
    const handleClick = () => {
        if (btnText === "Connect Wallet") {
            setBtnText("8hzyf...gyhs"); // Change to wallet address
        } else {
            setBtnText("Connect Wallet"); // Toggle back
        }
    };

    return (
        // Added: Border, Dark Background, Sticky positioning
        <nav className='border-b border-white/10 bg-[#0f1014] text-white sticky top-0 z-50 backdrop-blur-md'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                    
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Link href={'/'} className="flex items-center gap-2">
                            {/* Placeholder div if image fails, or use Image */}
                            <div className="relative w-8 h-8">
                                {/* Using a simple div for the logo 'M' to match prototype style */}
                                <Image 
                                    src={'/icon.png'}
                                    alt='middlemint logo'
                                    width={128}
                                    height={128}
                                    className="w-8 h-8 bg-gradient-to-br from-purple-600 to-green-400 rounded-lg flex items-center justify-center font-bold text-white"
                                />
                            </div>
                            <h2 className="font-bold text-xl tracking-tight ml-2">Middlemint</h2>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
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

                    {/* Connect Button */}
                    <div>
                        <Button 
                            variant="default" 
                            size="lg" 
                            onClick={handleClick}
                            // Added: Purple gradient style from prototype
                            className="bg-[#512da8] hover:bg-[#452690] text-white font-semibold transition-all"
                        >
                            {btnText}
                        </Button>
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar;