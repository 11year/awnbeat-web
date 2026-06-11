"use client";

import { motion } from "framer-motion";

const cards = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#8CD9A6" opacity="0.2" />
        <path d="M16 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#8CD9A6" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="18" r="4" fill="#8CD9A6" />
      </svg>
    ),
    label: "Yoga in the Park",
    sub: "12 members · Today 8am",
    color: "bg-white border-primary/20",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#FA9959" opacity="0.15" />
        <circle cx="24" cy="24" r="8" stroke="#FA9959" strokeWidth="2.5" />
        <line x1="24" y1="10" x2="24" y2="16" stroke="#FA9959" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="32" x2="24" y2="38" stroke="#FA9959" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="24" x2="16" y2="24" stroke="#FA9959" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="24" x2="38" y2="24" stroke="#FA9959" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Pickup Basketball",
    sub: "8 members · Tomorrow 6pm",
    color: "bg-white border-secondary/20",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#7ACCEB" opacity="0.15" />
        <path d="M14 30c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#7ACCEB" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 22l4-6 4 6" stroke="#7ACCEB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Trail Running",
    sub: "24 members · Sat 7am",
    color: "bg-white border-accent/20",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#8CD9A6" opacity="0.15" />
        <rect x="14" y="18" width="20" height="14" rx="3" stroke="#8CD9A6" strokeWidth="2.5" />
        <path d="M19 18v-2a5 5 0 0 1 10 0v2" stroke="#8CD9A6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Flag Football",
    sub: "18 members · Sun 10am",
    color: "bg-white border-primary/20",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#FA9959" opacity="0.15" />
        <path d="M24 14c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10" stroke="#FA9959" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 14l4 4-4 4" stroke="#FA9959" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Swim Club",
    sub: "31 members · Wed 6am",
    color: "bg-white border-secondary/20",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="24" r="20" fill="#7ACCEB" opacity="0.15" />
        <path d="M16 24h16M24 16v16" stroke="#7ACCEB" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Wellness Meditation",
    sub: "9 members · Daily 7am",
    color: "bg-white border-accent/20",
  },
];

export default function HeroIllustration() {
  return (
    <div className="relative w-full overflow-hidden py-6" aria-label="Activity community cards">
      <motion.div
        className="flex gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ width: "max-content" }}
      >
        {[...cards, ...cards].map((card, i) => (
          <div
            key={i}
            className={`flex-shrink-0 w-52 rounded-2xl border ${card.color} shadow-sm p-4 flex flex-col gap-3`}
          >
            {card.icon}
            <div>
              <p className="text-sm font-bold text-brand-text leading-tight">{card.label}</p>
              <p className="text-xs text-brand-muted mt-1">{card.sub}</p>
            </div>
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  style={{
                    backgroundColor: ["#8CD9A6", "#FA9959", "#7ACCEB"][j],
                    opacity: 0.8,
                  }}
                  aria-hidden="true"
                />
              ))}
              <span className="text-xs text-brand-muted ml-3 self-center">+more</span>
            </div>
          </div>
        ))}
      </motion.div>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
