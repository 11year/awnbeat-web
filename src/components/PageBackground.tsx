"use client";

import { motion } from "framer-motion";

export default function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Step-and-repeat logo watermark */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/logo.png'), url('/logo.png')",
          backgroundRepeat: "repeat, repeat",
          backgroundSize: "200px 200px, 200px 200px",
          backgroundPosition: "0px 0px, 100px 100px",
          opacity: 0.07,
        }}
      />
      {/* Base vertical gradient: green top → orange middle → blue bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(140,217,166,0.18) 0%, rgba(140,217,166,0.08) 25%, rgba(250,153,89,0.12) 45%, rgba(250,153,89,0.14) 55%, rgba(122,204,235,0.1) 75%, rgba(122,204,235,0.22) 100%)",
        }}
      />

      {/* White center vignette — keeps text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.4) 55%, transparent 100%)",
        }}
      />

      {/* GREEN blobs — top region */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "80vw",
          height: "80vw",
          top: "-30vw",
          left: "-25vw",
          background:
            "radial-gradient(circle, rgba(140,217,166,0.55) 0%, rgba(140,217,166,0.2) 40%, transparent 70%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          right: "-20vw",
          background:
            "radial-gradient(circle, rgba(140,217,166,0.45) 0%, rgba(140,217,166,0.15) 40%, transparent 70%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ORANGE blobs — middle region */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "65vw",
          height: "65vw",
          top: "30%",
          left: "-25vw",
          background:
            "radial-gradient(circle, rgba(250,153,89,0.5) 0%, rgba(250,153,89,0.18) 40%, transparent 70%)",
        }}
        animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          top: "38%",
          right: "-22vw",
          background:
            "radial-gradient(circle, rgba(250,153,89,0.45) 0%, rgba(250,153,89,0.15) 40%, transparent 70%)",
        }}
        animate={{ x: [0, -35, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* BLUE blobs — bottom region */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "75vw",
          height: "75vw",
          bottom: "-25vw",
          left: "-20vw",
          background:
            "radial-gradient(circle, rgba(122,204,235,0.55) 0%, rgba(122,204,235,0.2) 40%, transparent 70%)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          bottom: "-18vw",
          right: "-20vw",
          background:
            "radial-gradient(circle, rgba(122,204,235,0.5) 0%, rgba(122,204,235,0.18) 40%, transparent 70%)",
        }}
        animate={{ x: [0, -25, 0], y: [0, -20, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
