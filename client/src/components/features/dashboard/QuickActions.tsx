'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Calendar, Bookmark } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Take Assessment',
      description: 'Discover your aptitude and interest fit',
      icon: <Compass size={24} className="text-brand-forest" />,
      bgClass: 'bg-brand-forest/10 hover:bg-brand-forest/20',
      href: '/student/assessment',
    },
    {
      title: 'Book Session',
      description: 'Connect with mentors and counsellors',
      icon: <Calendar size={24} className="text-brand-sand" />,
      bgClass: 'bg-brand-sand/10 hover:bg-brand-sand/20',
      href: '/student/mentorship',
    },
    {
      title: 'Explore Careers',
      description: 'Browse 34+ career paths tailored for Indian students',
      icon: <Compass size={24} className="text-brand-terracotta" />,
      bgClass: 'bg-brand-terracotta/10 hover:bg-brand-terracotta/20',
      href: '/student/careers',
    },
    {
      title: 'Saved Careers',
      description: 'Revisit careers you bookmarked',
      icon: <Bookmark size={24} className="text-brand-sage cursor-pointer" />,
      bgClass: 'bg-brand-sage/10 hover:bg-brand-sage/20',
      href: '/student/careers/saved',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full flex-col flex gap-4"
    >
      <h3 className="font-heading text-heading-3 text-charcoal dark:text-gray-100 mb-2">Quick Actions</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            href={action.href}
            className="card-base p-4 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform group"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${action.bgClass}`}>
              <div className="group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
            </div>
            <span className="text-sm font-semibold text-charcoal dark:text-gray-200">
              {action.title}
            </span>
            <span className="mt-1 text-center text-xs text-muted dark:text-dark-muted">
              {action.description}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
