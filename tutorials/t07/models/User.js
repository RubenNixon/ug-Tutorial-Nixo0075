import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username. "]
        },
        email: {
            type: String,
            required: [true, "Please provide an email address."],
            unique: true
        },
        role: {
            type: String,
            default: "student"
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;