import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title."]
        },
        isActive: {
            type: Boolean,
            default: true
        },
        units: {
            type: Number,
            required: [true, "Please provide the number of units."]
        },
        prerequisites: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
);

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;