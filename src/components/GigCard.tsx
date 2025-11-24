import React from 'react';
import Link from 'next/link';
import { Wallet, Code2, Palette, FileText, Megaphone } from 'lucide-react';

interface GigCardProps {
  id: string;
  title: string;
  // Changed 'freelancer' to 'client' because the Hirer posts this
  client: string; 
  // Changed 'price' to 'budget' to be accurate
  budget: number;
  category: 'Dev' | 'Design' | 'Audit' | 'Marketing';
}

export default function GigCard({ id, title, client, budget, category }: GigCardProps) {
  
  let Icon = Code2;
  let colorClass = "text-gray-400";
  
  if (category === 'Dev') { Icon = Code2; colorClass = "text-[#14F195]"; }
  if (category === 'Design') { Icon = Palette; colorClass = "text-[#9945FF]"; }
  if (category === 'Audit') { Icon = FileText; colorClass = "text-blue-400"; }
  if (category === 'Marketing') { Icon = Megaphone; colorClass = "text-yellow-400"; }

  return (
    <Link href={`/gig/${id}`} className="block group">
      <div className="bg-[#1a1b23] border border-white/5 rounded-xl overflow-hidden hover:translate-y-[-4px] transition duration-300">
        
        {/* Job Category Icon */}
        <div className="h-32 bg-[#1e1e24] relative flex items-center justify-center">
          <div className={`transition duration-300 group-hover:scale-110 ${colorClass}`}>
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