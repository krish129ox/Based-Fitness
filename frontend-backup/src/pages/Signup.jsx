import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <div className="card">
        <div className="text-center mb-6">
          <Link to="/" className="font-scoreboard font-bold text-2xl text-text-primary">
            FitTrack
          </Link>
        </div>
        <h1 className="font-scoreboard font-bold text-xl text-text-primary mb-1">Create your account</h1>
        <p className="text-sm text-text-secondary mb-6">Start logging steps and workouts in under a minute.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="label-field">
              Full name
            </label>
            <input
              id="name"
              className="input-field"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Alex Carter"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="label-field">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="label-field">
              Phone
            </label>
            <input
              id="phone"
              className="input-field"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+15550100"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="label-field">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-text-secondary">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}