import WorkoutSession from "../models/WorkoutSession.js";

export const createWorkout = async (req, res) => {
  const { type, duration, caloriesBurned, date, notes } = req.body;
  const when = date ? new Date(date) : new Date();

  if (Number.isNaN(when.getTime())) {
    return res.status(400).json({ message: "Invalid date" });
  }

  const workout = await WorkoutSession.create({
    userId: req.user._id,
    type,
    duration: Number(duration),
    caloriesBurned: Number(caloriesBurned),
    date: when,
    notes: notes ? String(notes).trim() : undefined,
  });

  return res.status(201).json(workout);
};

export const listWorkouts = async (req, res) => {
  const workouts = await WorkoutSession.find({ userId: req.user._id })
    .sort({ date: -1, createdAt: -1, _id: -1 })
    .lean();

  return res.json(workouts);
};

export const deleteWorkout = async (req, res) => {
  const workout = await WorkoutSession.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!workout) {
    return res.status(404).json({ message: "Workout not found" });
  }

  return res.json({ message: "Workout deleted", id: req.params.id });
};
