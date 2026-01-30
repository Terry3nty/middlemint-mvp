"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, Loader2, Clock, Wallet, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/components/Toaster';
import type { Job } from '@/types';

export default function JobDetailPage() {
    const params = useParams();
    const { publicKey } = useWallet();
    const { toast } = useToast();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    // Application State
    const [isApplying, setIsApplying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applicationData, setApplicationData] = useState({
        coverLetter: "",
        requirementsResponse: ""
    });

    useEffect(() => {
        const fetchJob = async () => {
            if (!params.id) return;
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setJob(data);

                if (publicKey && data) {
                    setIsOwner(publicKey.toString() === data.client_wallet);
                }

                if (publicKey && data) {
                    const { data: existingApp } = await supabase
                        .from('applications')
                        .select('id')
                        .eq('job_id', data.id)
                        .eq('freelancer_wallet', publicKey.toString())
                        .single();

                    setHasApplied(!!existingApp);
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [params.id, publicKey]);

    const handleApply = async () => {
        if (!publicKey) {
            toast.error("Please connect your wallet first!");
            return;
        }

        if (isOwner) {
            toast.error("You cannot apply to your own job!");
            return;
        }

        if (hasApplied) {
            toast.error("You have already applied to this job!");
            return;
        }

        if (!applicationData.coverLetter || !applicationData.requirementsResponse) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('applications').insert([{
                job_id: job?.id,
                freelancer_wallet: publicKey.toString(),
                cover_letter: applicationData.coverLetter,
                requirements_response: applicationData.requirementsResponse,
                status: 'pending'
            }]);

            if (error) throw error;

            toast.success("Application sent! The client will review it.");
            setHasApplied(true);
            setIsApplying(false);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            toast.error("Error: " + message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center card p-8 max-w-md mx-4">
                    <p className="text-[var(--text-primary)] text-xl font-semibold mb-2">Job Not Found</p>
                    <p className="text-[var(--text-muted)] mb-4">This job may have been removed.</p>
                    <Link href="/find" className="btn btn-primary">
                        Browse Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">

            {/* Back Link */}
            <Link
                href="/find"
                className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Job Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Header */}
                    <div>
                        <span className="badge mb-3">{job.category}</span>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] pb-4 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>@{job.client_wallet.slice(0, 8)}...</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Description</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                            {job.description || "No description provided."}
                        </p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="card p-6 border-[var(--accent-purple)]/20">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3 uppercase tracking-wide">
                                Required for Application
                            </h4>
                            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed border-l-2 border-[var(--accent-purple)] pl-4">
                                {job.requirements}
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT: Application Card */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24">

                        {/* Budget */}
                        <div className="text-center mb-6 pb-6 border-b border-[var(--border-subtle)]">
                            <span className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wide">Budget</span>
                            <div className="mt-2 flex items-center justify-center gap-2">
                                <Wallet className="w-5 h-5 text-[var(--accent-green)]" />
                                <span className="text-3xl font-bold text-[var(--text-primary)]">{job.budget}</span>
                                <span className="text-lg text-[var(--text-muted)]">USDC</span>
                            </div>
                        </div>

                        {/* States */}
                        {isOwner ? (
                            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
                                <p className="text-yellow-400 text-sm font-medium">This is your job posting</p>
                            </div>
                        ) : hasApplied ? (
                            <div className="p-4 rounded-xl bg-[var(--accent-green-dim)] border border-[var(--accent-green)]/20 text-center">
                                <p className="text-[var(--accent-green)] text-sm font-medium">✓ Application Submitted</p>
                            </div>
                        ) : !isApplying ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-[var(--accent-green-dim)] flex gap-3">
                                    <ShieldCheck className="w-5 h-5 text-[var(--accent-green)] flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        Payment will be <strong className="text-[var(--text-primary)]">secured in Escrow</strong> when the client hires you.
                                    </p>
                                </div>
                                <button
                                    className="btn btn-success w-full py-4 text-base glow-green"
                                    onClick={() => setIsApplying(true)}
                                >
                                    Apply Now
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-[var(--text-primary)]">Your Pitch</h3>
                                    <button
                                        onClick={() => setIsApplying(false)}
                                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <textarea
                                    className="input resize-none"
                                    rows={4}
                                    placeholder="Why are you a good fit for this job?"
                                    value={applicationData.coverLetter}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                                ></textarea>

                                <div className="p-4 rounded-xl bg-[var(--accent-purple-dim)] border border-[var(--accent-purple)]/30">
                                    <label className="block text-xs font-bold text-[var(--accent-purple)] mb-2 uppercase">
                                        Requirements Response
                                    </label>
                                    <input
                                        className="input bg-[var(--bg-base)]"
                                        placeholder="Links, proof, or relevant info..."
                                        value={applicationData.requirementsResponse}
                                        onChange={(e) => setApplicationData(prev => ({ ...prev, requirementsResponse: e.target.value }))}
                                    />
                                </div>

                                <button
                                    className="btn btn-success w-full"
                                    onClick={handleApply}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}