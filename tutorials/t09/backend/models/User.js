import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);