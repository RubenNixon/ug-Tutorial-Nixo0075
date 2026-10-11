import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

const app = express();
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully! ");
    } catch (error) {
        console.error("MongoDB connection failed: ", error.message);
        process.exit(1);
    }
};

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const PORT = 5100;
app.listen(PORT, () => {
    console.log(`Server actively running on port ${PORT}`);
});