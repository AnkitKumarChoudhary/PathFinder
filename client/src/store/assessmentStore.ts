import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Question {
  id: string;
  assessmentId: string;
  questionText: string;
  type: string;
  options: unknown[] | null;
  category: string;
  weight: number;
  order: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
  questions: Question[];
}

interface AssessmentState {
  currentAssessmentId: string | null;
  assessment: Assessment | null;
  questions: Question[];
  answers: Record<string, string>;
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  isSubmitting: boolean;

  loadAssessment: (assessment: Assessment) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  decrementTime: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  resetQuiz: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      currentAssessmentId: null,
      assessment: null,
      questions: [],
      answers: {},
      currentQuestionIndex: 0,
      timeRemaining: 0,
      isSubmitting: false,

      loadAssessment: (assessment) => {
        const currentId = get().currentAssessmentId;
        // If loading a new assessment vs resuming
        if (currentId !== assessment.id) {
          set({
            currentAssessmentId: assessment.id,
            assessment,
            questions: assessment.questions,
            answers: {},
            currentQuestionIndex: 0,
            timeRemaining: assessment.duration * 60, // Convert minutes to seconds
            isSubmitting: false,
          });
        }
      },

      setAnswer: (questionId, answer) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer,
          },
        }));
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      goToQuestion: (index) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },
      
      decrementTime: () => {
        const { timeRemaining } = get();
        if (timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      setSubmitting: (isSubmitting) => set({ isSubmitting }),

      resetQuiz: () => {
        set({
          currentAssessmentId: null,
          assessment: null,
          questions: [],
          answers: {},
          currentQuestionIndex: 0,
          timeRemaining: 0,
          isSubmitting: false,
        });
        // This will persist the reset state
      },
    }),
    {
      name: 'assessment-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
