import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

// Prisma settings
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatar(),
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: faker.random.alphaNumeric(8, { casing: 'upper' }),
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: faker.date.soon(10),
      firstTeamCountryCode: faker.address.countryCode(),
      secondTeamCountryCode: faker.address.countryCode(),
    },
  });

  await prisma.game.create({
    data: {
      date: faker.date.soon(10),
      firstTeamCountryCode: faker.address.countryCode(),
      secondTeamCountryCode: faker.address.countryCode(),

      guesses: {
        create: {
          firstTeamPoints: 1,
          secondTeamPoints: 2,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
