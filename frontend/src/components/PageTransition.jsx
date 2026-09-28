import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

// Enter-only transition. Changing the key remounts the wrapper on every route
// change, so the new page fades and slides in. No exit animation on purpose:
// an exiting <Routes> re-renders with the NEW location and flashes the wrong page.
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
