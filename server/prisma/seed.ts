import { PrismaClient, AppointmentStatus, NotificationType } from '@prisma/client';
import { usersData } from './seedData/users';
import { engineeringCareers } from './seedData/careers_engineering';
import { medicalCareers } from './seedData/careers_medical';
import { businessCareers } from './seedData/careers_business';
import { lawAndCreativeCareers } from './seedData/careers_law_creative';
import { otherCareers } from './seedData/careers_others';
import { assessmentsData } from './seedData/assessments';
import { resourcesData } from './seedData/resources';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Seed Users
  let usersCreated = 0;
  let priyaId = '';
  for (const user of usersData) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
    usersCreated++;
    if (createdUser.email === 'priya.sharma@gmail.com') {
      priyaId = createdUser.id;
    }
  }

  // Link Parent to Child
  const parent = await prisma.user.findUnique({ where: { email: 'vikram.sharma@gmail.com' }, include: { parentProfile: true } });
  if (parent && parent.parentProfile && priyaId) {
    await prisma.parentProfile.update({
      where: { id: parent.parentProfile.id },
      data: { childrenIds: [priyaId] }
    });
  }

  // 2. Seed Careers
  const allCareers = [
    ...engineeringCareers,
    ...medicalCareers,
    ...businessCareers,
    ...lawAndCreativeCareers,
    ...otherCareers
  ];
  let careersCreated = 0;
  for (const career of allCareers) {
    await prisma.career.upsert({
      where: { slug: career.slug },
      update: {},
      create: career,
    });
    careersCreated++;
  }

  // 3. Seed Assessments
  let assessmentsCreated = 0;
  let questionsCreated = 0;
  for (const acc of assessmentsData) {
    const existing = await prisma.assessment.findFirst({ where: { title: acc.title } });
    if (!existing) {
      const created = await prisma.assessment.create({
        data: acc
      });
      assessmentsCreated++;
      questionsCreated += acc.questions.create.length;
    }
  }

  // 4. Seed Resources
  let resourcesCreated = 0;
  for (const res of resourcesData) {
    const existing = await prisma.resource.findFirst({ where: { title: res.title } });
    if (!existing) {
      await prisma.resource.create({ data: res });
      resourcesCreated++;
    }
  }

  // 5. Create Appointments
  let appointmentsCreated = 0;
  const meera = await prisma.user.findUnique({ where: { email: 'dr.meera.nair@pathfinder.in' } });
  const sanjay = await prisma.user.findUnique({ where: { email: 'prof.sanjay.gupta@pathfinder.in' } });
  const kavitha = await prisma.user.findUnique({ where: { email: 'ms.kavitha.ram@pathfinder.in' } });
  
  const arjun = await prisma.user.findUnique({ where: { email: 'arjun.patel@gmail.com' } });
  const sneha = await prisma.user.findUnique({ where: { email: 'sneha.das@gmail.com' } });

  if (priyaId && meera) {
    await prisma.appointment.create({
      data: {
        studentId: priyaId,
        counsellorId: meera.id,
        scheduledAt: new Date(Date.now() - 86400000), // Yesterday
        status: AppointmentStatus.COMPLETED,
        topic: "Confused between Computer Science and Physics",
        feedback: "Dr. Nair helped me understand my aptitude results and gave clear direction.",
        rating: 5,
        meetingLink: "https://zoom.us/mock1"
      }
    });
    appointmentsCreated++;
  }

  if (arjun && sanjay) {
    await prisma.appointment.create({
      data: {
        studentId: arjun.id,
        counsellorId: sanjay.id,
        scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
        status: AppointmentStatus.CONFIRMED,
        topic: "Want to explore tech careers despite being in Commerce stream",
        meetingLink: "https://zoom.us/mock2"
      }
    });
    appointmentsCreated++;
  }

  if (sneha && kavitha) {
    await prisma.appointment.create({
      data: {
        studentId: sneha.id,
        counsellorId: kavitha.id,
        scheduledAt: new Date(Date.now() + 172800000), // Day after
        status: AppointmentStatus.PENDING,
        topic: "Career options in media and journalism"
      }
    });
    appointmentsCreated++;
  }

  // 6. Create sample notifications and activity logs 
  if (priyaId) {
    await prisma.notification.create({
      data: {
        userId: priyaId,
        title: "Appointment Completed",
        message: "Your appointment with Dr. Meera Nair was completed. Please leave a review.",
        type: NotificationType.APPOINTMENT
      }
    });
    await prisma.activityLog.create({
      data: {
        userId: priyaId,
        action: "TOOK_ASSESSMENT",
        entity: "Assessment",
        metadata: { score: 25 }
      }
    });
    await prisma.activityLog.create({
      data: {
        userId: priyaId,
        action: "VIEWED_CAREER",
        entity: "Career",
        entityId: "software-engineer"
      }
    });
  }
  
  if (arjun) {
    await prisma.activityLog.create({
      data: {
        userId: arjun.id,
        action: "BOOKED_APPOINTMENT",
        entity: "Appointment"
      }
    });
    await prisma.activityLog.create({
      data: {
        userId: arjun.id,
        action: "SAVED_CAREER",
        entity: "Career",
        entityId: "data-scientist"
      }
    });
  }
  
  if (sneha) {
    await prisma.activityLog.create({
      data: {
        userId: sneha.id,
        action: "UPDATED_PROFILE",
        entity: "User"
      }
    });
  }

  console.log('Seeding Complete!');
  console.log(`- Users seeded: ${usersCreated}`);
  console.log(`- Careers seeded: ${careersCreated}`);
  console.log(`- Assessments seeded: ${assessmentsCreated}`);
  console.log(`- Questions seeded: ${questionsCreated}`);
  console.log(`- Resources seeded: ${resourcesCreated}`);
  console.log(`- Appointments seeded: ${appointmentsCreated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
