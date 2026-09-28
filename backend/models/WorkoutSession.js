import mongoose from "mongoose";

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Run", "Gym", "Yoga", "Cycling", "Other"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    caloriesBurned: {
      type: Number,
      required: [true, "Calories burned is required"],
      min: [0, "Calories burned cannot be negative"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { versionKey: false, timestamps: false }
);

workoutSessionSchema.index({ userId: 1, date: -1 });

const WorkoutSession = mongoose.model("WorkoutSession", workoutSessionSchema);

export default WorkoutSession;
