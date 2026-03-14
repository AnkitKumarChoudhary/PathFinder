'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isWithinInterval, addMinutes, subMinutes } from 'date-fns';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  counsellor: {
    firstName: string;
    lastName: string;
    avatar?: string;
    counsellorProfile?: {
      specializations: string[];
    };
  };
}

interface UpcomingAppointmentsProps {
  appointments?: Appointment[];
  isLoading?: boolean;
}

export function UpcomingAppointments({ appointments = [], isLoading = false }: UpcomingAppointmentsProps) {
  
  const canJoinMeeting = (scheduledAt: string) => {
    const meetingTime = new Date(scheduledAt);
    const now = new Date();
    // Allow joining 15 mins before to 60 mins after
    return isWithinInterval(now, {
      start: subMinutes(meetingTime, 15),
      end: addMinutes(meetingTime, 60)
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full flex-col flex gap-4"
    >
      <div className="flex justify-between items-end mb-2">
        <h3 className="font-heading text-heading-3 text-charcoal dark:text-gray-100">Upcoming Sessions</h3>
        <Link href="/student/appointments" className="text-brand-forest text-sm font-medium hover:underline">
          View All &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="card-base p-4 flex gap-4 items-center animate-pulse bg-gray-100 dark:bg-dark-elevated h-24"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="card-base p-6 flex flex-col items-center justify-center text-center bg-brand-cream/50 dark:bg-dark-surface border border-dashed border-gray-300 dark:border-dark-border h-full min-h-[160px]">
          <div className="w-10 h-10 rounded-full bg-brand-sand/10 flex items-center justify-center text-brand-sand mb-3">
            <Calendar size={20} />
          </div>
          <h4 className="font-heading text-heading-4 mb-1">No upcoming sessions</h4>
          <p className="text-muted text-xs max-w-[200px] mb-4">
            Book a session with an expert counsellor for guidance.
          </p>
          <Link href="/student/mentorship" className="btn-primary py-1.5 px-3 text-xs">
            Find a Mentor
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((apt) => {
            const dateStr = format(new Date(apt.scheduledAt), "EEE d MMM, h:mm a");
            const isJoinable = apt.status === 'CONFIRMED' && canJoinMeeting(apt.scheduledAt);

            return (
              <div key={apt.id} className="card-base p-4 flex flex-row items-center justify-between hover:shadow-card-hover transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {apt.counsellor.avatar ? (
                      <div className="relative h-full w-full">
                        <Image src={apt.counsellor.avatar} alt="Counsellor" fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-brand-forest/20 text-brand-forest flex items-center justify-center font-bold">
                        {apt.counsellor.firstName[0]}{apt.counsellor.lastName[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-charcoal dark:text-gray-100 text-sm">
                      {apt.counsellor.firstName} {apt.counsellor.lastName}
                    </span>
                    <span className="text-xs text-muted mb-1 line-clamp-1">
                      {apt.counsellor.counsellorProfile?.specializations?.join(', ') || 'Career Counsellor'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal/80 dark:text-gray-300 flex items-center gap-1 font-medium">
                        <Calendar size={12} />
                        {dateStr}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${apt.status === 'CONFIRMED' ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'}`}>
                        {apt.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-2 flex-shrink-0">
                  {isJoinable ? (
                    <button className="bg-brand-terracotta text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-terracotta/90 transition-colors">
                      Join Meeting
                    </button>
                  ) : (
                    <Link href={`/student/appointments/${apt.id}`} className="text-brand-forest text-xs font-medium hover:underline">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
