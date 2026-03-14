import http from 'node:http';
import https from 'node:https';

import prisma from '../config/database';
import { env } from '../config/env';
import { AssessmentType } from '@prisma/client';

type MLStudentProfile = {
  aptitude_logical: number;
  aptitude_verbal: number;
  aptitude_numerical: number;
  aptitude_spatial: number;
  personality_openness: number;
  personality_conscientiousness: number;
  personality_extraversion: number;
  personality_agreeableness: number;
  personality_neuroticism: number;
  interest_realistic: number;
  interest_investigative: number;
  interest_artistic: number;
  interest_social: number;
  interest_enterprising: number;
  interest_conventional: number;
};

type MLCareerRecommendation = {
  career: string;
  match_percentage: number;
  confidence: string;
  reasons: string[];
};

const DEFAULT_PROFILE: MLStudentProfile = {
  aptitude_logical: 60,
  aptitude_verbal: 60,
  aptitude_numerical: 60,
  aptitude_spatial: 60,
  personality_openness: 3,
  personality_conscientiousness: 3,
  personality_extraversion: 3,
  personality_agreeableness: 3,
  personality_neuroticism: 3,
  interest_realistic: 3,
  interest_investigative: 3,
  interest_artistic: 3,
  interest_social: 3,
  interest_enterprising: 3,
  interest_conventional: 3,
};

type AttemptSignalOverride = {
  type: AssessmentType;
  categoryScores?: Record<string, any> | null;
  personalityTraits?: Record<string, any> | null;
  riasecProfile?: Record<string, any> | null;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getCategoryPercentage = (categoryScores: Record<string, any> | null | undefined, aliases: string[]) => {
  if (!categoryScores) return null;
  for (const [rawKey, value] of Object.entries(categoryScores)) {
    const key = rawKey.toLowerCase();
    if (aliases.some((alias) => key.includes(alias))) {
      if (typeof value === 'number') return value;
      if (value && typeof value === 'object' && typeof value.percentage === 'number') return value.percentage;
    }
  }
  return null;
};

const toJsonObject = (value: unknown): Record<string, any> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, any>;
};

const resolveProfileFromSignals = (signals: AttemptSignalOverride[]): MLStudentProfile => {
  const profile: MLStudentProfile = { ...DEFAULT_PROFILE };

  const aptitude = signals.find((item) => item.type === AssessmentType.APTITUDE);
  if (aptitude?.categoryScores) {
    const logical = getCategoryPercentage(aptitude.categoryScores, ['logical', 'reason']);
    const verbal = getCategoryPercentage(aptitude.categoryScores, ['verbal', 'language']);
    const numerical = getCategoryPercentage(aptitude.categoryScores, ['numerical', 'quant', 'math']);
    const spatial = getCategoryPercentage(aptitude.categoryScores, ['spatial', 'visual']);

    if (logical !== null) profile.aptitude_logical = clamp(logical, 0, 100);
    if (verbal !== null) profile.aptitude_verbal = clamp(verbal, 0, 100);
    if (numerical !== null) profile.aptitude_numerical = clamp(numerical, 0, 100);
    if (spatial !== null) profile.aptitude_spatial = clamp(spatial, 0, 100);
  }

  const personality = signals.find((item) => item.type === AssessmentType.PERSONALITY_BIG_FIVE);
  if (personality?.personalityTraits) {
    profile.personality_openness = clamp(Number(personality.personalityTraits.Openness ?? profile.personality_openness), 1, 5);
    profile.personality_conscientiousness = clamp(Number(personality.personalityTraits.Conscientiousness ?? profile.personality_conscientiousness), 1, 5);
    profile.personality_extraversion = clamp(Number(personality.personalityTraits.Extraversion ?? profile.personality_extraversion), 1, 5);
    profile.personality_agreeableness = clamp(Number(personality.personalityTraits.Agreeableness ?? profile.personality_agreeableness), 1, 5);
    profile.personality_neuroticism = clamp(Number(personality.personalityTraits.Neuroticism ?? profile.personality_neuroticism), 1, 5);
  }

  const riasec = signals.find((item) => item.type === AssessmentType.INTEREST_RIASEC);
  if (riasec?.riasecProfile) {
    profile.interest_realistic = clamp(Number(riasec.riasecProfile.Realistic ?? profile.interest_realistic), 1, 5);
    profile.interest_investigative = clamp(Number(riasec.riasecProfile.Investigative ?? profile.interest_investigative), 1, 5);
    profile.interest_artistic = clamp(Number(riasec.riasecProfile.Artistic ?? profile.interest_artistic), 1, 5);
    profile.interest_social = clamp(Number(riasec.riasecProfile.Social ?? profile.interest_social), 1, 5);
    profile.interest_enterprising = clamp(Number(riasec.riasecProfile.Enterprising ?? profile.interest_enterprising), 1, 5);
    profile.interest_conventional = clamp(Number(riasec.riasecProfile.Conventional ?? profile.interest_conventional), 1, 5);
  }

  return profile;
};

const postJson = async <TResponse>(urlString: string, payload: unknown): Promise<TResponse> => {
  const url = new URL(urlString);
  const body = JSON.stringify(payload);

  const requestOptions: http.RequestOptions = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: `${url.pathname}${url.search}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
    timeout: 5000,
  };

  const client = url.protocol === 'https:' ? https : http;

  return new Promise<TResponse>((resolve, reject) => {
    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (!res.statusCode || res.statusCode >= 400) {
          return reject(new Error(`ML service error (${res.statusCode ?? 'unknown'}): ${data}`));
        }

        try {
          const parsed = JSON.parse(data);
          resolve(parsed as TResponse);
        } catch (error) {
          reject(new Error(`Invalid ML JSON response: ${String(error)}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('ML service request timed out'));
    });

    req.write(body);
    req.end();
  });
};

const fetchMLRecommendations = async (profile: MLStudentProfile): Promise<MLCareerRecommendation[]> => {
  const base = env.ML_SERVICE_URL.replace(/\/$/, '');
  const response = await postJson<{ success: boolean; recommendations: MLCareerRecommendation[] }>(
    `${base}/api/recommend`,
    profile
  );

  if (!response?.success || !Array.isArray(response.recommendations)) {
    return [];
  }

  return response.recommendations;
};

const mapMlCareersToDb = async (mlRecs: MLCareerRecommendation[]) => {
  if (mlRecs.length === 0) return [];

  const allCareers = await prisma.career.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      category: true,
      averageSalary: true,
      demandLevel: true,
      imageUrl: true,
      iconName: true,
    },
  });

  const exactByNormalizedTitle = new Map(allCareers.map((career) => [normalizeName(career.title), career]));

  const mapped = mlRecs
    .map((mlItem) => {
      const normalized = normalizeName(mlItem.career);
      const exact = exactByNormalizedTitle.get(normalized);
      const career =
        exact ||
        allCareers.find((item) => {
          const titleNorm = normalizeName(item.title);
          return titleNorm.includes(normalized) || normalized.includes(titleNorm);
        });

      if (!career) return null;

      return {
        ...career,
        matchScore: Math.round(mlItem.match_percentage),
        matchPercentage: Math.round(mlItem.match_percentage),
        confidence: mlItem.confidence,
        reasons: mlItem.reasons,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return mapped.slice(0, 6);
};

const getLatestSignals = async (userId: string, currentOverride?: AttemptSignalOverride): Promise<AttemptSignalOverride[]> => {
  const attempts = await prisma.assessmentAttempt.findMany({
    where: {
      userId,
      completedAt: { not: null },
    },
    include: {
      assessment: {
        select: {
          type: true,
        },
      },
    },
    orderBy: { completedAt: 'desc' },
  });

  const byType = new Map<AssessmentType, AttemptSignalOverride>();

  if (currentOverride) {
    byType.set(currentOverride.type, currentOverride);
  }

  for (const attempt of attempts) {
    if (!byType.has(attempt.assessment.type)) {
      byType.set(attempt.assessment.type, {
        type: attempt.assessment.type,
        categoryScores: toJsonObject(attempt.categoryScores),
        personalityTraits: toJsonObject(attempt.personalityTraits),
        riasecProfile: toJsonObject(attempt.riasecProfile),
      });
    }
  }

  return Array.from(byType.values());
};

export const getMLRecommendationsForUser = async (userId: string): Promise<any[]> => {
  const signals = await getLatestSignals(userId);
  const profile = resolveProfileFromSignals(signals);
  const mlRecs = await fetchMLRecommendations(profile);
  return mapMlCareersToDb(mlRecs);
};

export const getMLRecommendationsForAssessmentAttempt = async (
  userId: string,
  currentOverride: AttemptSignalOverride
): Promise<any[]> => {
  const signals = await getLatestSignals(userId, currentOverride);
  const profile = resolveProfileFromSignals(signals);
  const mlRecs = await fetchMLRecommendations(profile);

  const mapped = await mapMlCareersToDb(mlRecs);
  return mapped.map((item) => ({
    careerId: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category,
    shortDescription: item.shortDescription,
    matchPercentage: item.matchPercentage,
    confidence: item.confidence,
    reasons: item.reasons,
  }));
};
