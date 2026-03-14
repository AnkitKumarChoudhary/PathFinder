'use client';

import Link from 'next/link';
import { Bookmark, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatSalary } from '@/lib/format-salary';
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface Career {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  averageSalary: string | Record<string, number> | null;
  demandLevel: string;
  matchScore?: number;
  isSaved?: boolean;
}

interface RecommendedCareersProps {
  careers?: Career[];
  isLoading?: boolean;
}

const getCategoryColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('engineering') || cat.includes('technology')) return 'border-brand-forest';
  if (cat.includes('medical') || cat.includes('health')) return 'border-status-error';
  if (cat.includes('business') || cat.includes('finance')) return 'border-brand-sand';
  if (cat.includes('creative') || cat.includes('design') || cat.includes('arts')) return 'border-brand-terracotta';
  if (cat.includes('law') || cat.includes('legal')) return 'border-status-info';
  if (cat.includes('government') || cat.includes('public')) return 'border-charcoal';
  return 'border-brand-sage'; // Default
};

export function RecommendedCareers({ careers = [], isLoading = false }: RecommendedCareersProps) {
  const queryClient = useQueryClient();
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const handleToggleSave = async (e: React.MouseEvent, career: Career) => {
    e.preventDefault(); // Prevent navigating if it's inside a Link
    if (savingIds.has(career.id)) return;

    setSavingIds(prev => new Set(prev).add(career.id));
    try {
      await api.post(`/careers/${career.id}/save`);
      queryClient.invalidateQueries({ queryKey: ['recommendedCareers'] });
      queryClient.invalidateQueries({ queryKey: ['savedCareers'] });
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(career.id);
        return next;
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full flex-col flex gap-4"
    >
      <div className="flex justify-between items-end">
        <h3 className="font-heading text-heading-3 text-charcoal dark:text-gray-100">Recommended for You</h3>
        <Link href="/student/careers" className="text-brand-forest text-sm font-medium hover:underline">
          View All &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-base p-5 h-48 animate-pulse bg-gray-100 dark:bg-dark-elevated"></div>
          ))}
        </div>
      ) : careers.length === 0 ? (
        <div className="card-base p-8 flex flex-col items-center justify-center text-center bg-brand-cream/50 dark:bg-dark-surface border border-dashed border-gray-300 dark:border-dark-border">
          <div className="w-12 h-12 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest mb-4">
            <Compass size={24} />
          </div>
          <h4 className="font-heading text-heading-4 mb-2">No recommendations yet</h4>
          <p className="text-muted text-body-sm max-w-sm mb-6">
            Take an assessment to get personalized career matches tailored to your profile!
          </p>
          <Link href="/student/assessment" className="btn-primary">
            Take Assessment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careers.map((career) => (
            <Link 
              href={`/student/careers/${career.id}`} 
              key={career.id}
              className={`card-base card-accent-left p-5 flex flex-col relative group hover:translate-y-[-4px] hover:shadow-card-hover transition-all duration-300 ${getCategoryColor(career.category)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-dark-border rounded text-charcoal dark:text-gray-300">
                  {career.category}
                </span>
                <button 
                  onClick={(e) => handleToggleSave(e, career)}
                  disabled={savingIds.has(career.id)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors ${career.isSaved ? 'text-brand-terracotta' : 'text-gray-400'}`}
                >
                  <Bookmark size={20} className={career.isSaved ? 'fill-current' : ''} />
                </button>
              </div>
              
              <h4 className="font-heading text-heading-4 font-semibold mb-1 line-clamp-1 group-hover:text-brand-forest transition-colors">
                {career.title}
              </h4>
              <p className="text-body-sm text-muted line-clamp-2 mb-4 flex-grow">
                {career.shortDescription}
              </p>
              
              <div className="flex flex-col gap-2 mt-auto">
                {career.matchScore && (
                  <div className="badge-forest w-max text-xs">{career.matchScore}% Match</div>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${career.demandLevel === 'High' ? 'bg-status-success/10 text-status-success' : 'bg-gray-100 text-gray-600'}`}>
                    {career.demandLevel} Demand
                  </span>
                  <span className="text-xs font-medium text-charcoal dark:text-gray-300">
                    {formatSalary(career.averageSalary)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
