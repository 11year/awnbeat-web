import Link from "next/link";

export const metadata = {
  title: "How It Works — Awnbeat",
  description: "Getting back into it has never been easier.",
};

const steps = [
  {
    number: "01",
    color: "text-primary",
    bg: "bg-primary/10",
    title: "Tell us what moves you",
    body: "Choose the activities, sports, wellness interests, and communities you care about. Awnbeat learns what you're into so it can help you find the right things around you.",
  },
  {
    number: "02",
    color: "text-secondary",
    bg: "bg-secondary/10",
    title: "Discover what's happening nearby",
    body: "Explore local events, pickup games, wellness activities, communities, and places to play, all in one place and built around your interests.",
  },
  {
    number: "03",
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Join in and feel connected",
    body: "Show up for an activity, meet people who share what you love, and make staying active feel natural, social, and fun again.",
  },
];

export default function HowItWorks() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-6 bg-accent/10 px-4 py-1.5 rounded-full">
            Simple by Design
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-brand-text mb-6">
            Find something to do. Find people to do it with.
          </h1>
          <p className="text-lg text-brand-muted leading-relaxed">
            From pickup games and run clubs to wellness events and local communities, Awnbeat helps you discover where you belong.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {steps.map(({ number, color, bg, title, body }) => (
            <div
              key={number}
              className="flex items-start gap-6 bg-bg rounded-3xl p-8 border border-gray-100"
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${bg} flex items-center justify-center`}>
                <span className={`text-xl font-black ${color}`}>{number}</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-text mb-2">{title}</h3>
                <p className="text-brand-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-3xl md:text-4xl font-black text-brand-text mb-8 leading-snug">
            It&apos;s not about getting fit.
            <br />
            It&apos;s about belonging somewhere again.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-secondary text-white font-semibold px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity duration-200 cursor-pointer text-base"
          >
            Find Your Community
          </Link>
        </div>
      </section>
    </>
  );
}
