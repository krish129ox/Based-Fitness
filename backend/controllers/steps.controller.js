import StepLog from "../models/StepLog.js";

const startOfDay = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

const dayKey = (date) => date.toISOString().slice(0, 10);

export const upsertSteps = async (req, res) => {
  const { date, stepCount } = req.body;
  const day = startOfDay(date);

  if (!day) {
    return res.status(400).json({ message: "Invalid date" });
  }

  const count = Number(stepCount);
  if (!Number.isFinite(count) || count < 0) {
    return res.status(400).json({ message: "stepCount must be a number of 0 or more" });
  }

  const log = await StepLog.findOneAndUpdate(
    { userId: req.user._id, date: day },
    { $set: { stepCount: count } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return res.status(201).json(log);
};

export const getSteps = async (req, res) => {
  const { range } = req.query;
  const today = startOfDay(new Date());

  if (range !== "week") {
    const todayLog = await StepLog.findOne({
      userId: req.user._id,
      date: today,
    }).lean();

    return res.json({
      range: "today",
      date: dayKey(today),
      total: todayLog ? todayLog.stepCount : 0,
      logs: todayLog ? [todayLog] : [],
    });
  }

  const start = new Date(today);
  start.setDate(start.getDate() - 6);

  const logs = await StepLog.find({
    userId: req.user._id,
    date: { $gte: start, $lte: today },
  })
    .sort({ date: 1 })
    .lean();

  const byKey = new Map(logs.map((log) => [dayKey(new Date(log.date)), log.stepCount]));

  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const cursor = new Date(start);
    cursor.setDate(start.getDate() + i);
    const key = dayKey(cursor);
    days.push({ date: key, stepCount: byKey.get(key) || 0 });
  }

  return res.json({
    range: "week",
    total: days.reduce((sum, d) => sum + d.stepCount, 0),
    average: Math.round(days.reduce((sum, d) => sum + d.stepCount, 0) / 7),
    days,
  });
};
