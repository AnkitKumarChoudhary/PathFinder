"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Heart, Compass, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface AttemptStatus {
  attemptId: string;
  score: number;
  completedAt: string;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: "APTITUDE" | "PERSONALITY_BIG_FIVE" | "INTEREST_RIASEC" | "SKILL_BASED" | "COMPREHENSIVE";
  duration: number;
  questionCount: number;
  attemptStatus: AttemptStatus | null;
}

export default function AssessmentListingPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await api.get("/assessments");
        if (response.data.success) {
          setAssessments(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const availableAssessments = assessments.filter((a) => !a.attemptStatus);
  const completedAssessments = assessments.filter((a) => a.attemptStatus);

  const getAssessmentIcon = (type: string) => {
    switch (type) {
      case "APTITUDE":
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest">
            <Brain className="h-8 w-8" />
          </div>
        );
      case "PERSONALITY_BIG_FIVE":
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-terracotta/10 text-brand-terracotta">
            <Heart className="h-8 w-8" />
          </div>
        );
      case "INTEREST_RIASEC":
      default:
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-sand/20 text-brand-sand">
            <Compass className="h-8 w-8" />
          </div>
        );
    }
  };

  const getBadgeType = (type: string): BadgeProps["variant"] => {
    switch (type) {
      case "APTITUDE": return "forest";
      case "PERSONALITY_BIG_FIVE": return "terracotta";
      case "INTEREST_RIASEC": return "sand";
      default: return "gray";
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case "APTITUDE": return "APTITUDE";
      case "PERSONALITY_BIG_FIVE": return "PERSONALITY";
      case "INTEREST_RIASEC": return "INTERESTS";
      default: return "ASSESSMENT";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-max lg:w-3/4 max-w-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl">
      <div>
        <h1 className="text-heading-2 text-charcoal dark:text-white mb-2">Career Assessments</h1>
        <p className="text-body text-muted dark:text-dark-muted">
          Discover your strengths, personality, and interests through our scientifically-designed assessments.
        </p>
      </div>

      {availableAssessments.length > 0 && (
        <div className="mb-6 rounded-lg bg-brand-forest/5 p-4 border border-brand-forest/20 text-brand-forest dark:bg-brand-forest/10 dark:text-brand-mint">
          <p className="text-body-sm flex items-center gap-2 font-medium">
            <span className="text-xl">💡</span>
            We recommend taking all three assessments for the most accurate career recommendations. Start with the Aptitude Test.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {availableAssessments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-heading-3 text-charcoal dark:text-white border-b border-border dark:border-dark-border pb-2">
              Available Assessments
            </h2>
            <div className="grid gap-6">
              {availableAssessments.map((assessment) => (
                <Card key={assessment.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="shrink-0">{getAssessmentIcon(assessment.type)}</div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-heading-3 text-charcoal dark:text-white">{assessment.title}</h3>
                      <Badge variant={getBadgeType(assessment.type)}>{getBadgeText(assessment.type)}</Badge>
                    </div>
                    <p className="text-body text-slate dark:text-dark-text line-clamp-2">
                      {assessment.description || "Discover more about your career fit."}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm text-muted dark:text-dark-muted">
                      <span className="flex items-center gap-1.5">⏱️ {assessment.duration} minutes</span>
                      <span className="flex items-center gap-1.5">📝 {assessment.questionCount} questions</span>
                      {assessment.type === "APTITUDE" && <span>📊 Logical, Verbal, Numerical, Spatial</span>}
                      {assessment.type === "PERSONALITY_BIG_FIVE" && <span>🧠 Big Five Model</span>}
                      {assessment.type === "INTEREST_RIASEC" && <span>🔍 Holland&apos;s RIASEC</span>}
                    </div>
                  </div>
                  <div className="shrink-0 mt-4 md:mt-0">
                    <Button
                      size="lg"
                      className="w-full md:w-auto"
                      onClick={() => router.push(`/student/assessment/${assessment.id}`)}
                    >
                      Start Assessment &rarr;
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {completedAssessments.length > 0 && (
          <div className="space-y-4 pt-6">
            <h2 className="text-heading-3 text-charcoal dark:text-white border-b border-border dark:border-dark-border pb-2">
              Completed Assessments
            </h2>
            <div className="grid gap-6">
              {completedAssessments.map((assessment) => (
                <Card key={assessment.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center opacity-90">
                  <div className="shrink-0 relative">
                    {getAssessmentIcon(assessment.type)}
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-dark-bg rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-status-success" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-heading-3 text-charcoal dark:text-white line-through decoration-muted/50">
                        {assessment.title}
                      </h3>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-body-sm text-slate dark:text-dark-text">
                      <span>Score: <strong className="text-brand-forest dark:text-brand-mint">{assessment.attemptStatus?.score}%</strong></span>
                      <span>•</span>
                      <span>
                        Completed on {new Date(assessment.attemptStatus?.completedAt || "").toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => router.push(`/student/assessment/${assessment.id}`)}
                    >
                      Retake
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        const attemptId = assessment.attemptStatus?.attemptId;
                        if (!attemptId) return;
                        router.push(`/student/assessment/${attemptId}/result`);
                      }}
                      disabled={!assessment.attemptStatus?.attemptId}
                    >
                      View Results
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
