'use client';
import React, { Component } from 'react'
import Navbar from '@/components/Navbar';
import GigCard from '@/components/GigCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';

const GIGS = [
  { id: '1', title: 'Discord Community Management', price: 700, category: 'Marketing', freelancer: 'shaxxy_baraka' },
  { id: '2', title: 'Middlemint code audit', price: 1000, category: 'Dev', freelancer: 'detrapboi' },
  { id: '3', title: 'Telegram Community Management', price: 500, category: 'Marketing', freelancer: 'alex_wuff' },
  { id: '4', title: 'wuff brand design', price: 400, category: 'Design', freelancer: '200_men' },
  { id: '5', title: 'Backend developer', price: 1000, category: 'Dev', freelancer: 'busha' },
  { id: '5', title: 'Tokenomics and white paper audit', price: 1000, category: 'Writing', freelancer: 'busha' },
] as const

export default function Find() {
    const [query, setQuery] = useState ("");
    return (
      <div className='min-h-screen'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10'>
            {/* The Find page and Search bar */}
            <h1 className='text-4xl font-bold text-white mb-8'>
                Find Web3 Talent
            </h1><br />
            {/* search bar */}
            <div className='relative'>
                <Search className='absolute left-3 top-3.5 w-5 h-5 text-gray-500' />
                <input type="text"
                placeholder='Search by title'
                className="w-full bg-[#1a1b23] border border-gray-700 rounded-lg pl-10 p-3 text-white focus:border-[#14F195] outline-none transition-all"

                value={query}
                onChange={(e)=> setQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Gigs result */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Mock Data Set */}
            {GIGS.filter((item)=>{
            // Case-insensitive search logic
              return item.title.toLowerCase().includes(query.toLowerCase());
            }).map((item) => (
                <GigCard 
                key={item.id}
                id={item.id}
                category={item.category}
                title={item.title}
                freelancer={item.freelancer}
                price={item.price}
                />
            ))}

            {/* empty message */}
            {GIGS.filter(g => g.title.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                <p className='text-gray-500 col-span-full text-center py-10'>
                    No gigs matching '{query}'
                </p>
            )}
        </div>
        </div>

      </div>
    )
  }
