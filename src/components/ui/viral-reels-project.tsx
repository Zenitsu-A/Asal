"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Separator } from "./separator";

const VIRAL_VIDEOS = [
  "https://youtube.com/shorts/ne59ieWH4Ak",
  "https://youtube.com/shorts/RplsSWvl7kU",
  "https://youtube.com/shorts/xDfd76dEC3A",
  "https://www.instagram.com/reel/DUpbf9ACKEi/",
  "https://www.instagram.com/reel/CwF-XETNVPi/",
  "https://youtube.com/shorts/xQE9FM96pWc",
  "https://youtube.com/shorts/nwDG_xgpiYw",
  "https://youtube.com/shorts/Ip7uyl446B4",
  "https://www.instagram.com/reel/DGwAlakvjm2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DHBvx2ZPEI7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DHUOJUHPQ8p/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
];

// Upgraded to handle both YouTube Shorts and Instagram Reels
function getVideoEmbedUrl(url: string): string {
  if (url.includes("youtube.com/shorts/")) {
    const match = url.match(/shorts\/([^?]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (url.includes("instagram.com/reel/")) {
    const match = url.match(/instagram\.com\/reel\/([^/?]+)/);
    if (match) return `https://www.instagram.com/reel/${match[1]}/embed/`;
  }
  return url;
}

// Helper to determine the platform for the caption
function getVideoPlatform(url: string): string {
  if (url.includes("instagram")) return "Instagram";
  if (url.includes("youtube")) return "YouTube";
  return "Reel";
}

export const ViralReelsProject = () => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  // --- Cinematic Counter Animation Setup ---
  const statRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statRef, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const [isFinished, setIsFinished] = useState(false);

  // Animate from 0 to 1,000,000
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, 1000000, {
        duration: 3, // 3 seconds of rapid counting
        ease: [0.22, 1, 0.36, 1], // Cinematic ease-out (fast start, heavy deceleration)
        onComplete: () => setIsFinished(true),
      });
      return controls.stop;
    }
  }, [isInView, count]);

  // Format the number dynamically: Show full commas while counting, then strip to just "1" when finished
  const displayNumber = useTransform(count, (latest) => {
    const val = Math.round(latest);
    if (val >= 1000000) return "1";
    return val.toLocaleString();
  });

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Section header */}
        <div className="mb-12 text-center relative z-10">
          
          {/* 1. Cinematic Diffused Title Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[150px] w-[500px] rounded-full bg-amber-500/15 blur-[100px] z-[-1]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-block"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-500/70">
              Case Study
            </span>
            <div className="mt-1.5 h-px w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl font-black uppercase leading-[0.85] tracking-tighter text-white lg:text-7xl"
          >
            Viral
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Reels
            </span>
          </motion.h2>

          {/* 2. Stronger Description Glow */}
          <div className="relative mx-auto mt-4 max-w-lg">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[100px] w-[350px] rounded-full bg-amber-500/30 blur-[90px] z-[-1]" />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm leading-relaxed tracking-wide text-zinc-400 relative z-10"
            >
              High-energy viral content designed to stop the scroll, driving <span className="text-amber-400 font-semibold">over 1 million organic views</span> and massive audience engagement.
            </motion.p>
          </div>
        </div>

        {/* Two Column Layout — FLIPED: Text left (5), Gallery right (7) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column - Text Content (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            {/* 3. Cinematic Diffused Text Content Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[350px] rounded-full bg-amber-500/10 blur-[140px] z-[-1]" />

            <div className="space-y-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 backdrop-blur-sm md:p-8">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400/80 ring-1 ring-amber-500/20">
                  Viral Content
                </span>
                <Separator className="flex-1 bg-zinc-800" />
                <span className="text-[10px] text-zinc-600">2024</span>
              </div>

              {/* CLIENT REVIEW - SHOWN BY DEFAULT */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                {/* Glow backdrop */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 blur-xl" />

                {/* Review header */}
                <div className="relative mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 ring-1 ring-amber-500/20">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
                    Client Review
                  </span>
                </div>

                {/* Large quotation mark */}
                <div className="relative">
                  <svg
                    className="absolute -left-1 -top-1 h-12 w-12 text-amber-500/10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <blockquote className="relative z-10 pl-5">
                    <p className="text-base leading-relaxed font-medium italic text-zinc-100 lg:text-lg">
                      &ldquo;These reels didn't just perform well —
                      they went <span className="text-amber-400">viral overnight</span>.
                      The raw energy and pacing kept viewers hooked until the very end.&rdquo;
                    </p>

                    {/* Reviewer info */}
                    <footer className="mt-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 text-sm font-bold text-amber-400 ring-1 ring-amber-500/20">
                        VR
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Viral Reels Team
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Content Strategy
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-zinc-500">Verified</span>
                      </div>
                    </footer>
                  </blockquote>
                </div>

                {/* ANIMATED HIGHLIGHTED STATS */}
                <div className="mt-6 flex items-center justify-between border-t border-zinc-800/60 pt-6">
                  <div className="text-center flex-1 border-r border-zinc-800/60">
                    <p className="text-xl font-bold text-amber-400/80">{VIRAL_VIDEOS.length}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Videos</p>
                  </div>
                  
                  {/* Heavily Emphasized & Animated Views Stat */}
                  <div ref={statRef} className="text-center flex-[1.5] relative">
                    {/* The explosive background pulse that detonates when the count finishes */}
                    <motion.div 
                      animate={{
                        scale: isFinished ? [1, 1.4, 1] : 1,
                        opacity: isFinished ? [0, 0.7, 0.2] : 0.2,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0 bg-amber-500 blur-xl rounded-full z-[-1]" 
                    />
                    
                    {/* The Number Container */}
                    <motion.div 
                      animate={isFinished ? { scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] } : {}}
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-center tracking-tight h-10"
                    >
                      {/* The actively counting number */}
                      <motion.span className="text-3xl font-black text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.6)] tabular-nums">
                        {displayNumber}
                      </motion.span>

                      {/* The 'M' and '+' fly in as the zeroes disappear */}
                      <AnimatePresence>
                        {isFinished && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5, x: -20, filter: "blur(8px)" }}
                            animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="flex items-center"
                          >
                            <span className="text-3xl font-black text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.6)]">
                              M
                            </span>
                            <motion.span
                              initial={{ opacity: 0, scale: 0, rotate: -90 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                              className="text-3xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(252,211,77,0.9)] ml-0.5"
                            >
                              +
                            </motion.span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <p className="text-[11px] font-bold text-amber-500/90 uppercase tracking-widest mt-1">Total Views</p>
                  </div>
                  
                  <div className="text-center flex-1 border-l border-zinc-800/60">
                    <p className="text-xl font-bold text-amber-400/80">100%</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Viral Rate</p>
                  </div>
                </div>
              </motion.div>

              {/* What Was Delivered — hidden behind Read More */}
              {showFullDesc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Separator className="bg-zinc-800" />

                  <div className="pt-8">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent" />
                      <h3 className="font-display text-xl font-black uppercase leading-tight tracking-tight text-white lg:text-2xl">
                        What
                        <br />
                        <span className="text-amber-400/90">Was Delivered</span>
                      </h3>
                      <div className="h-px flex-1 bg-gradient-to-l from-amber-500/40 to-transparent" />
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          text: "High-retention YouTube Shorts with hook-driven editing.",
                        },
                        {
                          text: "Trend-aware cuts optimized for algorithmic reach.",
                        },
                        {
                          text: "Motion graphics and sound design that amplifies virality.",
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="group flex items-start gap-3"
                        >
                          <div className="relative shrink-0">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800 transition-all duration-300 group-hover:ring-amber-500/40">
                              <span className="text-[10px] font-bold text-amber-500/80">
                                {i + 1}
                              </span>
                            </div>
                            {i < 2 && (
                              <div className="absolute left-1/2 top-7 h-4 w-px -translate-x-1/2 bg-zinc-800" />
                            )}
                          </div>
                          <p className="pt-1 text-sm leading-relaxed text-zinc-300">
                            {item.text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="group flex items-center gap-2 text-sm font-medium text-amber-400/80 transition-colors hover:text-amber-300"
              >
                {showFullDesc ? "Show Less ↑" : "Read More →"}
              </button>
            </div>
          </motion.div>

          {/* Right Column - Video Gallery (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 relative"
          >
            <div className="sticky top-24 relative z-0">

              {/* 4. Cinematic Diffused Gallery Glows */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-[120px] z-[-1]" />
              <div className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 h-[250px] w-[250px] rounded-full bg-amber-500/20 blur-[100px] z-[-1]" />

              {/* Label */}
              <div className="mb-4 flex items-center gap-2 relative z-10">
                <div className="h-0.5 w-6 rounded-full bg-amber-500/60" />
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Video Gallery
                </span>
              </div>

              {/* Video scroll area */}
              <div className="group relative z-10">
                {/* Film strip top */}
                <div className="mb-1.5 flex h-2.5 items-center gap-1 px-1">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-2.5 shrink-0 rounded-[2px] bg-zinc-800"
                      style={{ opacity: 0.3 + (i % 3) * 0.2 }}
                    />
                  ))}
                </div>

                <ScrollArea className="w-full rounded-none border-0 bg-transparent">
                  <div className="flex gap-4 px-1 pb-4">
                    {VIRAL_VIDEOS.map((url, i) => (
                      <motion.figure
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group/video relative shrink-0"
                      >
                        {/* Number badge */}
                        <div className="absolute -left-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-amber-400 ring-2 ring-amber-500/20">
                          {String(i + 1).padStart(2, "0")}
                        </div>

                        {/* Force 9:16 aspect ratio exactly matching the other case studies */}
                        <div className="overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800 transition-all duration-500 group-hover/video:ring-amber-500/30">
                          <div className="h-[460px] w-[260px] shrink-0 overflow-hidden bg-black">
                            <iframe
                              src={getVideoEmbedUrl(url)}
                              title={`Viral Reel ${i + 1}`}
                              className="h-full w-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <figcaption className="mt-2.5 flex items-center gap-2 text-[11px] text-zinc-600">
                          <span className="h-px w-3 bg-zinc-800" />
                          {getVideoPlatform(url)} #{i + 1}
                        </figcaption>
                      </motion.figure>
                    ))}
                  </div>
                  <ScrollBar
                    orientation="horizontal"
                    className="h-1 rounded-full bg-zinc-900"
                  />
                </ScrollArea>

                {/* Film strip bottom */}
                <div className="mt-1.5 flex h-2.5 items-center gap-1 px-1">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-2.5 shrink-0 rounded-[2px] bg-zinc-800"
                      style={{ opacity: 0.3 + (i % 3) * 0.2 }}
                    />
                  ))}
                </div>

                {/* Scroll hint */}
                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-zinc-600">
                  <svg className="h-3 w-3 animate-pulse text-amber-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Scroll to explore
                  <svg className="h-3 w-3 animate-pulse text-amber-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};