'use client';
import React, { useState, useEffect } from 'react'
import GigCard from '@/components/GigCard';
import { Search, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '@/supabase';
import type { Job } from '@/types';

const categories = ['All', 'Dev', 'Smart Contract', 'Design', 'Audit', 'Marketing', 'Writing'];

export default function Find() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className='min-h-screen pt-24'>

      {/* Header Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10'>

        <div className="mb-8">
          <h1 className='text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2'>
            Find Web3 Talent
          </h1>
          <p className="text-[var(--text-muted)]">
            Browse {jobs.length} open opportunities
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Search Bar */}
          <div className='relative flex-1'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]' />
            <input
              type="text"
              placeholder='Search jobs by title...'
              className="input pl-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Button (Mobile) */}
          <button className="sm:hidden btn btn-secondary">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                  ? 'bg-[var(--accent-purple)] text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Results Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20'>

        {loading ? (
          <div className="flex justify-center py-20 text-[var(--text-muted)] gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading jobs...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'result' : 'results'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {query && ` for "${query}"`}
            </p>

            {/* Jobs Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {filteredJobs.map((job, index) => (
                <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <GigCard
                    id={job.id}
                    category={job.category}
                    title={job.title}
                    client={job.client_wallet.slice(0, 4) + '...' + job.client_wallet.slice(-4)}
                    budget={job.budget}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-16 card">
                <p className="text-[var(--text-muted)] mb-2">No jobs found.</p>
                <p className="text-sm text-[var(--text-muted)]">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}