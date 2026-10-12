import dotenv from 'dotenv';
dotenv.config({ override: true });
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    console.log('Previous user data cleared from the database.');

    const usersToInsert = [
      { userId: 1, name: "Ada Lovelace", role: "Software Engineer" },
      { userId: 2, name: "Alan Turing", role: "Cryptographer" },
      { userId: 3, name: "Grace Hopper", role: "Systems Architect" },
      { userId: 4, name: "Margaret Hamilton", role: "Flight Software Engineer" },
      { userId: 5, name: "Tim Berners-Lee", role: "Web Inventor" }
    ];

    await User.insertMany(usersToInsert);
    console.log('Database successfully seeded with 5 user documents!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedDatabase();