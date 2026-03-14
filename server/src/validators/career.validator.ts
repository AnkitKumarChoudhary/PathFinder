import { z } from 'zod';

export const careerQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().optional(),
  salary: z.enum(['low', 'medium', 'high']).optional(),
  growth: z.enum(['High', 'Moderate', 'Stable', 'Emerging']).optional(),
  exam: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z
    .enum(['title_asc', 'title_desc', 'salary_high', 'salary_low', 'newest', 'relevance'])
    .optional(),
});

export const careerCompareSchema = z.object({
  careerIds: z.array(z.string().trim().min(1)).min(2).max(3),
});

export const saveCareerNoteSchema = z.object({
  notes: z.string().max(500).optional(),
});

export type CareerQueryInput = z.infer<typeof careerQuerySchema>;
export type CareerCompareInput = z.infer<typeof careerCompareSchema>;
export type SaveCareerNoteInput = z.infer<typeof saveCareerNoteSchema>;