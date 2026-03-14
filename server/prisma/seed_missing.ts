import { PrismaClient, QuestionType, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

const missingAptitudeQuestions = [
  // 5 Logical
  {
    questionText: "If A is the brother of B, B is the sister of C, and C is the father of D, how is D related to A?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Nephew or Niece",isCorrect:true},{label:"B",value:"Cousin",isCorrect:false},{label:"C",value:"Brother",isCorrect:false},{label:"D",value:"Uncle",isCorrect:false}],
    correctAnswer: "A", category: "Logical", weight: 1, explanation: "Since C is the father of D, D is the child of C. A is the brother of C. Therefore, D is the nephew or niece of A."
  },
  {
    questionText: "Find the odd one out from the following: 3, 5, 11, 14, 17, 21",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"11",isCorrect:false},{label:"B",value:"14",isCorrect:true},{label:"C",value:"17",isCorrect:false},{label:"D",value:"21",isCorrect:false}],
    correctAnswer: "B", category: "Logical", weight: 1, explanation: "Except 14, all others are odd numbers (or 14 is the only even number)."
  },
  {
    questionText: "In a certain code, MONKEY is written as XDJMNL. How is TIGER written in that code?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"QDFHS",isCorrect:true},{label:"B",value:"SDFHS",isCorrect:false},{label:"C",value:"SHFDQ",isCorrect:false},{label:"D",value:"UJHFS",isCorrect:false}],
    correctAnswer: "A", category: "Logical", weight: 1, explanation: "The word is written in reverse and then each letter is moved one step backward in the alphabet."
  },
  {
    questionText: "Which direction are you facing if you start facing North, turn 90 degrees clockwise, then turn 135 degrees counter-clockwise?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"North-West",isCorrect:true},{label:"B",value:"South-East",isCorrect:false},{label:"C",value:"West",isCorrect:false},{label:"D",value:"East",isCorrect:false}],
    correctAnswer: "A", category: "Logical", weight: 1, explanation: "North -> +90 = East. East -> -135 = North-West."
  },
  {
    questionText: "Statement: All pens are pencils. Some pencils are erasers. Conclusion 1: Some pens are erasers. Conclusion 2: No pens are erasers.",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Only Conclusion 1 follows",isCorrect:false},{label:"B",value:"Only Conclusion 2 follows",isCorrect:false},{label:"C",value:"Either 1 or 2 follows",isCorrect:true},{label:"D",value:"Neither follows",isCorrect:false}],
    correctAnswer: "C", category: "Logical", weight: 1, explanation: "They form a complementary pair (Some and No)."
  },

  // 6 Verbal
  {
    questionText: "Choose the synonym for 'Abundant'.",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Scarce",isCorrect:false},{label:"B",value:"Plentiful",isCorrect:true},{label:"C",value:"Brief",isCorrect:false},{label:"D",value:"Empty",isCorrect:false}],
    correctAnswer: "B", category: "Verbal", weight: 1, explanation: "Abundant means existing or available in large quantities; plentiful."
  },
  {
    questionText: "Choose the antonym for 'Optimistic'.",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Pessimistic",isCorrect:true},{label:"B",value:"Hopeful",isCorrect:false},{label:"C",value:"Radiant",isCorrect:false},{label:"D",value:"Cheerful",isCorrect:false}],
    correctAnswer: "A", category: "Verbal", weight: 1, explanation: "Pessimistic is the direct opposite of optimistic."
  },
  {
    questionText: "Fill in the blank: The team was completely _____ by the sudden turn of events.",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Encouraged",isCorrect:false},{label:"B",value:"Flabbergasted",isCorrect:true},{label:"C",value:"Ignored",isCorrect:false},{label:"D",value:"Applauded",isCorrect:false}],
    correctAnswer: "B", category: "Verbal", weight: 1, explanation: "Flabbergasted means greatly surprised or astonished."
  },
  {
    questionText: "Which word is correctly spelled?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Occasion",isCorrect:true},{label:"B",value:"Occassion",isCorrect:false},{label:"C",value:"Ocasion",isCorrect:false},{label:"D",value:"Ocassion",isCorrect:false}],
    correctAnswer: "A", category: "Verbal", weight: 1, explanation: "Occasion takes two 'c's and one 's'."
  },
  {
    questionText: "Oasis is to Sand as Island is to _____.",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Tree",isCorrect:false},{label:"B",value:"Water",isCorrect:true},{label:"C",value:"Sea",isCorrect:false},{label:"D",value:"Land",isCorrect:false}],
    correctAnswer: "B", category: "Verbal", weight: 1, explanation: "An oasis is land surrounded by sand. An island is land surrounded by water."
  },
  {
    questionText: "Identify the grammatical error: 'He did not went to the market yesterday.'",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"He did",isCorrect:false},{label:"B",value:"not went",isCorrect:true},{label:"C",value:"to the",isCorrect:false},{label:"D",value:"market yesterday",isCorrect:false}],
    correctAnswer: "B", category: "Verbal", weight: 1, explanation: "After 'did not', the base form of the verb ('go') should be used."
  },

  // 6 Numerical
  {
    questionText: "If the price of a book is reduced by 20%, its consumption increases by 20%. What is the net effect on revenue?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"0%",isCorrect:false},{label:"B",value:"4% increase",isCorrect:false},{label:"C",value:"4% decrease",isCorrect:true},{label:"D",value:"2% decrease",isCorrect:false}],
    correctAnswer: "C", category: "Numerical", weight: 1, explanation: "Net effect = -20 + 20 - (20*20)/100 = -4%."
  },
  {
    questionText: "A person covers a distance in 40 minutes at 45 km/hr. To cover it in 30 minutes, what should be his speed?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"50 km/hr",isCorrect:false},{label:"B",value:"60 km/hr",isCorrect:true},{label:"C",value:"65 km/hr",isCorrect:false},{label:"D",value:"55 km/hr",isCorrect:false}],
    correctAnswer: "B", category: "Numerical", weight: 1, explanation: "Distance = 45 * (40/60) = 30 km. New speed = 30 / (30/60) = 60 km/hr."
  },
  {
    questionText: "What is the simple interest on Rs. 5000 at 8% per annum for 3 years?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Rs. 1200",isCorrect:true},{label:"B",value:"Rs. 1000",isCorrect:false},{label:"C",value:"Rs. 1500",isCorrect:false},{label:"D",value:"Rs. 800",isCorrect:false}],
    correctAnswer: "A", category: "Numerical", weight: 1, explanation: "SI = (P*R*T)/100 = (5000*8*3)/100 = 1200."
  },
  {
    questionText: "A can do a piece of work in 15 days and B can do it in 20 days. If they work together, in how many days will the work be completed?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"60/7 days",isCorrect:true},{label:"B",value:"10 days",isCorrect:false},{label:"C",value:"8 days",isCorrect:false},{label:"D",value:"12 days",isCorrect:false}],
    correctAnswer: "A", category: "Numerical", weight: 1, explanation: "Combined rate = 1/15 + 1/20 = 7/60. Days = 60/7."
  },
  {
    questionText: "The average of 5 numbers is 20. If each number is multiplied by 3, what will be the new average?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"20",isCorrect:false},{label:"B",value:"60",isCorrect:true},{label:"C",value:"100",isCorrect:false},{label:"D",value:"40",isCorrect:false}],
    correctAnswer: "B", category: "Numerical", weight: 1, explanation: "If each observation is multiplied by a constant k, the new average is k times the old average."
  },
  {
    questionText: "Find the value of x if 3x + 15 = 45.",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"10",isCorrect:true},{label:"B",value:"15",isCorrect:false},{label:"C",value:"20",isCorrect:false},{label:"D",value:"5",isCorrect:false}],
    correctAnswer: "A", category: "Numerical", weight: 1, explanation: "3x = 30 => x = 10."
  },

  // 6 Spatial
  {
    questionText: "Which shape can be formed by crossing two identical perpendicular cylinders?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Cube",isCorrect:false},{label:"B",value:"Steinmetz solid",isCorrect:true},{label:"C",value:"Sphere",isCorrect:false},{label:"D",value:"Cone",isCorrect:false}],
    correctAnswer: "B", category: "Spatial", weight: 1, explanation: "The intersection of two cylinders of equal radius is a Steinmetz solid."
  },
  {
    questionText: "If you mirror a lowercase 'b', what letter does it resemble?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"p",isCorrect:false},{label:"B",value:"q",isCorrect:false},{label:"C",value:"d",isCorrect:true},{label:"D",value:"b",isCorrect:false}],
    correctAnswer: "C", category: "Spatial", weight: 1, explanation: "Mirroring the letter b along the vertical axis gives a d."
  },
  {
    questionText: "How many small cubes form a 3x3x3 Rubik's cube, excluding the central mechanism?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"27",isCorrect:false},{label:"B",value:"26",isCorrect:true},{label:"C",value:"24",isCorrect:false},{label:"D",value:"18",isCorrect:false}],
    correctAnswer: "B", category: "Spatial", weight: 1, explanation: "A 3x3x3 cube has 27 pieces. Subtracting the solid center piece leaves 26 visible cubies."
  },
  {
    questionText: "When a clock reads 3:15, what is the angle between the minute and hour hands?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"0 degrees",isCorrect:false},{label:"B",value:"7.5 degrees",isCorrect:true},{label:"C",value:"15 degrees",isCorrect:false},{label:"D",value:"22.5 degrees",isCorrect:false}],
    correctAnswer: "B", category: "Spatial", weight: 1, explanation: "Minute hand is at 90 deg. Hour hand is at 90 + 30*(15/60) = 97.5 deg. Difference is 7.5 deg."
  },
  {
    questionText: "Which of the following describes the resulting solid when a rectangle is rotated around one of its sides?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"Cylinder",isCorrect:true},{label:"B",value:"Cone",isCorrect:false},{label:"C",value:"Sphere",isCorrect:false},{label:"D",value:"Pyramid",isCorrect:false}],
    correctAnswer: "A", category: "Spatial", weight: 1, explanation: "Rotating a rectangle around a side sweeps out a cylinder."
  },
  {
    questionText: "Imagine a cube. You cut off one of its corners with a flat plane. How many faces does the new solid have?",
    type: QuestionType.MULTIPLE_CHOICE,
    options: [{label:"A",value:"6",isCorrect:false},{label:"B",value:"7",isCorrect:true},{label:"C",value:"8",isCorrect:false},{label:"D",value:"9",isCorrect:false}],
    correctAnswer: "B", category: "Spatial", weight: 1, explanation: "A cube has 6 faces. Cutting a corner adds 1 new face without removing any existing completely, making it 7 faces."
  }
];

const ratingOptions = [
  { label: "Strongly Disagree", value: "1" },
  { label: "Disagree", value: "2" },
  { label: "Neutral", value: "3" },
  { label: "Agree", value: "4" },
  { label: "Strongly Agree", value: "5" }
];

const missingPersonalityQuestions = [
  // 4 Openness
  { questionText: "I have a vivid imagination and enjoy thinking abstractly.", category: "Openness" },
  { questionText: "I prefer routine over trying out new and spontaneous ideas.", category: "Openness", weight: -1 }, // Reverse
  { questionText: "I love exploring art, music, or poetry from different cultures.", category: "Openness" },
  { questionText: "I am generally not interested in theoretical discussions.", category: "Openness", weight: -1 }, // Reverse

  // 4 Conscientiousness
  { questionText: "I leave my belongings around the room rather than putting them away.", category: "Conscientiousness", weight: -1 }, // Reverse
  { questionText: "I pay attention to small details and double-check my work.", category: "Conscientiousness" },
  { questionText: "I am always prepared and start assignments right away.", category: "Conscientiousness" },
  { questionText: "I frequently struggle with discipline and meeting deadlines.", category: "Conscientiousness", weight: -1 }, // Reverse

  // 4 Extraversion
  { questionText: "I start conversations easily and enjoy talking to strangers.", category: "Extraversion" },
  { questionText: "I prefer working alone rather than in large team settings.", category: "Extraversion", weight: -1 }, // Reverse
  { questionText: "I have a lot of energy when I'm around crowds.", category: "Extraversion" },
  { questionText: "I rarely take charge or act as the leader in group activities.", category: "Extraversion", weight: -1 }, // Reverse

  // 4 Agreeableness
  { questionText: "I am quick to forgive others when they make a mistake.", category: "Agreeableness" },
  { questionText: "I can be quite cynical and suspicious of people's intentions.", category: "Agreeableness", weight: -1 }, // Reverse
  { questionText: "I sympathize with others' feelings and try to comfort them.", category: "Agreeableness" },
  { questionText: "I am not deeply concerned with the well-being of strangers.", category: "Agreeableness", weight: -1 }, // Reverse

  // 4 Neuroticism
  { questionText: "I remain extremely calm, even in high-stress situations.", category: "Neuroticism", weight: -1 }, // Reverse
  { questionText: "My mood fluctuates a lot throughout the day.", category: "Neuroticism" },
  { questionText: "I often feel overwhelmed by my responsibilities.", category: "Neuroticism" },
  { questionText: "I seldom feel sad, anxious, or depressed.", category: "Neuroticism", weight: -1 } // Reverse
].map(q => ({
  questionText: q.questionText,
  type: QuestionType.RATING_SCALE,
  options: ratingOptions,
  category: q.category,
  weight: typeof q.weight === "number" ? q.weight : 1
}));

const enjoyOptions = [
  { label: "Not at all", value: "1" },
  { label: "Slightly", value: "2" },
  { label: "Moderately", value: "3" },
  { label: "Very much", value: "4" },
  { label: "Extremely", value: "5" }
];

const missingInterestQuestions = [
  // 3 Realistic
  { questionText: "How much would you enjoy operating heavy machinery or driving large vehicles?" },
  { questionText: "How much would you enjoy working outdoors with your hands, such as gardening or farming?" },
  { questionText: "How much would you enjoy fixing electronic gadgets and assembling computer hardware?" },
  // 3 Investigative
  { questionText: "How much would you enjoy researching complex medical phenomena in a laboratory?" },
  { questionText: "How much would you enjoy solving advanced mathematical equations?" },
  { questionText: "How much would you enjoy analyzing data to predict future market trends?" },
  // 3 Artistic
  { questionText: "How much would you enjoy designing the user interface for a new mobile app?" },
  { questionText: "How much would you enjoy acting in a theater play or directing a short film?" },
  { questionText: "How much would you enjoy writing articles, blogs, or fictional stories?" },
  // 3 Social
  { questionText: "How much would you enjoy working directly with patients to help them undergo physical therapy?" },
  { questionText: "How much would you enjoy teaching a subject you love to high school students?" },
  { questionText: "How much would you enjoy participating in community service or NGO events?" },
  // 3 Enterprising
  { questionText: "How much would you enjoy negotiating deals and contracts on behalf of a corporation?" },
  { questionText: "How much would you enjoy starting and running your own startup company?" },
  { questionText: "How much would you enjoy giving a presentation to convince investors to fund a project?" },
  // 3 Conventional
  { questionText: "How much would you enjoy balancing financial ledgers and calculating taxes for a business?" },
  { questionText: "How much would you enjoy maintaining strict inventory records for a large warehouse?" },
  { questionText: "How much would you enjoy following a set protocol to ensure a software product meets quality standards?" }
].map((q, index) => {
  let cat = "Realistic";
  if (index >= 3 && index < 6) cat = "Investigative";
  if (index >= 6 && index < 9) cat = "Artistic";
  if (index >= 9 && index < 12) cat = "Social";
  if (index >= 12 && index < 15) cat = "Enterprising";
  if (index >= 15) cat = "Conventional";
  return {
    questionText: q.questionText,
    type: QuestionType.RATING_SCALE,
    options: enjoyOptions,
    category: cat,
    weight: 1
  };
});

async function main() {
  console.log("Adding missing questions to assessments...");

  // 1. Get tests
  const aptitude = await prisma.assessment.findFirst({ where: { type: 'APTITUDE' } });
  const personality = await prisma.assessment.findFirst({ where: { type: 'PERSONALITY_BIG_FIVE' } });
  const interest = await prisma.assessment.findFirst({ where: { type: 'INTEREST_RIASEC' } });

  let addedQs = 0;

  if (aptitude) {
    for (const q of missingAptitudeQuestions) {
      await prisma.question.create({ data: { ...q, assessmentId: aptitude.id, options: q.options as any } });
      addedQs++;
    }
  }

  if (personality) {
    for (const q of missingPersonalityQuestions) {
      await prisma.question.create({ data: { ...q, assessmentId: personality.id, options: q.options as any } });
      addedQs++;
    }
  }

  if (interest) {
    for (const q of missingInterestQuestions) {
      await prisma.question.create({ data: { ...q, assessmentId: interest.id, options: q.options as any } });
      addedQs++;
    }
  }

  console.log(`Added ${addedQs} missing questions.`);

  const questionCount = await prisma.question.count();
  console.log(`Total questions in database: ${questionCount}`);

  // Add 4 notifications
  const priya = await prisma.user.findUnique({ where: { email: 'priya.sharma@gmail.com' } });
  const arjun = await prisma.user.findUnique({ where: { email: 'arjun.patel@gmail.com' } });
  const sneha = await prisma.user.findUnique({ where: { email: 'sneha.das@gmail.com' } });
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  let notifsAdded = 0;

  if (priya) {
    await prisma.notification.create({
      data: {
        userId: priya.id,
        title: "Assessment Result Ready",
        message: "Your recent Career Aptitude Test results are now available.",
        type: NotificationType.ASSESSMENT_RESULT
      }
    });
    notifsAdded++;
  }

  if (arjun) {
    await prisma.notification.create({
      data: {
        userId: arjun.id,
        title: "Appointment Reminder",
        message: "You have an appointment with Prof. Sanjay Gupta tomorrow.",
        type: NotificationType.REMINDER
      }
    });
    notifsAdded++;
  }

  if (sneha) {
    await prisma.notification.create({
      data: {
        userId: sneha.id,
        title: "Welcome to PathFinder!",
        message: "We're glad you joined. Complete your profile to get started.",
        type: NotificationType.SYSTEM
      }
    });
    notifsAdded++;
  }

  if (admin) {
    await prisma.notification.create({
      data: {
        userId: admin.id, // Using admin for system announcement as it needs a target user
        title: "System Update",
        message: "New careers have been added to the platform.",
        type: NotificationType.SYSTEM
      }
    });
    notifsAdded++;
  }

  console.log(`Added ${notifsAdded} new notifications.`);
  
  const totalNotifs = await prisma.notification.count();
  console.log(`Total notifications in database: ${totalNotifs}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
