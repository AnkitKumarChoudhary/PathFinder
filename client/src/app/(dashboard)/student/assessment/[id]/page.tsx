"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Brain } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function QuizPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const assessmentId = params.id;
  const {
    currentAssessmentId,
    assessment,
    questions,
    answers,
    currentQuestionIndex,
    timeRemaining,
    isSubmitting,
    loadAssessment,
    setAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    decrementTime,
    setSubmitting,
  } = useAssessmentStore();

  const [initialLoading, setInitialLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitAnimation, setSubmitAnimation] = useState(false);
  const [animationText, setAnimationText] = useState("Analyzing your responses...");

  const fetchAssessment = useCallback(async () => {
    try {
      setInitialLoading(true);
      const res = await api.get(`/assessments/${assessmentId}`);
      if (res.data.success) {
        const payload = res.data.data;
        const isValidAssessmentPayload =
          payload &&
          typeof payload === "object" &&
          !Array.isArray(payload) &&
          Array.isArray(payload.questions);

        if (!isValidAssessmentPayload) {
          toast.error("Invalid assessment link");
          router.push("/student/assessment");
          return;
        }

        if (currentAssessmentId !== assessmentId) {
          loadAssessment(payload);
        }
      } else {
        toast.error("Failed to load assessment");
        router.push("/student/assessment");
      }
    } catch {
      toast.error("Error loading assessment");
      router.push("/student/assessment");
    } finally {
      setInitialLoading(false);
    }
  }, [assessmentId, currentAssessmentId, loadAssessment, router]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  // Timer effect
  useEffect(() => {
    if (initialLoading || isSubmitting || submitAnimation || timeRemaining <= 0 || !assessment) return;

    const timerInt = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timerInt);
  }, [initialLoading, isSubmitting, submitAnimation, timeRemaining, decrementTime, assessment]);

  const forceSubmit = useCallback(async () => {
    setShowSubmitModal(false);
    setSubmitAnimation(true);
    setSubmitting(true);

    const animationSteps = [
      "Analyzing your responses...",
      "Calculating your scores...",
      "Matching career profiles...",
      "Preparing your results..."
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < animationSteps.length) {
        setAnimationText(animationSteps[step]);
      }
    }, 1000);

    try {
      const payloadAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));

      const timeTaken = assessment!.duration * 60 - timeRemaining;

      const response = await api.post(`/assessments/${assessmentId}/submit`, {
        answers: payloadAnswers,
        timeTaken,
      });

      clearInterval(interval);

      if (response.data.success) {
        const attemptId = response.data.data.id;
        router.push(`/student/assessment/${attemptId}/result`);
      } else {
        setSubmitAnimation(false);
        setSubmitting(false);
        toast.error("Failed to submit assessment");
      }
    } catch {
      clearInterval(interval);
      setSubmitAnimation(false);
      setSubmitting(false);
      toast.error("Error submitting assessment");
    }
  }, [answers, assessment, assessmentId, router, setSubmitting, timeRemaining]);

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting || submitAnimation) return;
    toast.error("Time is up! Auto-submitting assessment...", { duration: 4000 });
    await forceSubmit();
  }, [forceSubmit, isSubmitting, submitAnimation]);

  // Auto-submit when time reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && assessment && !initialLoading && !isSubmitting && !submitAnimation) {
      handleAutoSubmit();
    }
  }, [timeRemaining, assessment, initialLoading, isSubmitting, submitAnimation, handleAutoSubmit]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || submitAnimation || isSubmitting) return;

      const currentQ = questions[currentQuestionIndex];
      if (!currentQ) return;

      if (e.key === "ArrowRight") {
        if (currentQuestionIndex < questions.length - 1) nextQuestion();
      } else if (e.key === "ArrowLeft") {
        if (currentQuestionIndex > 0) previousQuestion();
      } else if (e.key === "Enter" && currentQuestionIndex < questions.length - 1) {
        if (answers[currentQ.id]) nextQuestion();
      }

      if (currentQ.type === "MULTIPLE_CHOICE" && currentQ.options && Array.isArray(currentQ.options)) {
        const optionUpper = e.key.toUpperCase();
        if (["A", "B", "C", "D"].includes(optionUpper)) {
          const index = optionUpper.charCodeAt(0) - 65;
          if (index < currentQ.options.length) {
            setAnswer(currentQ.id, String(currentQ.options[index]));
          }
        }
      } else if (currentQ.type === "RATING_SCALE") {
        if (["1", "2", "3", "4", "5"].includes(e.key)) {
          setAnswer(currentQ.id, e.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestionIndex, questions, answers, nextQuestion, previousQuestion, setAnswer, showSubmitModal, submitAnimation, isSubmitting]);

  const getOptionDisplay = (option: unknown): string => {
    if (typeof option === "object" && option !== null) {
      const optionRecord = option as Record<string, unknown>;
      const candidate = optionRecord.value ?? optionRecord.label ?? optionRecord.text;
      return typeof candidate === "string" ? candidate : JSON.stringify(option);
    }
    return String(option);
  };

  const getOptionValue = (option: unknown): string => {
    if (typeof option === "object" && option !== null) {
      const optionRecord = option as Record<string, unknown>;
      const candidate = optionRecord.value ?? optionRecord.label ?? optionRecord.text;
      return typeof candidate === "string" ? candidate : "";
    }
    return String(option);
  };

  if (initialLoading || !assessment) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-cream dark:bg-dark-bg">
        <LoaderCircle className="h-10 w-10 animate-spin text-brand-forest dark:text-brand-mint mb-4" />
        <p className="text-body font-medium text-slate dark:text-dark-text">Loading assessment...</p>
      </div>
    );
  }

  if (submitAnimation) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-cream dark:bg-dark-bg">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-brand-forest/20 animate-ping"></div>
          <LoaderCircle className="h-12 w-12 animate-spin text-brand-forest dark:text-brand-mint" />
        </div>
        <p className="text-heading-3 font-heading text-charcoal dark:text-white animate-pulse">
          {animationText}
        </p>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const m = Math.floor(timeRemaining / 60);
  const s = timeRemaining % 60;
  const timeString = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  
  const isWarningTime = timeRemaining <= 300 && timeRemaining > 60; // 5 mins
  const isCriticalTime = timeRemaining <= 60; // 1 min

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-brand-cream dark:bg-dark-bg overflow-hidden font-body">
      {/* Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
        <button 
          onClick={() => {
            if (confirm("Are you sure you want to leave? Your progress will be saved.")) {
              router.push("/student/assessment");
            }
          }}
          className="flex items-center gap-2 text-charcoal hover:opacity-80 dark:text-white font-heading font-bold"
        >
          <Brain className="h-6 w-6 text-brand-forest dark:text-brand-mint" />
          <span className="hidden sm:inline">PathFinder</span>
        </button>
        
        <h1 className="text-body font-semibold text-slate dark:text-dark-text max-w-[40%] truncate">
          {assessment.title}
        </h1>

        <div className={`flex items-center gap-2 font-mono text-lg font-medium transition-colors ${
          isCriticalTime ? "text-status-error animate-pulse" : 
          isWarningTime ? "text-brand-terracotta" : "text-slate dark:text-dark-text"
        }`}>
          <AlertTriangle className={`h-5 w-5 ${!isCriticalTime && !isWarningTime ? "hidden" : ""}`} />
          {timeString}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl flex-1 flex flex-col">
          
          {/* Progress Section */}
          <div className="mb-8 w-full max-w-2xl mx-auto space-y-2">
            <div className="flex justify-between items-center text-body-sm text-muted dark:text-dark-muted">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progressPercent)}% completed</span>
            </div>
            <ProgressBar value={progressPercent} className="h-2" color="forest" />
            
            {/* Category Indicator */}
            {currentQ.category && (
              <div className="flex pt-2">
                <span className="inline-block rounded-full bg-brand-forest/10 px-3 py-1 text-caption font-medium text-brand-forest dark:bg-brand-forest/20 dark:text-brand-mint relative pl-6">
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-forest"></div>
                  {currentQ.category}
                </span>
              </div>
            )}
          </div>

          {/* Question Display */}
          <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col">
            <h2 className="text-heading-3 md:text-heading-2 font-heading text-charcoal dark:text-white mb-10 leading-snug">
              {currentQ.questionText}
            </h2>

            {/* Answers Box */}
            <div className="space-y-4 mb-10 w-full">
              {currentQ.type === "MULTIPLE_CHOICE" && currentQ.options && Array.isArray(currentQ.options) && (
                <div className="flex flex-col gap-4">
                  {(currentQ.options as unknown[]).map((option, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const optionDisplay = getOptionDisplay(option);
                    const optionValue = getOptionValue(option);
                    const isSelected = answers[currentQ.id] === optionValue;
                    return (
                      <button
                        key={idx}
                        onClick={() => setAnswer(currentQ.id, optionValue)}
                        className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all hover:border-brand-forest/50 hover:bg-brand-forest/5 dark:hover:bg-brand-forest/10 focus:outline-none focus:ring-2 focus:ring-brand-forest focus:ring-offset-2 dark:focus:ring-offset-dark-bg ${
                          isSelected 
                            ? "border-brand-forest bg-brand-forest/10 dark:border-brand-forest dark:bg-brand-forest/20" 
                            : "border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          isSelected 
                            ? "border-brand-forest bg-brand-forest text-white" 
                            : "border-slate/30 text-slate group-hover:border-brand-forest/50 group-hover:text-brand-forest dark:border-dark-border dark:text-dark-text dark:group-hover:text-brand-mint"
                        }`}>
                          {isSelected ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-semibold">{letter}</span>}
                        </div>
                        <span className={`text-body md:text-body-lg font-medium ${
                          isSelected ? "text-charcoal dark:text-white" : "text-slate dark:text-dark-text"
                        }`}>
                          {optionDisplay}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === "RATING_SCALE" && (
                <div className="w-full flex justify-between items-center bg-surface p-6 rounded-2xl border border-border dark:bg-dark-surface dark:border-dark-border max-w-2xl mx-auto shadow-sm">
                  <span className="text-body-sm font-medium text-slate dark:text-dark-muted hidden md:block w-32 text-center leading-tight">Strongly<br/>Disagree</span>
                  <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center flex-1">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[currentQ.id] === val.toString();
                      return (
                        <button
                          key={val}
                          onClick={() => setAnswer(currentQ.id, val.toString())}
                          className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-forest focus:ring-offset-2 dark:focus:ring-offset-dark-bg ${
                            isSelected
                              ? "bg-brand-forest text-white scale-110 shadow-md dark:bg-brand-mint dark:text-brand-forest"
                              : "bg-brand-cream border border-border text-slate hover:border-brand-forest/50 hover:bg-brand-forest/5 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:hover:border-brand-forest/50"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-body-sm font-medium text-slate dark:text-dark-muted hidden md:block w-32 text-center leading-tight">Strongly<br/>Agree</span>
                </div>
              )}

              {currentQ.type === "YES_NO" && (
                <div className="flex gap-4 max-w-lg mx-auto w-full">
                  {["Yes", "No"].map((option) => {
                    const isSelected = answers[currentQ.id] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => setAnswer(currentQ.id, option)}
                        className={`flex-1 rounded-xl border py-4 md:py-6 text-center transition-all hover:border-brand-forest/50 focus:outline-none focus:ring-2 focus:ring-brand-forest focus:ring-offset-2 dark:focus:ring-offset-dark-bg ${
                          isSelected
                            ? "border-brand-forest bg-brand-forest text-white"
                            : "border-border bg-surface text-slate hover:bg-brand-forest/5 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-brand-forest/10"
                        }`}
                      >
                        <span className="text-lg font-semibold">{option}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="w-full bg-white border-t border-border shadow-soft-up py-4 px-6 dark:bg-dark-surface dark:border-dark-border z-[110]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Previous
          </Button>

          {/* Dots Navigation (hidden on small screens) */}
          <div className="hidden md:flex items-center justify-center gap-1.5 overflow-x-auto px-4 max-w-sm">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(idx)}
                  className={`h-2.5 rounded-full transition-all flex-shrink-0 ${
                    isCurrent
                      ? "w-6 bg-brand-forest border border-brand-forest dark:bg-brand-mint"
                      : isAnswered
                      ? "w-2.5 bg-brand-forest/60 dark:bg-brand-mint/60 hover:bg-brand-forest"
                      : "w-2.5 bg-slate/20 dark:bg-white/20 hover:bg-slate/40"
                  }`}
                  aria-label={`Go to question ${idx + 1}`}
                />
              );
            })}
          </div>

          <div className="md:hidden text-body-sm font-medium text-slate dark:text-dark-text">
            {currentQuestionIndex + 1}/{questions.length}
          </div>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextQuestion}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setShowSubmitModal(true)}
              className="bg-brand-terracotta hover:bg-[#d06045] dark:bg-brand-terracotta"
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </footer>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showSubmitModal} 
        onClose={() => setShowSubmitModal(false)}
        title="Submit Your Assessment?"
      >
        <div className="space-y-4 py-2">
          <p className="text-body text-slate dark:text-dark-text font-medium">
            You have answered {Object.keys(answers).length} out of {questions.length} questions.
          </p>
          
          {Object.keys(answers).length < questions.length && (
            <div className="rounded-lg bg-status-warning/10 p-3 border border-status-warning/20">
              <p className="text-body-sm text-status-warning flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>
                  You have {questions.length - Object.keys(answers).length} unanswered questions. Unanswered questions will receive 0 points.
                </span>
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Go Back
            </Button>
            <Button variant="primary" onClick={forceSubmit}>
              Submit Now
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
