import React from 'react';
import Link from 'next/link';
import { Wallet, Code2, Palette, FileText, Megaphone, PenTool, ShieldCheck, ArrowUpRight } from 'lucide-react';
import type { Job } from '@/types';

interface GigCardProps {
  id: string;
  title: string;
  client: string;
  budget: number;
  category: Job['category'];
}

export default function GigCard({ id, title, client, budget, category }: GigCardProps) {

  // Map categories to icons and colors
  const categoryConfig: Record<Job['category'], { Icon: typeof Code2; color: string; bg: string }> = {
    'Dev': { Icon: Code2, color: 'text-[var(--accent-green)]', bg: 'bg-[var(--accent-green-dim)]' },
    'Smart Contract': { Icon: ShieldCheck, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    'Design': { Icon: Palette, color: 'text-[var(--accent-purple)]', bg: 'bg-[var(--accent-purple-dim)]' },
    'Audit': { Icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    'Marketing': { Icon: Megaphone, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    'Writing': { Icon: PenTool, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  };

  const { Icon, color, bg } = categoryConfig[category] || { Icon: Code2, color: 'text-gray-400', bg: 'bg-gray-400/10' };

  return (
    <Link href={`/gig/${id}`} className="block group">
      <div className="card hover-lift p-5 h-full flex flex-col">

        {/* Header: Category & Arrow */}
        <div className="flex items-start justify-between mb-4">
          <div className={`${bg} ${color} p-2.5 rounded-xl`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
        </div>

        {/* Badge */}
        <span className="badge mb-3 w-fit text-xs">
          {category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-[var(--text-primary)] mb-2 leading-snug line-clamp-2 flex-grow">
          {title}
        </h3>

        {/* Client */}
        <p className="text-xs text-[var(--text-muted)] mb-4">
          by <span className="text-[var(--text-secondary)]">@{client}</span>
        </p>

        {/* Divider */}
        <div className="divider mb-4"></div>

        {/* Footer: Budget */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)] font-medium">Budget</span>
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[var(--accent-green)]" />
            <span className="font-bold text-[var(--text-primary)]">{budget}</span>
            <span className="text-xs text-[var(--text-muted)]">USDC</span>
          </div>
        </div>

      </div>
    </Link>
  );
}