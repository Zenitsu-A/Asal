"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"

/* ═══════════════════════════════════════════════════════════════
   FILM GRAIN — subtle SVG noise overlay
   ═══════════════════════════════════════════════════════════════ */
function FilmGrain() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-[0.035] mix-blend-screen"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  )
}

/* ═══════════════════════════════════════════════════════════════
   LIVE CLOCK COMPONENT (EEST)
   ═══════════════════════════════════════════════════════════════ */
function LiveClock() {
  const [time, setTime] = useState<string>("...")

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      // Formats to Egypt Time (EEST)
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Cairo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      setTime(`${formatter.format(now)} EEST`)
    }
    
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="tabular-nums inline-block min-w-[70px]">
      {time}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON (HERO-MATCHED CTA)
   ═══════════════════════════════════════════════════════════════ */
function MassiveMagneticButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!btnRef.current) return
      const r = btnRef.current.getBoundingClientRect()
      mx.set((e.clientX - (r.left + r.width / 2)) * 0.3)
      my.set((e.clientY - (r.top + r.height / 2)) * 0.3)
    },
    [mx, my]
  )

  const handleLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: mx, y: my }}
      // Match Hero Button: bg-gradient-to-r from-amber-500 to-violet-600
      className="group relative flex cursor-pointer select-none items-center justify-center gap-4 overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-violet-600 px-12 py-5 font-mono text-sm sm:text-base font-bold uppercase tracking-[0.4em] text-white transition-all hover:from-amber-400 hover:to-violet-500 shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] active:scale-[0.98]"
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10 flex items-center gap-3 drop-shadow-md">
        {children}
        <motion.svg
          className="h-5 w-5 -translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </motion.svg>
      </span>

      {/* Sweeping Light Effect */}
      <motion.span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
          delay: 1,
          repeatDelay: 2,
        }}
      />
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   INFINITE MARQUEE
   ═══════════════════════════════════════════════════════════════ */
function InfiniteMarquee() {
  const text = "HIGH RETENTION · BROADCAST QUALITY · AI CINEMATOGRAPHY · VISUAL EFFECTS · "
  
  return (
    <div className="relative flex w-full overflow-hidden border-y border-white/5 bg-black/20 py-4 sm:py-6 backdrop-blur-sm">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span className="font-display text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)", color: "transparent" }}>
          {text}{text}{text}{text}
        </span>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN FOOTER EXPORT
   ═══════════════════════════════════════════════════════════════ */
export default function Footer() {
  return (
    // FIX: Removed bg-zinc-950 and border-t to make the blend seamless
    <footer className="relative w-full bg-transparent overflow-hidden pt-32 pb-8">
      <FilmGrain />

      {/* Hero-Matched Dual Glowing Orbs */}
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 translate-y-1/2 pointer-events-none z-0 size-[800px] rounded-full bg-amber-500/10 blur-[200px]" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 pointer-events-none z-0 size-[800px] rounded-full bg-violet-600/10 blur-[200px]" aria-hidden="true" />

      {/* ── TOP SECTION: THE HOOK ── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500 flex items-center gap-2">
            <span className="animate-pulse size-1.5 bg-violet-500 rounded-full inline-block shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            Signal Established
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </motion.div>

        <motion.h2 
          className="text-4xl sm:text-6xl md:text-7xl font-black font-display uppercase tracking-tight text-white text-center leading-[0.9] mb-12 drop-shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Start a project <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-violet-500 bg-clip-text text-transparent">With Asal.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <MassiveMagneticButton onClick={() => window.location.href = "mailto:asalofficialacc@gmail.com"}>
            START A PROJECT
          </MassiveMagneticButton>
        </motion.div>
      </div>

      {/* ── MIDDLE SECTION: INFINITE MARQUEE ── */}
      <div className="relative z-10 mb-20">
        <InfiniteMarquee />
      </div>

      {/* ── BOTTOM SECTION: TERMINAL GRID ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          
          {/* Left: Location & Time */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-[9px] font-mono text-zinc-500 tracking-[0.3em] uppercase">
              Current Coordinates
            </span>
            <span className="text-[11px] font-mono text-zinc-300 tracking-[0.2em] uppercase flex items-center gap-2">
              GIZA, EGYPT <span className="text-zinc-600">|</span> <LiveClock />
            </span>
          </div>

          {/* Center: Social Targets */}
          <div className="flex justify-center gap-4 sm:gap-6">
            {[
              { name: "UPWORK", url: "https://www.upwork.com/freelancers/~01d668f68f17f2e444" },
              { name: "BEHANCE", url: "https://www.behance.net/ahmedsalah760" },
              { name: "LINKEDIN", url: "#" },
              { name: "INSTAGRAM", url: "https://www.instagram.com/dds.ahmedsalah" }
            ].map((link) => (
              <a 
                key={link.name} 
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 transition-colors hover:text-violet-400"
              >
                <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 mr-1 text-violet-500/50">[</span>
                {link.name}
                <span className="opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 ml-1 text-violet-500/50">]</span>
              </a>
            ))}
          </div>

          {/* Right: Status & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-[9px] font-mono text-emerald-500/80 tracking-[0.3em] uppercase flex items-center gap-1.5">
              <span className="size-1 bg-emerald-500 rounded-full animate-pulse" />
              STATUS: 100% ONLINE
            </span>
            <span className="text-[10px] font-mono text-zinc-600 tracking-[0.2em] uppercase">
              &copy; 2026 AHMED SALAH
            </span>
          </div>

        </div>
      </div>
      
    </footer>
  )
}