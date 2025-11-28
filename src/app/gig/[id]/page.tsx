"use client";
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, ShieldCheck, Calendar, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase';

export default function JobDetailPage() {
  const params = useParams();
  // State to hold the single job data
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!params.id) return;

      try {
        // Fetch the specific row where id matches the URL param
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', params.id)
          .single(); // We expect only one result

        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-white gap-2">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading job details...
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-[#0f1014] flex flex-col items-center justify-center text-gray-500 gap-4">
        <p>Job not found 😢</p>
        <Link href="/find" className="text-[#9945FF] hover:underline">Back to Jobs</Link>
    </div>
  );

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <Link href="/find" className="flex items-center text-gray-400 hover:text-white mb-8 transition text-sm w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: The Job Content */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Header Info */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#9945FF]/10 text-[#9945FF] border border-[#9945FF]/20 px-3 py-1 rounded-full text-xs font-medium">
                        {job.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3"/> 
                        {new Date(job.created_at).toLocaleDateString()}
                    </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {job.title}
                </h1>
                
                {/* Client Info Bar */}
                <div className="flex items-center gap-4 text-sm text-gray-400 border-y border-white/10 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                            {job.client_wallet ? job.client_wallet.slice(0, 2) : 'CL'}
                        </div>
                        <div>
                            <span className="block text-white font-medium">
                                @{job.client_wallet ? job.client_wallet.slice(0,6) + '...' : 'Unknown'}
                            </span>
                            <span className="text-xs">Client</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Requirements */}
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <h3 className="text-xl font-semibold text-white">Job Description</h3>
                <p className="whitespace-pre-wrap">{job.description}</p>
                
                {/* Application Requirements Box */}
                {job.requirements && (
                    <div className="bg-[#1a1b23] p-6 rounded-lg border border-white/10 mt-6">
                        <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Required for Application:</h4>
                        <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed border-l-2 border-[#9945FF] pl-4">
                            {job.requirements}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Sticky Action Card */}
        <div className="lg:col-span-1 relative">
            <div className="bg-[#1a1b23] border border-white/5 p-6 rounded-xl sticky top-24">
                
                <div className="text-center mb-6">
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">Client Budget</span>
                    <div className="mt-2">
                        <span className="text-4xl font-bold text-white">{job.budget}</span>
                        <span className="text-xl text-gray-500 font-bold ml-1">USDC</span>
                    </div>
                </div>

                <div className="bg-[#14F195]/5 border border-[#14F195]/20 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                        <ShieldCheck className="w-5 h-5 text-[#14F195] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-300 leading-snug">
                            Payment is <strong>secured in Escrow</strong>. The client deposits funds upfront, and you get paid automatically upon approval.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button 
                        className="w-full bg-[#14F195] hover:bg-[#10c479] text-black font-bold py-6 text-lg rounded-lg transition-all shadow-[0_0_20px_rgba(20,241,149,0.2)]"
                        onClick={() => alert("Application logic coming soon!")}
                    >
                        Apply Now
                    </Button>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}