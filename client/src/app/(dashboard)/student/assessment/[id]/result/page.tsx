"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell 
} from "recharts";
import { Download, Share2, Calendar, CheckCircle, ArrowRight, Compass } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import api from "@/lib/api";
import { CHART_COLORS, RIASEC_COLORS } from "@/lib/chartConfig";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface AttemptDetails {
  id: string;
  assessmentId: string;
  score: number;
  percentile: number;
  timeTaken: number;
  completedAt: string;
  categoryScores?: Record<string, { percentage: number, correct: number, total: number }>;
  personalityTraits?: Record<string, number>;
  riasecProfile?: Record<string, number | string>;
  recommendedCareers?: Array<{
    careerId: string;
    title: string;
    slug: string;
    category: string;
    matchPercentage: number;
    shortDescription: string;
  }>;
  assessment: {
    title: string;
    type: "APTITUDE" | "PERSONALITY_BIG_FIVE" | "INTEREST_RIASEC";
    description: string;
  };
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const attemptId = params.id;
  const [attempt, setAttempt] = useState<AttemptDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await api.get(`/assessments/attempts/${attemptId}`);
        if (res.data.success) {
          setAttempt(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch assessment attempt", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setGeneratingPDF(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.roundedRect(10, 10, pdfWidth - 20, 15, 3, 3, "F");
      pdf.setFontSize(16);
      pdf.text("PathFinder Assessment Report", 15, 20);
      
      pdf.addImage(imgData, "PNG", 0, 30, pdfWidth, pdfHeight);
      pdf.save(`${attempt?.assessment.title.replace(/\s+/g, '_')}_Results.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading || !attempt) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  // Circular score color
  let scoreColor = CHART_COLORS.error;
  if (attempt.score >= 90) scoreColor = CHART_COLORS.primary;
  else if (attempt.score >= 70) scoreColor = CHART_COLORS.secondary;
  else if (attempt.score >= 50) scoreColor = CHART_COLORS.highlight;

  const riasecColorMap = RIASEC_COLORS as Record<string, string>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-heading-2 text-charcoal dark:text-white">Assessment Results</h1>
          <p className="text-body text-slate dark:text-dark-text mt-1">Review your detailed performance profile.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>
            Share
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDownloadPDF} 
            loading={generatingPDF}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download PDF
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-8 bg-brand-cream dark:bg-dark-bg p-2 rounded-xl">
        
        {/* Score Overview Card */}
        <Card padding="lg" variant="glass" className="relative overflow-hidden text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 flex-1">
              <div className="inline-flex items-center gap-2 mb-2">
                <Badge variant={
                  attempt.assessment.type === "APTITUDE" ? "forest" :
                  attempt.assessment.type === "PERSONALITY_BIG_FIVE" ? "terracotta" : "sand"
                }>
                  {attempt.assessment.type.replace("_", " ")}
                </Badge>
              </div>
              <h2 className="text-heading-2 text-charcoal dark:text-white">{attempt.assessment.title}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-body-sm text-slate dark:text-dark-text">
                <span className="flex items-center gap-1.5 bg-white/50 dark:bg-dark-surface p-2 rounded-lg">
                  <Calendar className="w-4 h-4" /> 
                  Completed on {new Date(attempt.completedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 bg-white/50 dark:bg-dark-surface p-2 rounded-lg">
                  ⏱️ {Math.ceil(attempt.timeTaken / 60)} minutes taken
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center">
              {/* Circular Progress SVG */}
              <div className="relative w-40 h-40 flex flex-col items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border dark:text-dark-border" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke={scoreColor} strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * attempt.score) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-mono font-bold text-charcoal dark:text-white">{attempt.score}</span>
                  <span className="text-caption font-medium text-slate dark:text-dark-muted">out of 100</span>
                </div>
              </div>
              {attempt.percentile && attempt.percentile > 0 && (
                <div className="mt-4 bg-brand-forest/10 text-brand-forest dark:bg-brand-mint/10 dark:text-brand-mint text-sm font-medium px-4 py-1.5 rounded-full text-center">
                  Better than {attempt.percentile}% of students
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Aptitude Results Breakdown */}
        {attempt.assessment.type === "APTITUDE" && attempt.categoryScores && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="flex flex-col items-center">
              <h3 className="text-heading-3 mb-6 w-full text-left">Category Performance</h3>
              <div className="h-80 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={
                    Object.entries(attempt.categoryScores || {}).map(([c, v]) => ({
                      subject: c,
                      A: v.percentage,
                      fullMark: 100,
                    }))
                  }>
                    <PolarGrid stroke={CHART_COLORS.grid} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: CHART_COLORS.text, fontSize: 12, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar name="Score" dataKey="A" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.4} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <h3 className="text-heading-3 mb-6">Detailed Breakdown</h3>
                <div className="space-y-5">
                  {Object.entries(attempt.categoryScores || {}).map(([cat, val]) => {
                    const pct = val.percentage;
                    const barCol = pct >= 70 ? "bg-brand-forest dark:bg-brand-mint" : pct >= 50 ? "bg-status-warning" : "bg-status-error";
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between text-body-sm font-medium">
                          <span className="text-charcoal dark:text-white text-base">{cat}</span>
                          <span className="text-slate dark:text-dark-text">{pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-border dark:bg-dark-border rounded-full overflow-hidden">
                          <div className={`h-full ${barCol} rounded-full`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Strengths & Improvements */}
              <Card variant="glass" className="space-y-4 bg-brand-forest/5 border-brand-forest/10 dark:bg-brand-forest/10">
                <div>
                  <h4 className="font-semibold text-charcoal dark:text-white flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-status-success" /> Key Strengths
                  </h4>
                  <ul className="space-y-1 text-body-sm text-slate dark:text-dark-text ml-7 list-disc">
                    {Object.entries(attempt.categoryScores || {})
                      .filter(([, v]) => v.percentage >= 70)
                      .map(([c]) => <li key={c}>{c} skills are excellent</li>)}
                    {Object.entries(attempt.categoryScores || {}).filter(([, v]) => v.percentage >= 70).length === 0 && (
                      <li className="list-none -ml-5 text-muted">Keep practicing to build your core strengths.</li>
                    )}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Big Five Results Breakdown */}
        {attempt.assessment.type === "PERSONALITY_BIG_FIVE" && attempt.personalityTraits && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="flex flex-col items-center">
              <h3 className="text-heading-3 mb-6 w-full text-left">Personality Profile</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={
                    Object.entries(attempt.personalityTraits || {}).map(([c, v]) => ({
                      subject: c,
                      A: v,
                      fullMark: 5,
                    }))
                  }>
                    <PolarGrid stroke={CHART_COLORS.grid} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: CHART_COLORS.text, fontSize: 11, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
                    <Radar name="Rating" dataKey="A" stroke={CHART_COLORS.accent} fill={CHART_COLORS.accent} fillOpacity={0.4} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="text-heading-3 mb-2 px-1 text-charcoal dark:text-white">Trait Interpretations</h3>
              {Object.entries(attempt.personalityTraits || {}).map(([trait, score]) => (
                <Card key={trait} padding="sm" className="border-l-4 border-l-brand-forest relative overflow-hidden">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-semibold text-charcoal dark:text-white">{trait}</span>
                    <span className="text-sm font-bold text-brand-forest dark:text-brand-mint">{score} / 5.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-border dark:bg-dark-border rounded-full mb-2">
                    <div className="h-full bg-brand-forest dark:bg-brand-mint rounded-full shadow-sm" style={{ width: `${(score / 5) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-slate dark:text-dark-muted">
                    {score >= 3.5 ? `You exhibit high levels of ${trait.toLowerCase()}.` :
                     score < 2.5 ? `You exhibit lower levels of ${trait.toLowerCase()}.` :
                     `Your ${trait.toLowerCase()} is balanced.`}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* RIASEC Results Breakdown */}
        {attempt.assessment.type === "INTEREST_RIASEC" && attempt.riasecProfile && (
          <div className="space-y-8">
            <Card className="text-center bg-[#1B4332] text-white overflow-hidden relative">
              <div className="absolute opacity-10 -right-10 -top-10">
                <Compass className="w-64 h-64" />
              </div>
              <div className="relative z-10 p-4">
                <span className="uppercase tracking-widest text-sm text-brand-mint font-semibold mb-2 block">Your Primary Career Code</span>
                <div className="flex justify-center gap-4">
                  {((attempt.riasecProfile.top3Code as string) || "RIA").split('').map((letter, i) => (
                    <div key={i} className="w-16 h-16 rounded-full bg-white text-brand-forest flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <Card className="flex flex-col items-center">
                <h3 className="text-heading-3 mb-6 w-full text-left">Holland Codes (RIASEC)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={
                      ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'].map(cat => ({
                        subject: cat,
                        A: attempt.riasecProfile?.[cat] || 0,
                        fullMark: 5,
                      }))
                    }>
                      <PolarGrid stroke={CHART_COLORS.grid} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: CHART_COLORS.text, fontSize: 11, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
                      <Radar name="Interest" dataKey="A" stroke={CHART_COLORS.highlight} fill={CHART_COLORS.highlight} fillOpacity={0.5} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="h-full w-full">
                <Card className="h-full">
                  <h3 className="text-heading-3 mb-6">Profile Breakdown</h3>
                  <div className="h-72 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={
                        ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'].map(cat => ({
                          name: cat.charAt(0),
                          fullName: cat,
                          score: attempt.riasecProfile?.[cat] || 0
                        }))
                      } margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 14, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {
                            ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'].map((cat, index) => (
                              <Cell key={`cell-${index}`} fill={riasecColorMap[cat.charAt(0)] || CHART_COLORS.primary} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Careers */}
        {attempt.recommendedCareers && attempt.recommendedCareers.length > 0 && (
          <div className="pt-8">
            <h2 className="text-heading-2 text-charcoal dark:text-white mb-6">Recommended Career Paths</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {attempt.recommendedCareers.map((career) => (
                <Card key={career.careerId} variant="flat" className="flex flex-col relative overflow-hidden group hover:border-brand-forest/30 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-forest"></div>
                  <div className="p-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="mint" size="sm">{career.matchPercentage}% Match</Badge>
                      <span className="text-caption text-muted">{career.category}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-charcoal dark:text-white mb-2 group-hover:text-brand-forest dark:group-hover:text-brand-mint transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-body-sm text-slate dark:text-dark-text line-clamp-3 mb-6">
                      {career.shortDescription}
                    </p>
                    <div className="mt-auto pt-4 border-t border-border dark:border-dark-border">
                      <Button 
                        variant="link" 
                        rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                        onClick={() => router.push(`/careers/${career.slug}`)}
                      >
                        Explore Career
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
      
      {/* Next Steps CTA */}
      <Card variant="accent" accentColor="terracotta" padding="lg" className="bg-brand-terracotta/5 dark:bg-brand-terracotta/10 border-border dark:border-dark-border">
        <h3 className="text-heading-3 text-charcoal dark:text-white mb-2">What&apos;s Next?</h3>
        <p className="text-body text-slate dark:text-dark-text mb-6 max-w-2xl">
          Now that you have your results, take the next step in your career journey. Discuss these results with an expert or explore your personalized roadmap.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => router.push('/student/mentorship')}>
            Talk to a Counsellor
          </Button>
          <Button variant="outline" onClick={() => router.push('/student/assessment')}>
            Take Another Assessment
          </Button>
        </div>
      </Card>

    </div>
  );
}
