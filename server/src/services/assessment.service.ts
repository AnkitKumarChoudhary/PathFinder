import prisma from '../config/database';
import { AssessmentType } from '@prisma/client';
import { getMLRecommendationsForAssessmentAttempt } from './recommendation.service';

export class AssessmentService {
  /**
   * Get all active assessments, including whether the student has attempted them
   */
  static async getAllAssessments(userId: string) {
    const assessments = await prisma.assessment.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        duration: true,
        _count: {
          select: { questions: true },
        },
      },
    });

    // Check attempts for the current user
    const attempts = await prisma.assessmentAttempt.findMany({
      where: {
        userId,
        completedAt: { not: null },
        score: { not: null },
      },
      orderBy: { completedAt: 'desc' },
      select: {
        id: true,
        assessmentId: true,
        score: true,
        completedAt: true,
      },
    });

    const attemptsMap = new Map<string, { attemptId: string; score: number; completedAt: Date }>();
    for (const attempt of attempts) {
      if (attempt.score === null || attempt.completedAt === null) {
        continue;
      }

      if (!attemptsMap.has(attempt.assessmentId)) {
        attemptsMap.set(attempt.assessmentId, {
          attemptId: attempt.id,
          score: attempt.score,
          completedAt: attempt.completedAt,
        });
      }
    }

    return assessments.map((assessment) => ({
      ...assessment,
      questionCount: assessment._count.questions,
      attemptStatus: attemptsMap.get(assessment.id) || null,
    }));
  }

  /**
   * Get a single assessment with all its questions (excluding correct answers)
   */
  static async getAssessmentById(id: string) {
    const assessment = await prisma.assessment.findUnique({
      where: { id, isActive: true },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            assessmentId: true,
            questionText: true,
            type: true,
            options: true,
            category: true,
            weight: true,
            order: true,
            // DO NOT include correctAnswer or explanation to prevent cheating
          },
        },
      },
    });

    if (!assessment) {
      throw { statusCode: 404, message: 'Assessment not found' };
    }

    // Sanitize options to prevent cheating if the seed data included isCorrect inside the options JSON
    const sanitizedQuestions = assessment.questions.map((q) => {
      let safeOptions = q.options;
      if (Array.isArray(safeOptions)) {
        safeOptions = safeOptions.map((opt: any) => {
          if (typeof opt === 'object' && opt !== null) {
            const { isCorrect, ...rest } = opt;
            return rest;
          }
          return opt;
        });
      }
      return { ...q, options: safeOptions };
    });

    return { ...assessment, questions: sanitizedQuestions };
  }

  /**
   * Submit an assessment attempt and process scores
   */
  static async submitAssessment(
    userId: string,
    assessmentId: string,
    payload: { answers: { questionId: string; selectedAnswer: string }[]; timeTaken: number }
  ) {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { questions: true },
    });

    if (!assessment) {
      throw { statusCode: 404, message: 'Assessment not found' };
    }

    // Create a map for quick access to actual questions
    const questionMap = new Map(assessment.questions.map((q) => [q.id, q]));
    
    let score = 0;
    let maxScore = 0;
    let percentile = 0;
    let categoryScores: any = {};
    let personalityTraits: any = null;
    let riasecProfile: any = null;

    if (assessment.type === AssessmentType.APTITUDE) {
      let totalCorrect = 0;
      let totalQuestions = 0;

      payload.answers.forEach((ans) => {
        const question = questionMap.get(ans.questionId);
        if (!question) return;

        const cat = question.category || 'General';
        if (!categoryScores[cat]) {
          categoryScores[cat] = { correct: 0, total: 0, percentage: 0 };
        }

        categoryScores[cat].total += 1;
        totalQuestions += 1;

        if (question.correctAnswer === ans.selectedAnswer) {
          categoryScores[cat].correct += 1;
          totalCorrect += 1;
        }
      });

      // Calculate percentages per category
      for (const cat in categoryScores) {
        if (categoryScores[cat].total > 0) {
          categoryScores[cat].percentage = Math.round((categoryScores[cat].correct / categoryScores[cat].total) * 100);
        }
      }

      score = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
      maxScore = 100;
      score = Math.round(score);

      if (score >= 90) percentile = 95;
      else if (score >= 80) percentile = 85;
      else if (score >= 70) percentile = 70;
      else if (score >= 60) percentile = 55;
      else if (score >= 50) percentile = 40;
      else percentile = 25;

    } else if (assessment.type === AssessmentType.PERSONALITY_BIG_FIVE) {
      personalityTraits = {
        Openness: { total: 0, count: 0 },
        Conscientiousness: { total: 0, count: 0 },
        Extraversion: { total: 0, count: 0 },
        Agreeableness: { total: 0, count: 0 },
        Neuroticism: { total: 0, count: 0 }
      };

      payload.answers.forEach((ans) => {
        const question = questionMap.get(ans.questionId);
        if (!question || !question.category) return;

        // Assuming category maps directly or maps to 'O', 'C', etc.
        let cat = question.category;
        if (cat === 'O') cat = 'Openness';
        if (cat === 'C') cat = 'Conscientiousness';
        if (cat === 'E') cat = 'Extraversion';
        if (cat === 'A') cat = 'Agreeableness';
        if (cat === 'N') cat = 'Neuroticism';

        if (personalityTraits[cat]) {
          personalityTraits[cat].total += parseInt(ans.selectedAnswer, 10);
          personalityTraits[cat].count += 1;
        }
      });

      let totalScore = 0;
      for (const cat in personalityTraits) {
        if (personalityTraits[cat].count > 0) {
          const avg = personalityTraits[cat].total / personalityTraits[cat].count;
          personalityTraits[cat] = Number(avg.toFixed(2));
          totalScore += personalityTraits[cat];
        } else {
          personalityTraits[cat] = 0;
        }
      }
      
      score = Math.round((totalScore / 25) * 100); // 5 traits * max 5 rating = 25
      maxScore = 100;
      categoryScores = null;

    } else if (assessment.type === AssessmentType.INTEREST_RIASEC) {
      riasecProfile = {
        Realistic: { total: 0, count: 0 },
        Investigative: { total: 0, count: 0 },
        Artistic: { total: 0, count: 0 },
        Social: { total: 0, count: 0 },
        Enterprising: { total: 0, count: 0 },
        Conventional: { total: 0, count: 0 }
      };

      payload.answers.forEach((ans) => {
        const question = questionMap.get(ans.questionId);
        if (!question || !question.category) return;

        let cat = question.category;
        if (cat === 'R') cat = 'Realistic';
        if (cat === 'I') cat = 'Investigative';
        if (cat === 'A') cat = 'Artistic';
        if (cat === 'S') cat = 'Social';
        if (cat === 'E') cat = 'Enterprising';
        if (cat === 'C') cat = 'Conventional';

        if (riasecProfile[cat]) {
          riasecProfile[cat].total += parseInt(ans.selectedAnswer, 10);
          riasecProfile[cat].count += 1;
        }
      });

      for (const cat in riasecProfile) {
        if (riasecProfile[cat].count > 0) {
          const avg = riasecProfile[cat].total / riasecProfile[cat].count;
          riasecProfile[cat] = Number(avg.toFixed(2));
        } else {
          riasecProfile[cat] = 0;
        }
      }
      
      // Calculate top 3
      const sortedKeys = Object.keys(riasecProfile).sort((a, b) => riasecProfile[b] - riasecProfile[a]);
      const top3Keys = sortedKeys.slice(0, 3);
      const top3Letters = top3Keys.map(k => k.charAt(0)).join('');
      
      riasecProfile['top3Code'] = top3Letters;
      
      score = Math.round((Object.values(riasecProfile).filter(v => typeof v === 'number').reduce((a: any, b: any) => a + b, 0) / 30) * 100);
      maxScore = 100;
      categoryScores = null;
    }

    // Recommended Careers Matching
    let recommendedCareers: any[] = [];
    const allCareers = await prisma.career.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        shortDescription: true,
        riasecCodes: true,
        requiredTraits: true,
        requiredSkills: true
      }
    });

    if (assessment.type === AssessmentType.INTEREST_RIASEC && riasecProfile) {
      const top3Set = new Set(riasecProfile['top3Code'].split(''));
      
      for (const career of allCareers) {
        if (career.riasecCodes && career.riasecCodes.length > 0) {
          let matchCount = 0;
          career.riasecCodes.forEach((code: string) => {
            code.split('').forEach(char => {
              if (top3Set.has(char)) matchCount++;
            });
          });
          
          if (matchCount > 0) {
            let matchPercentage = Math.round((matchCount / Math.max(career.riasecCodes[0].length, 3)) * 100);
            if (matchPercentage > 100) matchPercentage = 100;
            recommendedCareers.push({
              careerId: career.id,
              title: career.title,
              slug: career.slug,
              category: career.category,
              shortDescription: career.shortDescription,
              matchPercentage
            });
          }
        }
      }
      
      recommendedCareers.sort((a, b) => b.matchPercentage - a.matchPercentage);
      recommendedCareers = recommendedCareers.slice(0, 6);
    } else if (assessment.type === AssessmentType.APTITUDE) {
      // Basic logic for aptitude recommending based on categories
      let topCategories = Object.keys(categoryScores).filter(k => categoryScores[k].percentage >= 70);
      
      for (const career of allCareers) {
        let matchScore = 50 + Math.floor(Math.random() * 30); // Placeholder matching for aptitude
        recommendedCareers.push({
          careerId: career.id,
          title: career.title,
          slug: career.slug,
          category: career.category,
          shortDescription: career.shortDescription,
          matchPercentage: matchScore
        });
      }
      recommendedCareers.sort((a, b) => b.matchPercentage - a.matchPercentage);
      recommendedCareers = recommendedCareers.slice(0, 6);
    }

    // Prefer ML recommendations when available; keep fallback recommendations if ML is unavailable
    try {
      const mlRecommended = await getMLRecommendationsForAssessmentAttempt(userId, {
        type: assessment.type,
        categoryScores,
        personalityTraits,
        riasecProfile,
      });

      if (mlRecommended.length > 0) {
        recommendedCareers = mlRecommended;
      }
    } catch (error) {
      console.warn('ML recommendation failed, using fallback recommendations:', error);
    }

    // Save Attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId,
        answers: payload.answers,
        score,
        maxScore,
        percentile,
        categoryScores: categoryScores || undefined,
        personalityTraits: personalityTraits || undefined,
        riasecProfile: riasecProfile || undefined,
        recommendedCareers,
        completedAt: new Date(),
        timeTaken: payload.timeTaken,
      },
    });

    // Activity Log
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'COMPLETED_ASSESSMENT',
        entity: 'Assessment',
        entityId: assessmentId,
      }
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Assessment Completed!',
        message: `Your results for ${assessment.title} are ready.`,
        type: 'ASSESSMENT_RESULT',
        link: `/student/assessment/${attempt.id}/result`,
      }
    });

    return attempt;
  }

  /**
   * Get all past attempts for a user
   */
  static async getAttempts(userId: string) {
    return prisma.assessmentAttempt.findMany({
      where: { userId },
      include: {
        assessment: {
          select: { title: true, type: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single detailed attempt
   */
  static async getAttemptById(userId: string, attemptId: string) {
    const attempt = await prisma.assessmentAttempt.findFirst({
      where: { id: attemptId, userId },
      include: {
        assessment: {
          select: { title: true, type: true, description: true }
        }
      }
    });

    if (!attempt) {
      throw { statusCode: 404, message: 'Assessment attempt not found' };
    }

    return attempt;
  }
}
