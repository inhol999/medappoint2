const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample clinics FIRST
  const clinic1 = await prisma.clinic.upsert({
    where: { clinicId: 1 },
    update: {},
    create: {
      clinicName: "St. Luke's Medical Center",
      contactNumber: '02-8723-0101',
      location: 'Quezon City',
      email: 'info@stlukes.com.ph',
      description: 'Premier medical center offering comprehensive healthcare services.',
      consultationFee: 500,
    },
  });

  const clinic2 = await prisma.clinic.upsert({
    where: { clinicId: 2 },
    update: {},
    create: {
      clinicName: 'Makati Medical Center',
      contactNumber: '02-8888-8999',
      location: 'Makati City',
      email: 'info@makatimed.net.ph',
      description: 'Leading hospital in Metro Manila providing world-class healthcare.',
      consultationFee: 600,
    },
  });

  const clinic3 = await prisma.clinic.upsert({
    where: { clinicId: 3 },
    update: {},
    create: {
      clinicName: 'The Medical City',
      contactNumber: '02-8988-1000',
      location: 'Pasig City',
      email: 'info@themedicalcity.com',
      description: 'A complete integrated healthcare system.',
      consultationFee: 550,
    },
  });
  console.log('✅ Clinics created');

  // Create Admin user AFTER clinics
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      admin: {
        create: {
          name: 'System Administrator',
          email: 'admin@medappoint.ph',
          clinicId: clinic1.clinicId,
        },
      },
    },
  });
  console.log('✅ Admin created:', adminUser.username);

  // Create sample doctor
  const doctorPassword = await bcrypt.hash('doctor123', 12);
  const doctorUser = await prisma.user.upsert({
    where: { username: 'dr.santos' },
    update: {},
    create: {
      username: 'dr.santos',
      password: doctorPassword,
      role: 'DOCTOR',
      status: 'ACTIVE',
      doctor: {
        create: {
          fullName: 'Dr. Maria Santos',
          specialization: 'Cardiology',
          licenceNumber: 'PRC-2024-001',
          phone: '09171234567',
          clinicId: clinic1.clinicId,
          availabilityStatus: 'AVAILABLE',
        },
      },
    },
  });

  // Create schedule for doctor
  const doctor = await prisma.doctor.findFirst({ where: { userId: doctorUser.userId } });
  if (doctor) {
    const days = ['Monday', 'Wednesday', 'Friday'];
    for (const day of days) {
      await prisma.schedule.create({
        data: {
          doctorId: doctor.doctorId,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          availabilitySlots: 12,
        },
      });
    }
  }
  console.log('✅ Doctor and schedules created');

  // Create sample patient
  const patientPassword = await bcrypt.hash('patient123', 12);
  await prisma.user.upsert({
    where: { username: 'juan.dela.cruz' },
    update: {},
    create: {
      username: 'juan.dela.cruz',
      password: patientPassword,
      role: 'PATIENT',
      status: 'ACTIVE',
      patient: {
        create: {
          fullName: 'Juan Dela Cruz',
          email: 'juan@example.com',
          phone: '09187654321',
          address: 'Manila, Philippines',
          dateOfBirth: new Date('1990-05-15'),
        },
      },
    },
  });
  console.log('✅ Sample patient created');

  console.log('\n🎉 Seeding complete!');
  console.log('\nDefault credentials:');
  console.log('  Admin:   username=admin       password=admin123');
  console.log('  Doctor:  username=dr.santos   password=doctor123');
  console.log('  Patient: username=juan.dela.cruz  password=patient123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
