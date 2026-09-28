"use client";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `relative px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "text-accent"
      : "text-text-secondary hover:text-text-primary"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-charcoal/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/dashboard" className="font-scoreboard font-bold text-xl text-text-primary">
          FitTrack
        </Link>

        {user && (
          <nav className="flex items-center gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-accent after:absolute after:bottom-0 after:left-3 after:right-3 after:h-1 after:bg-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/steps"
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-accent after:absolute after:bottom-0 after:left-3 after:right-3 after:h-1 after:bg-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              Steps
            </NavLink>
            <NavLink
              to="/workouts"
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-accent after:absolute after:bottom-0 after:left-3 after:right-3 after:h-1 after:bg-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              Workouts
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-accent after:absolute after:bottom-0 after:left-3 after:right-3 after:h-1 after:bg-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              Profile
            </NavLink>
          </nav>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-text-secondary sm:inline">{user.name}</span>
            <motion.button
              type="button"
              onClick={handleLogout}
              className="btn-secondary"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
            >
              Logout
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
}