import { z } from 'zod';

export const resumeTemplateSchema = z.enum(['classic', 'modern', 'minimal', 'professional']);

export const createResumeSchema = z.object({
  title: z.string().trim().max(100).optional().default('My Resume'),
  template: resumeTemplateSchema.optional(),
  data: z.record(z.string(), z.any()).optional(),
});

export const updateResumeSchema = z.object({
  title: z.string().trim().max(100).optional(),
  template: resumeTemplateSchema.optional(),
  data: z.any().optional(),
  isDefault: z.boolean().optional(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
