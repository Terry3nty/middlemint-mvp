'use client';
import React, { Component } from 'react'
import Navbar from '@/components/Navbar';
import GigCard from '@/components/GigCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';

const GIGS = [
  { id: '1', title: 'Discord Community Management', budget: 700, category: 'Marketing', client: 'shaxxy_baraka' },
  { id: '2', title: 'Middlemint code audit', budget: 1000, category: 'Dev', client: 'detrapboi' },
  { id: '3', title: 'Telegram Community Management', budget: 500, category: 'Marketing', client: 'alex_wuff' },
  { id: '4', title: 'wuff brand design', budget: 400, category: 'Design', client: '200_men' },
  { id: '5', title: 'Backend developer', budget: 1000, category: 'Dev', client: 'busha' },
  { id: '6', title: 'Tokenomics and white paper audit', budget: 1000, category: 'Audit', client: 'telq_sir' },
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
                client={item.client}
                budget={item.budget}
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
