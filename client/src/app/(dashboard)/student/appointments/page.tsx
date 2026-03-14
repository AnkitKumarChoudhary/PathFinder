'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { useMyAppointments, useUpdateAppointment } from '@/hooks/useAppointments';
import { Appointment } from '@/types/mentorship';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { AppointmentCard } from '@/components/features/mentorship/AppointmentCard';
import { RatingModal } from '@/components/features/mentorship/RatingModal';

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<string>('');
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);

  const { data: appointments = [], isLoading } = useMyAppointments(filter || undefined);
  const updateAppointment = useUpdateAppointment();

  const handleCancel = async (appointment: Appointment) => {
    const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmed) return;

    await updateAppointment.mutateAsync({
      appointmentId: appointment.id,
      payload: {
        status: 'CANCELLED',
        cancelReason: 'Cancelled by student',
      },
    });
  };

  const handleRating = async (payload: { rating: number; feedback: string }) => {
    if (!activeAppointment) return;
    await updateAppointment.mutateAsync({
      appointmentId: activeAppointment.id,
      payload,
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="font-heading text-heading-2 font-bold text-charcoal dark:text-gray-100">My Appointments</h1>
          <p className="text-muted mt-1">Manage your career counselling sessions.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input-field py-2"
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-base p-6 animate-pulse bg-gray-100 dark:bg-dark-elevated h-32"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments found"
          description="Book a mentorship session to get personalized guidance."
          action={
            <Link href="/student/mentorship">
              <Button>Find a Mentor</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onCancel={handleCancel}
              onRate={(appointment) => setActiveAppointment(appointment)}
            />
          ))}
        </div>
      )}

      <RatingModal
        isOpen={Boolean(activeAppointment)}
        onClose={() => setActiveAppointment(null)}
        onSubmit={handleRating}
        loading={updateAppointment.isPending}
      />
    </div>
  );
}
