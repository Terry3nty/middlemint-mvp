"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Bookmark, 
  Share2, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon 
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// 1. Unified Mock Data (Matches Find Page EXACTLY)
const MOCK_JOBS = [
  { 
    id: '1', 
    title: 'Discord Community Management', 
    budget: 700, 
    category: 'Marketing', 
    client: 'shaxxy_baraka', // Matches the 'freelancer' field from Find page
    posted: '2 days ago',
    verified: true,
    location: 'Remote',
    description: "We are looking for an experienced Community Manager to take ownership of our DAO Discord. You will be the voice of the project, engaging with holders and managing a team of moderators.",
    responsibilities: [
        "Engage with the community daily and answer support tickets",
        "Organize weekly AMAs and Twitter Spaces",
        "Manage role assignments and bot configurations"
    ],
    skills: ["Discord", "Community", "Web3", "English"],
  },
  { 
    id: '2', 
    title: 'Middlemint code audit', 
    budget: 1000, 
    category: 'Audit', 
    client: 'detrapboi',
    posted: '5 hours ago',
    verified: true,
    location: 'Remote',
    description: "We need a second pair of eyes on our Anchor smart contract before mainnet launch. The program handles escrow logic and PDA validation.",
    responsibilities: [
        "Review 4 Anchor program files (~800 lines)",
        "Identify re-entrancy and PDA vulnerabilities",
        "Provide a PDF report with severity classification"
    ],
    skills: ["Rust", "Solana", "Anchor", "Security"],
  },
  { 
    id: '3', 
    title: 'Discord Community Management', 
    budget: 500, 
    category: 'Marketing', 
    client: 'alex_wuff',
    posted: '1 day ago',
    verified: false,
    location: 'Remote',
    description: "Need someone to setup bots and roles for a new NFT collection launch.",
    responsibilities: ["Bot Setup", "Role Config", "Spam Protection"],
    skills: ["Discord", "Bots"],
  },
  { 
    id: '4', 
    title: 'wuff brand design', 
    budget: 400, 
    category: 'Design', 
    client: '200_men',
    posted: '3 days ago',
    verified: true,
    location: 'Remote',
    description: "Need a memecoin logo and banner for our Twitter profile.",
    responsibilities: ["Logo Design", "Banner Design", "Social Assets"],
    skills: ["Figma", "Illustrator", "Memes"],
  },
];

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id;
  
  // Find the job
  const job = MOCK_JOBS.find(j => j.id === id);

  if (!job) return (
    <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-gray-500">
        Job not found 😢
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
                    <span className="text-gray-500 text-sm">• Posted {job.posted}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {job.title}
                </h1>
                
                {/* Client Info Bar */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 border-y border-white/10 py-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                            {job.client.substring(0, 2)}
                        </div>
                        <div>
                            <span className="block text-white font-medium">@{job.client}</span>
                            <span className="text-xs">Client</span>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10"></div>
                    
                    {job.verified && (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                            <span>Payment Verified</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                    </div>
                </div>
            </div>

            {/* Description & Requirements */}
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <h3 className="text-xl font-semibold text-white">Job Description</h3>
                <p>{job.description}</p>
                
                {job.responsibilities && (
                    <>
                        <h4 className="text-lg font-semibold text-white mt-8 mb-2">Responsibilities:</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-400">
                            {job.responsibilities.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {/* Skills Tags */}
            <div className="pt-6">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, i) => (
                        <span key={i} className="bg-[#1a1b23] border border-white/10 px-3 py-1 rounded-md text-sm text-gray-300">
                            {skill}
                        </span>
                    ))}
                </div>
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
                    <Button className="w-full bg-[#14F195] hover:bg-[#10c479] text-black font-bold py-6 text-lg rounded-lg transition-all shadow-[0_0_20px_rgba(20,241,149,0.2)] flex items-center justify-center gap-2">
                        Apply Now
                        <Send className="w-5 h-5" />
                    </Button>
                    
                    <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium py-3 rounded-lg transition flex items-center justify-center gap-2">
                        <Bookmark className="w-4 h-4" />
                        Save Job
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-500 mb-2">Share this job</p>
                    <div className="flex justify-center gap-4 text-gray-400">
                        <button className="hover:text-white transition"><Twitter className="w-5 h-5" /></button>
                        <button className="hover:text-white transition"><Linkedin className="w-5 h-5" /></button>
                        <button className="hover:text-white transition"><LinkIcon className="w-5 h-5" /></button>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}