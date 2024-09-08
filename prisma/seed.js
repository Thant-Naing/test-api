
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const prisma = new PrismaClient();

const seed = async () => {
  try {
    // Seed Users

    // bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    //     // Store hash in your password DB.
    // });
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password :  faker.number.hex({ min: 0, max: 65535 })
      });
    }
    await prisma.user.createMany({
      data: users,
    });
    console.log('Users seeded');

    // Seed Blogs
    const blogs = [];
    for (let i = 0; i < 10; i++) {
      blogs.push({
        header: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
      });
    }
    await prisma.blogs.createMany({
      data: blogs,
    });
    console.log('Blogs seeded');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
