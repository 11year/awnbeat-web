import Link from "next/link";
import SportsCarousel from "@/components/SportsCarousel";
import HeroIllustration from "@/components/HeroIllustration";
import { MapPin, Users, Zap } from "lucide-react";

const pillars = [
  {
    icon: <MapPin size={22} strokeWidth={1.8} />,
    color: "bg-primary/10 text-primary",
    title: "Discover",
    body: "Explore nearby activities, events, communities, and places built around sports, wellness, and movement.",
  },
  {
    icon: <Users size={22} strokeWidth={1.8} />,
    color: "bg-secondary/10 text-secondary",
    title: "Join",
    body: "Find the groups and experiences that match what you love, from pickup games and run clubs to wellness events and local meetups.",
  },
  {
    icon: <Zap size={22} strokeWidth={1.8} />,
    color: "bg-accent/10 text-accent",
    title: "Show Up",
    body: "Meet real people, build real community, and make staying active something you actually look forward to.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-0 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black text-brand-text leading-tight mb-0">
            Your passions are still out there.
          </h1>
        </div>

        {/* Full-width carousel between the two headline lines */}
        <div className="w-full my-4">
          <SportsCarousel />
        </div>

        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black text-secondary leading-tight mb-6">
            Awnbeat helps you find them again.
          </h1>
          <p className="text-lg md:text-xl text-brand-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Find nearby activities, join local communities, and reconnect with the
            things that make you feel active, social, and alive.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-secondary text-white font-semibold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity duration-200 cursor-pointer text-base"
            >
              Get Early Access
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center bg-white/70 backdrop-blur-sm border border-gray-200 text-brand-text font-semibold px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors duration-200 cursor-pointer text-base"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium leading-relaxed text-brand-text">
            When you were younger, staying active came naturally, not because of
            discipline, but because of{" "}
            <span className="font-black text-primary">people.</span>
          </p>
          <p className="mt-8 text-lg text-brand-muted leading-relaxed">
            You had a team. A court. A crew that showed up every Saturday.
            Somewhere along the way, that changed.
            <br />
            <br />
            <span className="text-brand-text font-semibold">
              Awnbeat is built to change it back.
            </span>
          </p>
        </div>

        {/* Community cards */}
        <div className="mt-16">
          <p className="text-center text-lg font-semibold text-brand-muted mb-6 px-6">
            Find communities sharing your same love
          </p>
          <HeroIllustration />
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center text-brand-text mb-16">
            Everything you need to show up.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map(({ icon, color, title, body }) => (
              <div
                key={title}
                className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/80 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${color} mb-6`}>
                  {icon}
                </div>
                <h3 className="text-xl font-black text-brand-text mb-3">{title}</h3>
                <p className="text-brand-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-brand-text leading-tight mb-6 text-balance">
            You don&apos;t need another fitness app.
          </h2>
          <p className="text-xl text-brand-muted mb-4 leading-relaxed">
            You need a reason to get out the door.
          </p>
          <p className="text-lg text-brand-muted mb-10 leading-relaxed">
            Awnbeat gives you that reason — and the people waiting on the other
            side of it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-brand-text text-white font-semibold px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity duration-200 cursor-pointer text-base"
          >
            Find Your Community
          </Link>
        </div>
      </section>
    </>
  );
}
