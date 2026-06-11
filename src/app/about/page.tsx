import Link from "next/link";

export const metadata = {
  title: "About — Awnbeat",
  description: "We're changing how adults reconnect with the sports and communities that shaped them.",
};

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-6 bg-primary/10 px-4 py-1.5 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-brand-text mb-8 text-balance">
            We&apos;re helping people find their way back to the activities, communities, and connections that make life feel more alive.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-brand-muted leading-relaxed mb-6">
            Think about how easy it used to be to find your people. A pickup game
            at the park. A run with friends after school. A local league, class, or
            activity that turned into something bigger than the activity itself.
          </p>
          <p className="text-lg text-brand-muted leading-relaxed mb-6">
            That connection is still possible. It just needs a better place to begin.
          </p>
          <p className="text-lg text-brand-muted leading-relaxed mb-10">
            Awnbeat helps you discover local sports, wellness activities, events,
            and communities around you, so you can reconnect with what you love and
            the people who make it better.
          </p>
          <p className="text-xl font-bold text-brand-text">
            We believe staying active is easier when it feels social, local, and
            connected. Awnbeat is building the platform that brings real-world
            community back into everyday life.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-12 text-center" style={{ background: "linear-gradient(135deg, #8CD9A620 0%, #7ACCEB20 100%)" }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-4">Our Mission</p>
            <p className="text-2xl md:text-3xl font-black text-brand-text leading-snug">
              Rebuild the social infrastructure around movement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center bg-secondary text-white font-semibold px-10 py-4 rounded-2xl hover:opacity-90 transition-opacity duration-200 cursor-pointer text-base"
        >
          Join the Movement
        </Link>
      </section>
    </>
  );
}
