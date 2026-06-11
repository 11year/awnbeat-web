"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SPORTS_ITEMS = [
  { src: "/sports/basketball.png", alt: "Basketball" },
  { src: "/sports/soccer.png",     alt: "Soccer ball" },
  { src: "/sports/tennis.png",     alt: "Tennis ball" },
  { src: "/sports/pickleball.png", alt: "Pickleball" },
  { src: "/sports/football.png",   alt: "Football" },
  { src: "/sports/dumbbell.png",   alt: "Dumbbell" },
  { src: "/sports/yoga-mat.png",   alt: "Yoga mat" },
  { src: "/sports/sneaker.png",    alt: "Sneaker" },
  { src: "/sports/bike.png",       alt: "Road bike" },
];

const SLIDE_MS = 1200;
const PAUSE_MS = 750;
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export default function SportsCarousel() {
  // Which image each slot is showing
  const [slotA, setSlotA] = useState(0);
  const [slotB, setSlotB] = useState(1);
  // Which slot is on-screen
  const [active, setActive] = useState<"a" | "b">("a");

  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const W = window.innerWidth;
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    const activeEl   = active === "a" ? a : b;
    const inactiveEl = active === "a" ? b : a;

    // Normalize: active at center, inactive snapped off-screen right (invisible)
    activeEl.style.transition   = "none";
    activeEl.style.transform    = "translateX(0px)";
    inactiveEl.style.transition = "none";
    inactiveEl.style.transform  = `translateX(${W}px)`;

    // After pause: slide both simultaneously
    const t1 = setTimeout(() => {
      const W2 = window.innerWidth;
      inactiveEl.style.transition = "none";
      inactiveEl.style.transform  = `translateX(${W2}px)`;

      // Use rAF to ensure the no-transition snap is painted before we add transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          activeEl.style.transition   = `transform ${SLIDE_MS}ms ${EASE}`;
          activeEl.style.transform    = `translateX(${-W2}px)`;
          inactiveEl.style.transition = `transform ${SLIDE_MS}ms ${EASE}`;
          inactiveEl.style.transform  = "translateX(0px)";

          // After slide completes: flip active slot and load next image into the now-offscreen slot
          const t2 = setTimeout(() => {
            if (active === "a") {
              // B just slid on-screen, A is off-screen left
              // Load the image after B into A (ready for next cycle)
              setSlotA((slotB + 1) % SPORTS_ITEMS.length);
              setActive("b");
            } else {
              // A just slid on-screen, B is off-screen left
              setSlotB((slotA + 1) % SPORTS_ITEMS.length);
              setActive("a");
            }
          }, SLIDE_MS + 50);

          return () => clearTimeout(t2);
        });
      });
    }, PAUSE_MS);

    return () => clearTimeout(t1);
  }, [active, slotA, slotB]);

  return (
    <div
      className="relative w-full flex items-center justify-center"
      style={{ height: 100, overflow: "hidden" }}
      aria-label="Sports items showcase"
    >
      <div ref={aRef} className="absolute flex items-center justify-center"
        style={{ height: 100, willChange: "transform" }}>
        <Image src={SPORTS_ITEMS[slotA].src} alt={SPORTS_ITEMS[slotA].alt}
          height={100} width={100} unoptimized
          style={{ objectFit: "contain", height: 100, width: "auto" }} />
      </div>
      <div ref={bRef} className="absolute flex items-center justify-center"
        style={{ height: 100, willChange: "transform" }}>
        <Image src={SPORTS_ITEMS[slotB].src} alt={SPORTS_ITEMS[slotB].alt}
          height={100} width={100} unoptimized
          style={{ objectFit: "contain", height: 100, width: "auto" }} />
      </div>
    </div>
  );
}
