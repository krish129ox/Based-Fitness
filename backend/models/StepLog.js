import mongoose from "mongoose";

const stepLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    stepCount: {
      type: Number,
      required: [true, "Step count is required"],
      min: [0, "Step count cannot be negative"],
    },
  },
  { versionKey: false, timestamps: false }
);

stepLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const StepLog = mongoose.model("StepLog", stepLogSchema);

export default StepLog;
