import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.middleware.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const normalizePhone = (phone) => String(phone || "").trim();

export const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({
    $or: [{ email: normalizeEmail(email) }, { phone: normalizePhone(phone) }],
  });

  if (existing) {
    return res
      .status(409)
      .json({ message: "An account with that email or phone already exists" });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const user = await User.create({
    name: String(name).trim(),
    email: normalizeEmail(email),
    phone: normalizePhone(phone),
    passwordHash,
  });

  const token = signToken(user._id.toString());

  return res.status(201).json({ token, user: user.toSafeObject() });
};

export const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).json({ message: "Email/phone and password are required" });
  }

  const identifier = String(emailOrPhone).trim();
  const user = await User.findOne({
    $or: [{ email: normalizeEmail(identifier) }, { phone: identifier }],
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const matches = await bcrypt.compare(String(password), user.passwordHash);

  if (!matches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user._id.toString());

  return res.json({ token, user: user.toSafeObject() });
};
