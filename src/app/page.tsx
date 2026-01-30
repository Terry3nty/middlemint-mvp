'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import GigCard from '@/components/GigCard';
import { Search, Loader2, ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { supabase } from '@/supabase';
import { useTheme } from '@/components/ThemeProvider';
import type { Job } from '@/types';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Interactive Grid State
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();

  // Grid colors based on theme
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
  const gridColorFaint = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';

  useEffect(() => {
    const fetchTrendingJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("No Trending Jobs found", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingJobs();
  }, []);

  // Handle mouse movement for interactive grid
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="min-h-screen">

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative overflow-hidden pt-32 pb-24"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main Glow - Blue */}
          <div className="absolute top-0 left-1/2 w-[800px] h-[500px] -translate-x-1/2 -translate-y-1/3">
            <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-25 blur-[120px] rounded-full"></div>
          </div>
          {/* Secondary Glow - Navy */}
          <div className="absolute top-40 right-0 w-[400px] h-[400px]">
            <div className="absolute inset-0 bg-[var(--accent-secondary)] opacity-20 blur-[100px] rounded-full"></div>
          </div>

          {/* Interactive Grid - Visible around mouse */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40M0 0v40' fill='none' stroke='${encodeURIComponent(gridColor)}' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
              maskImage: isHovering
                ? `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
                : 'none',
              WebkitMaskImage: isHovering
                ? `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
                : 'none',
              opacity: isHovering ? 1 : 0
            }}
          ></div>

          {/* Static faint grid (always visible) */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40M0 0v40' fill='none' stroke='${encodeURIComponent(gridColorFaint)}' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-purple-dim)] border border-[var(--accent-purple)]/30 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-[var(--accent-purple)]" />
            <span className="text-sm font-medium text-[var(--accent-purple)]">
              Powered by Solana
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-[var(--text-primary)]">The Trustless Bridge for</span>
            <br />
            <span className="gradient-text">Web3 Work</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Hire top talent or find bounties. Connect with skilled freelancers in the Web3 ecosystem with on-chain escrow protection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/find"
              className="btn btn-primary text-base px-8 py-4"
            >
              Find Talent
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/post"
              className="btn btn-secondary text-base px-8 py-4"
            >
              Post a Gig
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-[var(--text-muted)] animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--accent-green)]" />
              <span>Escrow Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--accent-purple)]" />
              <span>Instant USDC Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Verified Freelancers</span>
            </div>
          </div>

        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Section Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
              Trending Now
            </h2>
            <p className="text-[var(--text-muted)]">Latest opportunities from top clients</p>
          </div>
          <Link
            href="/find"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-[var(--accent-purple)] hover:text-[var(--accent-green)] transition-colors"
          >
            View All
            <Search className="w-4 h-4" />
          </Link>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center py-20 text-[var(--text-muted)] gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading trending jobs...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {jobs.map((job, index) => (
              <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <GigCard
                  id={job.id}
                  category={job.category}
                  title={job.title}
                  client={job.client_wallet.slice(0, 4) + '...' + job.client_wallet.slice(-4)}
                  budget={job.budget}
                />
              </div>
            ))}

            {/* Empty State */}
            {jobs.length === 0 && (
              <div className="col-span-full text-center py-16 card">
                <p className="text-[var(--text-muted)] mb-4">No jobs posted yet.</p>
                <Link href="/post" className="text-[var(--accent-green)] hover:underline font-medium">
                  Be the first to post!
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/find"
            className="btn btn-secondary"
          >
            View All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

    </div>
  );
}