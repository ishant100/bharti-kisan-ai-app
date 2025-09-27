import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** ms to delay the entrance animation (nice for staggering). */
  delayMs?: number;
  /** Optional extra classes for sizing/layout from parent. */
  className?: string;
};

export default function Reveal({ children, delayMs = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        `${className} transform transition-all duration-700 ease-out ` +
        (shown
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5")
      }
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
