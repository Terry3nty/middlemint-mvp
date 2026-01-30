import React from 'react';
import Link from 'next/link';
import { Wallet, Code2, Palette, FileText, Megaphone, PenTool } from 'lucide-react';
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
  const categoryConfig: Record<Job['category'], { Icon: typeof Code2; color: string }> = {
    'Dev': { Icon: Code2, color: 'text-[#14F195]' },
    'Smart Contract': { Icon: Code2, color: 'text-orange-400' },
    'Design': { Icon: Palette, color: 'text-[#9945FF]' },
    'Audit': { Icon: FileText, color: 'text-blue-400' },
    'Marketing': { Icon: Megaphone, color: 'text-yellow-400' },
    'Writing': { Icon: PenTool, color: 'text-pink-400' },
  };

  const { Icon, color } = categoryConfig[category] || { Icon: Code2, color: 'text-gray-400' };

  return (
    <Link href={`/gig/${id}`} className="block group">
      <div className="bg-[#1a1b23] border border-white/5 rounded-xl overflow-hidden hover:translate-y-[-4px] transition duration-300">

        {/* Job Category Icon */}
        <div className="h-32 bg-[#1e1e24] relative flex items-center justify-center">
          <div className={`transition duration-300 group-hover:scale-110 ${color}`}>
            <Icon className="w-12 h-12" />
          </div>
          {/* Badge */}
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
            {category}
          </div>
        </div>

        {/* Job Details */}
        <div className="p-5">
          <h3 className="font-bold text-white mb-2 leading-tight min-h-[3rem] line-clamp-2">
            {title}
          </h3>

          <p className="text-xs text-gray-500 mb-4">
            Posted by <span className="text-gray-300">@{client}</span>
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-1 text-gray-400">
              <span className="text-xs">Est. Budget</span>
            </div>
            <div className="text-right flex items-center gap-1 text-[#14F195]">
              <Wallet className="w-3 h-3" />
              <span className="font-bold text-white">{budget} USDC</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}