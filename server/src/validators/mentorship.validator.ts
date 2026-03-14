import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const toMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const isTodayOrFutureDate = (value: string): boolean => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  return target.getTime() >= today.getTime();
};

export const mentorQuerySchema = z.object({
  search: z.string().trim().optional(),
  specialization: z.string().optional(),
  language: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxRate: z.coerce.number().min(0).optional(),
  experience: z.enum(['0-2', '3-5', '5-10', '10+']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  sort: z
    .enum([
      'rating_desc',
      'rating_asc',
      'experience_desc',
      'experience_asc',
      'rate_low',
      'rate_high',
      'sessions_desc',
      'name_asc',
    ])
    .optional(),
});

export const bookAppointmentSchema = z
  .object({
    counsellorId: z.string().trim().min(1),
    date: z
      .string()
      .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Invalid date format')
      .refine(isTodayOrFutureDate, 'Date must be today or in the future'),
    startTime: z.string().regex(timeRegex, 'startTime must be in HH:mm format'),
    endTime: z.string().regex(timeRegex, 'endTime must be in HH:mm format'),
    type: z
      .enum(['career-guidance', 'assessment-review', 'resume-review', 'mock-interview', 'general'])
      .optional(),
    studentNotes: z.string().max(1000).optional(),
  })
  .refine((value) => toMinutes(value.endTime) > toMinutes(value.startTime), {
    message: 'endTime must be later than startTime',
    path: ['endTime'],
  });

export const updateAppointmentSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW']).optional(),
  counsellorNotes: z.string().max(2000).optional(),
  meetingLink: z.string().url().optional(),
  cancelReason: z.string().max(500).optional(),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().max(1000).optional(),
});

const availabilitySlotSchema = z
  .object({
    start: z.string().regex(timeRegex, 'start must be in HH:mm format'),
    end: z.string().regex(timeRegex, 'end must be in HH:mm format'),
  })
  .refine((value) => toMinutes(value.end) > toMinutes(value.start), {
    message: 'Slot end must be later than slot start',
    path: ['end'],
  });

export const availabilitySchema = z.object({
  slots: z.object({
    monday: z.array(availabilitySlotSchema).optional(),
    tuesday: z.array(availabilitySlotSchema).optional(),
    wednesday: z.array(availabilitySlotSchema).optional(),
    thursday: z.array(availabilitySlotSchema).optional(),
    friday: z.array(availabilitySlotSchema).optional(),
    saturday: z.array(availabilitySlotSchema).optional(),
    sunday: z.array(availabilitySlotSchema).optional(),
  }),
});

export type MentorQueryInput = z.infer<typeof mentorQuerySchema>;
export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
