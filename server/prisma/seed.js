import prisma from '../data/connection.js'; // This already initializes your client with the pg adapter!
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up any existing tokens/users to avoid unique constraint errors during testing
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Define and hash the Admin password
  const plainTextPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin123!'; 
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

  // 3. Define and hash the Guest password
  const guestPassword = 'gestUser@123';
  const guestHashedPassword = await bcrypt.hash(guestPassword, 10);

  // 4. Create your Admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User', 
      password: hashedPassword,
    },
  });

  // 5. Create your Guest user (matching your frontend login bypass credentials!)
  const guestUser = await prisma.user.create({
    data: {
      email: 'gestuser@gmail.com',
      name: 'Guest User', 
      password: guestHashedPassword,
      // If your schema has an avatarUrl field, you can pre-set a default image here:
      // avatarUrl: '/default-guest.png' 
    },
  });

  console.log('✅ Seeding complete!');
  console.log('-----------------------------------------------');
  console.log(`Admin User Email: ${adminUser.email}`);
  console.log(`Admin Password:   ${plainTextPassword}`);
  console.log('-----------------------------------------------');
  console.log(`Guest User Email: ${guestUser.email}`);
  console.log(`Guest Password:   ${guestPassword}`);
  console.log('-----------------------------------------------');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });