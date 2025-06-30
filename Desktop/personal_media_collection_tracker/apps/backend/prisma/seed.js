const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { id: 'demo-user-id' },
    update: {},
    create: {
      id: 'demo-user-id',
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  console.log('Demo user created/updated:', user);

  // Add some sample media items
  const sampleMedia = [
    {
      title: 'The Matrix',
      type: 'MOVIE',
      status: 'COMPLETED',
      rating: 9,
      userId: 'demo-user-id',
    },
    {
      title: 'Breaking Bad',
      type: 'TV_SHOW',
      status: 'WATCHING',
      rating: 10,
      userId: 'demo-user-id',
    },
    {
      title: 'The Hobbit',
      type: 'BOOK',
      status: 'WANT_TO_WATCH',
      userId: 'demo-user-id',
    },
  ];

  for (const media of sampleMedia) {
    await prisma.mediaItem.upsert({
      where: { 
        title_userId: {
          title: media.title,
          userId: media.userId
        }
      },
      update: {},
      create: media,
    });
  }

  console.log('Sample media items created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
