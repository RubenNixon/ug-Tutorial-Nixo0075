import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config({ override: true });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});

    await Product.insertMany([
      { name: "Mechanical Keyboard", likes: false },
      { name: "Ergonomic Mouse", likes: true },
      { name: "Ultrawide Monitor", likes: false },
      { name: "Noise Cancelling Headphones", likes: false },
      { name: "USB-C Hub", likes: true }
    ]);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
