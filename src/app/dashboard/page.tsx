"use client";
import React, { useState, useEffect } from 'react';
import { X, Loader2, Briefcase, FileCheck, ChevronRight, User } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/supabase';
import { useToast } from '@/components/Toaster';
import type { Job, Application } from '@/types';

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [view, setView] = useState<'client' | 'freelancer'>('client');

  // Data State
  const [clientJobs, setClientJobs] = useState<Job[]>([]);
  const [freelancerApps, setFreelancerApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Fetch Dashboard Data
  useEffect(() => {
    if (!publicKey) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const wallet = publicKey.toString();

        const { data: myJobs } = await supabase
          .from('jobs')
          .select('*')
          .eq('client_wallet', wallet)
          .order('created_at', { ascending: false });

        if (myJobs) setClientJobs(myJobs);

        const { data: myApps } = await supabase
          .from('applications')
          .select('*, jobs(title, budget)')
          .eq('freelancer_wallet', wallet)
          .order('created_at', { ascending: false });

        if (myApps) setFreelancerApps(myApps as Application[]);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicKey]);

  const handleViewApplicants = async (jobId: string) => {
    setSelectedJobId(jobId);
    setLoadingApplicants(true);

    try {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId);

      setApplicants((data as Application[]) || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleHire = (applicationId: string) => {
    toast.info(`Hiring flow for application ${applicationId} coming in Phase 4!`);
  }

  if (!publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center p-8 card max-w-md mx-4">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-purple-dim)] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[var(--accent-purple)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Connect Your Wallet</h2>
          <p className="text-[var(--text-muted)]">
            Use the wallet button in the navbar to connect and view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-[var(--accent-green-dim)] text-[var(--accent-green)] border-[var(--accent-green)]/30';
      case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'accepted': return 'bg-[var(--accent-green-dim)] text-[var(--accent-green)] border-[var(--accent-green)]/30';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage your jobs and applications</p>
        </div>

        {/* Tab Switcher */}
        <div className="p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] inline-flex">
          <button
            onClick={() => setView('client')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'client'
                ? 'bg-[var(--accent-purple)] text-white shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            <Briefcase className="w-4 h-4" />
            Posted Jobs
          </button>
          <button
            onClick={() => setView('freelancer')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${view === 'freelancer'
                ? 'bg-[var(--accent-green)] text-black shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            <FileCheck className="w-4 h-4" />
            Applications
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-[var(--text-muted)] gap-2">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {/* CLIENT VIEW */}
          {view === 'client' && (
            <div className="space-y-4">
              {clientJobs.map((job) => (
                <div key={job.id} className="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] text-lg truncate">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--text-muted)] mt-1">
                      <span>{job.budget} USDC</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  {job.status === 'open' && (
                    <button
                      onClick={() => handleViewApplicants(job.id)}
                      className="btn btn-secondary text-sm"
                    >
                      View Applicants
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {clientJobs.length === 0 && (
                <div className="text-center py-16 card">
                  <p className="text-[var(--text-muted)]">No jobs posted yet.</p>
                </div>
              )}
            </div>
          )}

          {/* FREELANCER VIEW */}
          {view === 'freelancer' && (
            <div className="space-y-4">
              {freelancerApps.map((app) => (
                <div key={app.id} className="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] text-lg truncate">
                      {app.jobs?.title || "Unknown Job"}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))}
              {freelancerApps.length === 0 && (
                <div className="text-center py-16 card">
                  <p className="text-[var(--text-muted)]">No applications yet.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* APPLICANTS MODAL */}
      {selectedJobId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-subtle)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Applicants</h2>
              <button
                onClick={() => setSelectedJobId(null)}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingApplicants ? (
                <div className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto text-[var(--text-muted)]" />
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => (
                    <div key={app.id} className="p-5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">

                      {/* Applicant Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-green)] flex items-center justify-center text-sm font-bold text-white">
                          {app.freelancer_wallet.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm text-[var(--text-secondary)] font-mono">
                          @{app.freelancer_wallet.slice(0, 8)}...
                        </span>
                      </div>

                      {/* Pitch */}
                      <div className="mb-4">
                        <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-2">Pitch</p>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{app.cover_letter}</p>
                      </div>

                      {/* Requirements Response */}
                      <div className="mb-5">
                        <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-2">Requirements</p>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed border-l-2 border-[var(--accent-purple)] pl-3">
                          {app.requirements_response}
                        </p>
                      </div>

                      <button
                        onClick={() => handleHire(app.id)}
                        className="btn btn-success w-full"
                      >
                        Hire This Freelancer
                      </button>
                    </div>
                  ))}
                  {applicants.length === 0 && (
                    <p className="text-[var(--text-muted)] text-center py-8">No applicants yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}