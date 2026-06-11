"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again or email us directly.");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-6 bg-primary/10 px-4 py-1.5 rounded-full">
            Say Hello
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-brand-text mb-6">
            Let&apos;s talk.
          </h1>
          <p className="text-lg text-brand-muted leading-relaxed">
            Whether you&apos;re a user, a community organizer, or a wellness brand —
            we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-6 pb-28">
        <div className="max-w-lg mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          {submitted ? (
            <div className="text-center py-8">
              <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                <Mail size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-black text-brand-text mb-2">Message received.</h2>
              <p className="text-brand-muted">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-brand-text">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-brand-text">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-sm font-semibold text-brand-text">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="What's on your mind?"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-brand-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-opacity duration-200 cursor-pointer text-base mt-2 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-brand-muted">
              For partnerships and press:{" "}
              <a
                href="mailto:info@awnbeat.com"
                className="text-brand-text font-semibold hover:text-secondary transition-colors duration-200 cursor-pointer"
              >
                info@awnbeat.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
