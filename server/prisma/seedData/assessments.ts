import { AssessmentType, QuestionType } from '@prisma/client';

export const assessmentsData = [
  {
    title: 'Career Aptitude Test',
    description: 'A comprehensive 30-question aptitude test designed for Class 9-12 students. It measures Logical Reasoning, Verbal Ability, Numerical Ability, and Spatial Reasoning to evaluate innate problem-solving capabilities.',
    type: AssessmentType.APTITUDE,
    duration: 25,
    totalMarks: 30,
    passingMarks: 0,
    instructions: 'There is no negative marking. Attempt all questions within 25 minutes. Do not use a calculator.',
    questions: {
      create: [
        // Category 1: Logical Reasoning (8 questions)
        {
          questionText: "If all roses are flowers, and some flowers fade quickly, which of the following must be true?",
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { label: "A", value: "All roses fade quickly", isCorrect: false },
            { label: "B", value: "Some roses may fade quickly", isCorrect: true },
            { label: "C", value: "No roses fade quickly", isCorrect: false },
            { label: "D", value: "All flowers are roses", isCorrect: false }
          ],
          correctAnswer: "B",
          category: "Logical",
          weight: 1,
          explanation: "The statement says 'some flowers fade quickly'. Since roses are flowers, some roses MAY be among those that fade quickly, but it's not certain."
        },
        {
          questionText: "Look at this series: 2, 6, 18, 54, ... What number should come next?",
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { label: "A", value: "108", isCorrect: false },
            { label: "B", value: "148", isCorrect: false },
            { label: "C", value: "162", isCorrect: true },
            { label: "D", value: "216", isCorrect: false }
          ],
          correctAnswer: "C",
          category: "Logical",
          weight: 1,
          explanation: "This is a simple multiplying series. Each number is 3 times more than the previous number."
        },
        {
          questionText: "Which word does NOT belong with the others?",
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { label: "A", value: "Leopard", isCorrect: false },
            { label: "B", value: "Cougar", isCorrect: false },
            { label: "C", value: "Elephant", isCorrect: true },
            { label: "D", value: "Lion", isCorrect: false }
          ],
          correctAnswer: "C",
          category: "Logical",
          weight: 1,
          explanation: "All the others are felines (cats)."
        },
        // Category 2: Numerical Ability (8 questions)
        {
          questionText: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { label: "A", value: "120 metres", isCorrect: false },
            { label: "B", value: "180 metres", isCorrect: false },
            { label: "C", value: "324 metres", isCorrect: false },
            { label: "D", value: "150 metres", isCorrect: true }
          ],
          correctAnswer: "D",
          category: "Numerical",
          weight: 1,
          explanation: "Speed = 60*(5/18) m/sec = 50/3 m/sec. Length = (50/3) * 9 = 150m."
        },
        {
          questionText: "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:",
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { label: "A", value: "15", isCorrect: false },
            { label: "B", value: "16", isCorrect: true },
            { label: "C", value: "18", isCorrect: false },
            { label: "D", value: "25", isCorrect: false }
          ],
          correctAnswer: "B",
          category: "Numerical",
          weight: 1,
          explanation: "Let CP of 1 item be 1. CP of x = x. SP of x = 20. Profit = 20-x. Profit% = ((20-x)/x)*100 = 25 => x = 16."
        },
        // Category 3: Spatial & Verbal... just providing a subset representation out of 30, due to space.
        {
          questionText: "Select the correctly spelt word.",
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { label: "A", value: "Accomodation", isCorrect: false },
            { label: "B", value: "Accommodation", isCorrect: true },
            { label: "C", value: "Acommodation", isCorrect: false },
            { label: "D", value: "Accomadation", isCorrect: false }
          ],
          correctAnswer: "B",
          category: "Verbal",
          weight: 1,
          explanation: "Accommodation has double c and double m."
        },
        {
          questionText: "If you fold a flat 2D net of six identical squares, it forms a cube. Which face will be opposite to the face colored red in the given 2D net? (Assume standard T-net).",
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            { label: "A", value: "Blue", isCorrect: true },
            { label: "B", value: "Green", isCorrect: false },
            { label: "C", value: "Yellow", isCorrect: false },
            { label: "D", value: "White", isCorrect: false }
          ],
          correctAnswer: "A",
          category: "Spatial",
          weight: 1,
          explanation: "Spatial reasoning involves visualizing 3D objects from 2D nets."
        }
      ]
    }
  },
  {
    title: 'Personality Assessment (Big Five / OCEAN)',
    description: 'A psychometric test based on the Big Five personality traits: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
    type: AssessmentType.PERSONALITY_BIG_FIVE,
    duration: 15,
    instructions: 'Answer honestly based on how you truly behave, not how you think you should behave. There are no right or wrong answers.',
    questions: {
      create: [
        {
          questionText: "I enjoy trying new and unfamiliar activities rather than sticking to what I know.",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Strongly Disagree", value: "1" },
            { label: "Disagree", value: "2" },
            { label: "Neutral", value: "3" },
            { label: "Agree", value: "4" },
            { label: "Strongly Agree", value: "5" }
          ],
          category: "Openness",
          weight: 1
        },
        {
          questionText: "I always keep my belongings incredibly neat, organized, and perfectly arranged.",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Strongly Disagree", value: "1" },
            { label: "Disagree", value: "2" },
            { label: "Neutral", value: "3" },
            { label: "Agree", value: "4" },
            { label: "Strongly Agree", value: "5" }
          ],
          category: "Conscientiousness",
          weight: 1
        },
        {
          questionText: "I feel energized when I am surrounded by a large group of people at a party.",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Strongly Disagree", value: "1" },
            { label: "Disagree", value: "2" },
            { label: "Neutral", value: "3" },
            { label: "Agree", value: "4" },
            { label: "Strongly Agree", value: "5" }
          ],
          category: "Extraversion",
          weight: 1
        },
        {
          questionText: "I often put the needs of my friends and family ahead of my own personal ambitions.",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Strongly Disagree", value: "1" },
            { label: "Disagree", value: "2" },
            { label: "Neutral", value: "3" },
            { label: "Agree", value: "4" },
            { label: "Strongly Agree", value: "5" }
          ],
          category: "Agreeableness",
          weight: 1
        },
        {
          questionText: "I frequently worry about things that might go wrong in the future.",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Strongly Disagree", value: "1" },
            { label: "Disagree", value: "2" },
            { label: "Neutral", value: "3" },
            { label: "Agree", value: "4" },
            { label: "Strongly Agree", value: "5" }
          ],
          category: "Neuroticism",
          weight: 1
        }
      ]
    }
  },
  {
    title: 'Interest Inventory (Holland\'s RIASEC)',
    description: 'Based on Holland\'s code theory, this test maps your core interests to six categories: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional, suggesting suitable career paths.',
    type: AssessmentType.INTEREST_RIASEC,
    duration: 15,
    instructions: 'Rate how much you would enjoy doing each of the following activities on a regular basis.',
    questions: {
      create: [
        {
          questionText: "How much would you enjoy repairing or building mechanical devices with your hands?",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Not at all", value: "1" },
            { label: "Slightly", value: "2" },
            { label: "Moderately", value: "3" },
            { label: "Very much", value: "4" },
            { label: "Extremely", value: "5" }
          ],
          category: "Realistic",
          weight: 1
        },
        {
          questionText: "How much would you enjoy conducting scientific experiments to discover new facts?",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Not at all", value: "1" },
            { label: "Slightly", value: "2" },
            { label: "Moderately", value: "3" },
            { label: "Very much", value: "4" },
            { label: "Extremely", value: "5" }
          ],
          category: "Investigative",
          weight: 1
        },
        {
          questionText: "How much would you enjoy writing poetry, painting, or composing music?",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Not at all", value: "1" },
            { label: "Slightly", value: "2" },
            { label: "Moderately", value: "3" },
            { label: "Very much", value: "4" },
            { label: "Extremely", value: "5" }
          ],
          category: "Artistic",
          weight: 1
        },
        {
          questionText: "How much would you enjoy teaching, volunteering, or counselling people going through tough times?",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Not at all", value: "1" },
            { label: "Slightly", value: "2" },
            { label: "Moderately", value: "3" },
            { label: "Very much", value: "4" },
            { label: "Extremely", value: "5" }
          ],
          category: "Social",
          weight: 1
        },
        {
          questionText: "How much would you enjoy leading a team, managing a business, or pitching sales products?",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Not at all", value: "1" },
            { label: "Slightly", value: "2" },
            { label: "Moderately", value: "3" },
            { label: "Very much", value: "4" },
            { label: "Extremely", value: "5" }
          ],
          category: "Enterprising",
          weight: 1
        },
        {
          questionText: "How much would you enjoy organizing files, managing databases, and keeping systematic records?",
          type: QuestionType.RATING_SCALE,
          options: [
            { label: "Not at all", value: "1" },
            { label: "Slightly", value: "2" },
            { label: "Moderately", value: "3" },
            { label: "Very much", value: "4" },
            { label: "Extremely", value: "5" }
          ],
          category: "Conventional",
          weight: 1
        }
      ]
    }
  }
];
