"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const Basketball = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="bball-grad" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#FF9A3C" />
        <stop offset="50%" stopColor="#E8721A" />
        <stop offset="100%" stopColor="#B84D00" />
      </radialGradient>
      <radialGradient id="bball-shine" cx="35%" cy="28%" r="35%">
        <stop offset="0%" stopColor="#FFD4A0" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#FFD4A0" stopOpacity="0" />
      </radialGradient>
      <clipPath id="bball-clip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
    </defs>
    <circle cx="60" cy="60" r="54" fill="url(#bball-grad)" />
    <g clipPath="url(#bball-clip)" stroke="#1A0A00" strokeWidth="3.2" fill="none" strokeLinecap="round">
      {/* horizontal seam */}
      <path d="M6 60 Q30 46 60 60 Q90 74 114 60" />
      {/* vertical seam */}
      <path d="M60 6 Q74 30 60 60 Q46 90 60 114" />
      {/* left arc seam */}
      <path d="M22 18 Q8 40 14 60 Q8 80 22 102" />
      {/* right arc seam */}
      <path d="M98 18 Q112 40 106 60 Q112 80 98 102" />
    </g>
    <circle cx="60" cy="60" r="54" fill="url(#bball-shine)" />
    <circle cx="60" cy="60" r="54" stroke="#C05800" strokeWidth="1.5" fill="none" opacity="0.4" />
  </svg>
);

const Pickleball = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="pickle-grad" cx="36%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="45%" stopColor="#F9E132" />
        <stop offset="100%" stopColor="#C8A800" />
      </radialGradient>
      <radialGradient id="pickle-shine" cx="34%" cy="27%" r="32%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <clipPath id="pickle-clip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
    </defs>
    <circle cx="60" cy="60" r="54" fill="url(#pickle-grad)" />
    <g clipPath="url(#pickle-clip)" fill="#C8A800" opacity="0.55">
      {[22,38,54,70,86].map((cx, i) =>
        [22,38,54,70,86,102].filter((_, j) => (i + j) % 2 === 0).map((cy, j) => (
          <circle key={`${i}-${j}`} cx={cx} cy={cy} r="4.2" />
        ))
      )}
      {[30,46,62,78,94].map((cx, i) =>
        [30,46,62,78,94].filter((_, j) => (i + j) % 2 === 0).map((cy, j) => (
          <circle key={`b${i}-${j}`} cx={cx} cy={cy} r="4.2" />
        ))
      )}
    </g>
    <circle cx="60" cy="60" r="54" fill="url(#pickle-shine)" />
    <circle cx="60" cy="60" r="54" stroke="#A88800" strokeWidth="1.5" fill="none" opacity="0.35" />
  </svg>
);

const Football = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="fb-grad" cx="37%" cy="31%" r="62%">
        <stop offset="0%" stopColor="#C47A3A" />
        <stop offset="50%" stopColor="#8B4513" />
        <stop offset="100%" stopColor="#5C2800" />
      </radialGradient>
      <radialGradient id="fb-shine" cx="34%" cy="27%" r="30%">
        <stop offset="0%" stopColor="#E8B07A" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#E8B07A" stopOpacity="0" />
      </radialGradient>
      <clipPath id="fb-clip">
        <ellipse cx="60" cy="60" rx="50" ry="38" transform="rotate(-20 60 60)" />
      </clipPath>
    </defs>
    <ellipse cx="60" cy="60" rx="50" ry="38" transform="rotate(-20 60 60)" fill="url(#fb-grad)" />
    <g clipPath="url(#fb-clip)" stroke="#3A1800" strokeWidth="2.5" fill="none" strokeLinecap="round">
      {/* center lace seam */}
      <line x1="38" y1="72" x2="82" y2="48" />
      {/* lace crossbars */}
      {[0,1,2,3,4].map(i => {
        const t = i / 4;
        const x1 = 38 + t * 44 - 5;
        const y1 = 72 - t * 24 - 3;
        return <line key={i} x1={x1} y1={y1} x2={x1 + 10} y2={y1 - 6} strokeWidth="2" />;
      })}
      {/* side seams */}
      <path d="M20 52 Q60 20 100 68" strokeWidth="2" />
      <path d="M20 68 Q60 100 100 52" strokeWidth="2" />
    </g>
    <ellipse cx="60" cy="60" rx="50" ry="38" transform="rotate(-20 60 60)" fill="url(#fb-shine)" />
    <ellipse cx="60" cy="60" rx="50" ry="38" transform="rotate(-20 60 60)" stroke="#5C2800" strokeWidth="1.5" fill="none" opacity="0.4" />
  </svg>
);

const SoccerBall = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="soccer-grad" cx="36%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#F5F5F5" />
        <stop offset="60%" stopColor="#E0E0E0" />
        <stop offset="100%" stopColor="#B0B0B0" />
      </radialGradient>
      <radialGradient id="soccer-shine" cx="34%" cy="26%" r="30%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <clipPath id="soccer-clip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
    </defs>
    <circle cx="60" cy="60" r="54" fill="url(#soccer-grad)" />
    <g clipPath="url(#soccer-clip)" fill="#1A1A1A" stroke="#1A1A1A" strokeWidth="1.5" strokeLinejoin="round">
      {/* center pentagon */}
      <polygon points="60,38 72,46 68,60 52,60 48,46" />
      {/* top */}
      <polygon points="60,10 75,22 70,34 60,38 50,34 45,22" opacity="0.85" />
      {/* top-right */}
      <polygon points="86,30 95,45 85,55 72,46 75,32" opacity="0.85" />
      {/* bottom-right */}
      <polygon points="90,75 80,90 68,88 68,60 82,56" opacity="0.85" />
      {/* bottom */}
      <polygon points="60,100 46,90 48,74 60,68 72,74 74,90" opacity="0.85" />
      {/* bottom-left */}
      <polygon points="30,90 22,75 38,60 52,64 52,82" opacity="0.85" />
      {/* top-left */}
      <polygon points="25,45 34,30 48,32 45,46 32,55" opacity="0.85" />
    </g>
    <circle cx="60" cy="60" r="54" fill="url(#soccer-shine)" />
    <circle cx="60" cy="60" r="54" stroke="#888" strokeWidth="1.5" fill="none" opacity="0.3" />
  </svg>
);

const TennisBall = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="tennis-grad" cx="36%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#D4E84A" />
        <stop offset="55%" stopColor="#B8D400" />
        <stop offset="100%" stopColor="#88A000" />
      </radialGradient>
      <radialGradient id="tennis-shine" cx="34%" cy="26%" r="30%">
        <stop offset="0%" stopColor="#F0FF90" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#F0FF90" stopOpacity="0" />
      </radialGradient>
      <clipPath id="tennis-clip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
    </defs>
    <circle cx="60" cy="60" r="54" fill="url(#tennis-grad)" />
    <g clipPath="url(#tennis-clip)" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round">
      <path d="M20 38 Q50 60 20 82" />
      <path d="M100 38 Q70 60 100 82" />
    </g>
    <circle cx="60" cy="60" r="54" fill="url(#tennis-shine)" />
    <circle cx="60" cy="60" r="54" stroke="#6A8000" strokeWidth="1.5" fill="none" opacity="0.3" />
  </svg>
);

const Volleyball = () => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <defs>
      <radialGradient id="vball-grad" cx="36%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#F8F8F8" />
        <stop offset="55%" stopColor="#E8E8E8" />
        <stop offset="100%" stopColor="#BBBBBB" />
      </radialGradient>
      <radialGradient id="vball-shine" cx="34%" cy="26%" r="30%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <clipPath id="vball-clip">
        <circle cx="60" cy="60" r="54" />
      </clipPath>
    </defs>
    <circle cx="60" cy="60" r="54" fill="url(#vball-grad)" />
    <g clipPath="url(#vball-clip)" stroke="#C0A030" strokeWidth="3.5" fill="none" strokeLinecap="round">
      {/* horizontal band */}
      <path d="M6 60 Q60 52 114 60" />
      {/* left arc */}
      <path d="M30 10 Q16 40 30 70 Q16 90 30 110" />
      {/* right arc */}
      <path d="M90 10 Q104 40 90 70 Q104 90 90 110" />
    </g>
    <g clipPath="url(#vball-clip)" fill="none">
      <path d="M6 60 Q60 52 114 60 Q60 68 6 60Z" fill="#7ACCEB" opacity="0.18" />
      <path d="M30 10 Q16 40 30 70 Q44 40 30 10Z" fill="#FA9959" opacity="0.15" />
      <path d="M90 10 Q104 40 90 70 Q76 40 90 10Z" fill="#8CD9A6" opacity="0.15" />
    </g>
    <circle cx="60" cy="60" r="54" fill="url(#vball-shine)" />
    <circle cx="60" cy="60" r="54" stroke="#999" strokeWidth="1.5" fill="none" opacity="0.25" />
  </svg>
);

const balls = [
  { name: "basketball", Component: Basketball },
  { name: "pickleball", Component: Pickleball },
  { name: "football", Component: Football },
  { name: "soccer ball", Component: SoccerBall },
  { name: "tennis ball", Component: TennisBall },
  { name: "volleyball", Component: Volleyball },
];

export default function SportBallCycler() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % balls.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const { Component, name } = balls[index];

  return (
    <span
      className="relative flex items-center justify-center"
      style={{ width: 100, height: 100, overflow: "hidden" }}
      aria-label={name}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={index}
          custom={direction}
          initial={{ x: direction * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -60, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: "absolute", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Component />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
