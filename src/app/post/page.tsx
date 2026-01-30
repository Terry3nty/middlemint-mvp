'use client';
import React, { useState } from "react";
import { Briefcase, ListChecks, AlertTriangle, Loader2, DollarSign } from 'lucide-react';
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/components/Toaster";

const categories = [
    { value: 'Dev', label: 'Developer' },
    { value: 'Smart Contract', label: 'Smart Contract' },
    { value: 'Design', label: 'Designer' },
    { value: 'Audit', label: 'Audit' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Writing', label: 'Writing' },
];

const Post = () => {
    const router = useRouter();
    const { publicKey } = useWallet();
    const { toast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        category: "Dev",
        budget: "",
        description: "",
        requirements: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmitted = async () => {
        if (!publicKey) {
            toast.error("Please connect your wallet");
            return;
        }

        const title = formData.title.trim();
        const budget = parseFloat(formData.budget);

        if (!title) {
            toast.error("Please provide a title");
            return;
        }

        if (!budget || budget <= 0) {
            toast.error("Please provide a valid budget greater than 0");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('jobs')
                .insert([{
                    title: title,
                    category: formData.category,
                    budget: budget,
                    description: formData.description.trim(),
                    requirements: formData.requirements.trim(),
                    client_wallet: publicKey.toString(),
                    status: 'open',
                }])

            if (error) throw error;

            toast.success("Job posted successfully!");
            router.push('/dashboard')

        } catch (error: unknown) {
            console.error("Error", error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error("Error posting job: " + message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-[var(--accent-purple-dim)]">
                            <Briefcase className="w-5 h-5 text-[var(--accent-purple)]" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                            Create a New Job
                        </h1>
                    </div>
                    <p className="text-[var(--text-muted)]">
                        Fill in the details below to post your gig
                    </p>
                </div>

                {/* Form Card */}
                <div className="card p-6 sm:p-8 space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Gig Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Build a Solana NFT Marketplace"
                            value={formData.title}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    {/* Category and Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input appearance-none cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Budget
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    name="budget"
                                    type="number"
                                    placeholder="500"
                                    min="1"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="input pl-10 pr-16"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">
                                    USDC
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            placeholder="Describe the scope of work, deliverables, and timeline..."
                            value={formData.description}
                            onChange={handleChange}
                            className="input resize-none"
                        ></textarea>
                    </div>

                    {/* Requirements */}
                    <div className="p-5 rounded-xl bg-[var(--accent-purple-dim)] border border-[var(--accent-purple)]/20">
                        <div className="flex items-center gap-2 mb-2">
                            <ListChecks className="w-5 h-5 text-[var(--accent-purple)]" />
                            <label className="text-sm font-bold text-[var(--text-primary)]">
                                Application Requirements
                            </label>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-4 flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 text-yellow-500 flex-shrink-0" />
                            What must freelancers provide when applying?
                        </p>
                        <textarea
                            name="requirements"
                            rows={3}
                            placeholder="• Link to similar past projects&#10;• GitHub profile&#10;• Estimated timeline"
                            value={formData.requirements}
                            onChange={handleChange}
                            className="input resize-none bg-[var(--bg-base)]"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmitted}
                        disabled={isSubmitting}
                        className="btn btn-success w-full py-4 text-base"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            'Post Job'
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Post;