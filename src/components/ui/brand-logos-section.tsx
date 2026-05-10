"use client";

import { motion } from "framer-motion";
import { LogoCloud } from "./logo-cloud-4";

const brandLogos = [
  {
    src: "https://svgl.app/library/nvidia-wordmark-light.svg",
    alt: "Nvidia Logo",
  },
  {
    src: "https://svgl.app/library/supabase_wordmark_light.svg",
    alt: "Supabase Logo",
  },
  {
    src: "https://svgl.app/library/openai_wordmark_light.svg",
    alt: "OpenAI Logo",
  },
  {
    src: "https://svgl.app/library/turso-wordmark-light.svg",
    alt: "Turso Logo",
  },
  {
    src: "https://svgl.app/library/vercel_wordmark.svg",
    alt: "Vercel Logo",
  },
  {
    src: "https://svgl.app/library/github_wordmark_light.svg",
    alt: "GitHub Logo",
  },
  {
    src: "https://svgl.app/library/clerk-wordmark-light.svg",
    alt: "Clerk Logo",
  },
];

export const BrandLogosSection = () => {
  return (
    <section className="relative w-full">

      {/* Top fade - blending with Work section */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black to-transparent z-10" />

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[100px] w-[600px] rounded-full bg-amber-500/5 blur-[100px] z-0" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <LogoCloud logos={brandLogos} />
      </motion.div>

      {/* Bottom fade - blending with Testimonials section */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
};
