import dotenv from 'dotenv';
import Topic from "./models/Topic.js";
dotenv.config({ override: true });
import express from 'express';
import mongoose from 'mongoose';
import User from "./models/User.js";

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

app.post('/api/test-setup', async (req, res) => {
    try {
        const { username, email, role, title, units, prereqs } = req.body;

        const newUser = await User.create({
            username: username,
            email: email,
            role: role
        });

        const newTopic = await Topic.create({
            title: title,
            units: units,
            prerequisites: prereqs
        });

        res.status(200).json({
            message: "Database successfully populated!",
            user: newUser,
            topic: newTopic
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = 5100;
app.listen(PORT, () => {
    console.log(`Server actively running on port ${PORT}`);
});