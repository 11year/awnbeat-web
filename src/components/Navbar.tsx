"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div
        className="max-w-6xl mx-auto backdrop-blur-md rounded-2xl border border-white/60 shadow-sm px-6 flex items-center justify-between h-16 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(140,217,166,0.25) 0%, rgba(122,204,235,0.2) 50%, rgba(140,217,166,0.15) 100%)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 h-full">
          <Image
            src="/logo.png"
            alt="Awnbeat logo"
            width={64}
            height={64}
            unoptimized
            style={{ height: "100%", width: "auto", objectFit: "contain" }}
          />
          <span className="font-anybody font-black text-xl tracking-tight" style={{ color: "#4caf4f" }}>
            Awnbeat
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer hover:text-brand-text ${
                  pathname === href ? "text-brand-text" : "text-brand-muted"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="hidden md:inline-flex items-center bg-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity duration-200 cursor-pointer"
        >
          Get Early Access
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden cursor-pointer text-brand-text"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden mt-2 max-w-6xl mx-auto backdrop-blur-md rounded-2xl border border-white/60 shadow-sm px-6 py-4 flex flex-col gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(140,217,166,0.3) 0%, rgba(122,204,235,0.25) 100%)",
          }}
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                pathname === href ? "text-brand-text" : "text-brand-muted"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center bg-secondary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity duration-200 cursor-pointer"
          >
            Get Early Access
          </Link>
        </div>
      )}
    </nav>
  );
}
