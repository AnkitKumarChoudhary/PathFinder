'use client';

import Link from 'next/link';
import { Book, PlayCircle, FileText, Wrench, GraduationCap, LayoutPanelLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  type: string;
  provider?: string;
  difficulty?: string;
  url?: string;
}

interface RecentResourcesProps {
  resources?: Resource[];
  isLoading?: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'VIDEO': return <PlayCircle size={14} className="mr-1" />;
    case 'ARTICLE': return <FileText size={14} className="mr-1" />;
    case 'BOOK': return <Book size={14} className="mr-1" />;
    case 'COURSE': return <GraduationCap size={14} className="mr-1" />;
    case 'TOOL': return <Wrench size={14} className="mr-1" />;
    default: return <LayoutPanelLeft size={14} className="mr-1" />;
  }
};

export function RecentResources({ resources = [], isLoading = false }: RecentResourcesProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full flex-col flex gap-4"
    >
      <div className="flex justify-between items-end mb-2">
        <h3 className="font-heading text-heading-3 text-charcoal dark:text-gray-100">Learning Resources</h3>
        <Link href="/student/resources" className="text-brand-forest text-sm font-medium hover:underline">
          Browse All &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-base p-5 h-40 animate-pulse bg-gray-100 dark:bg-dark-elevated"></div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="card-base p-6 flex flex-col items-center justify-center text-center bg-brand-cream/50 dark:bg-dark-surface border border-dashed border-gray-300 dark:border-dark-border min-h-[160px]">
          <div className="w-10 h-10 rounded-full bg-brand-sage/10 flex items-center justify-center text-brand-sage mb-3">
            <Book size={20} />
          </div>
          <h4 className="font-heading text-heading-4 mb-1 text-sm">No resources found</h4>
          <p className="text-muted text-xs max-w-[200px]">
            Check back later for recommended articles and courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <a 
              href={resource.url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              key={resource.id}
              className="card-base p-5 flex flex-col hover:translate-y-[-4px] hover:shadow-card-hover transition-all duration-300 border-t-4 border-brand-sage dark:border-brand-sage/60"
            >
              <div className="flex items-center text-[10px] font-bold tracking-wider text-brand-forest mb-2 uppercase">
                {getTypeIcon(resource.type)}
                {resource.type}
              </div>
              
              <h4 className="font-heading text-heading-4 font-semibold mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-brand-forest transition-colors text-sm">
                {resource.title}
              </h4>
              
              <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-dark-border">
                {resource.provider && (
                  <span className="text-xs text-muted flex items-center gap-1">
                    By <span className="font-medium text-charcoal dark:text-gray-300">{resource.provider}</span>
                  </span>
                )}
                
                <div className="flex items-center justify-between mt-1">
                  {resource.difficulty && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400">
                      {resource.difficulty}
                    </span>
                  )}
                  <span className="text-xs font-medium text-brand-terracotta hover:underline ml-auto">
                    Open Resource &rarr;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
