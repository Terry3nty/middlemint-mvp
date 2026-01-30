'use client';
import React, { useState, useEffect } from 'react'
import GigCard from '@/components/GigCard';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/supabase';
import type { Job } from '@/types';

export default function Find() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10'>
        {/* The Find page and Search bar */}
        <h1 className='text-4xl font-bold text-white mb-8'>
          Find Web3 Talent
        </h1>
        <br />
        {/* search bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-3.5 w-5 h-5 text-gray-500' />
          <input
            type="text"
            placeholder='Search by title'
            className="w-full bg-[#1a1b23] border border-gray-700 rounded-lg pl-10 p-3 text-white focus:border-[#14F195] outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Gigs result */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>
        {loading ? (
          <div className="flex justify-center py-20 text-gray-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" /> Loading jobs...
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {jobs
              .filter((job) => job.title.toLowerCase().includes(query.toLowerCase()))
              .map((job) => (
                <GigCard
                  key={job.id}
                  id={job.id}
                  category={job.category}
                  title={job.title}
                  client={job.client_wallet.slice(0, 4) + '...' + job.client_wallet.slice(-4)}
                  budget={job.budget}
                />
              ))
            }
            {jobs.length === 0 && <p className="text-gray-500">No jobs found.</p>}
          </div>
        )}
      </div>
    </div>
  )
}