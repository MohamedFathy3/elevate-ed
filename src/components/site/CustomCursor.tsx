import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [hidden, setHidden] = useState(true);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });
  const ringX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [role=button]"));
    };
    const leave = () => setHidden(true);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  return (
    <>
      <motion.div
        style={{ translateX: sx, translateY: sy, opacity: hidden ? 0 : 1 }}
        className="pointer-events-none fixed top-0 left-0 z-[200] -ml-1 -mt-1 w-2 h-2 rounded-full bg-accent mix-blend-difference hidden md:block"
      />
      <motion.div
        style={{ translateX: ringX, translateY: ringY, opacity: hidden ? 0 : 1 }}
        animate={{ scale: hovering ? 1.8 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="pointer-events-none fixed top-0 left-0 z-[200] -ml-5 -mt-5 w-10 h-10 rounded-full border border-foreground/30 mix-blend-difference hidden md:block"
      />
    </>
  );
};
