import Link from "next/link";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const socials = [
  { href: "https://instagram.com/awnbeat.app",      label: "Instagram", icon: <InstagramIcon /> },
  { href: "https://tiktok.com/awnbeat",             label: "TikTok",    icon: <TikTokIcon /> },
  { href: "https://x.com/Awnbeat",                  label: "X",         icon: <XIcon /> },
  { href: "https://linkedin.com/company/awnbeat",   label: "LinkedIn",  icon: <LinkedInIcon /> },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-white/40 py-12 px-6 backdrop-blur-sm"
      style={{
        background: "linear-gradient(135deg, rgba(122,204,235,0.2) 0%, rgba(250,153,89,0.12) 50%, rgba(122,204,235,0.18) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-anybody font-black text-xl tracking-tight text-brand-text">
          Awnbeat
        </span>

        <ul className="flex flex-wrap justify-center gap-6">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/how-it-works", label: "How It Works" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {socials.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-brand-muted hover:text-brand-text transition-colors duration-200"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-brand-muted mt-8">
        © {new Date().getFullYear()} Awnbeat. All rights reserved.
      </p>
    </footer>
  );
}
