"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useInView,
} from "framer-motion"

/* ── Verified Professional Data ── */
const CARD_KEYS = ["core", "arsenal", "operations"] as const

const cardData = {
  core: {
    title: "CORE DIRECTIVES",
    subtitle: "Motion & Editing Mastery",
    description:
      "100% Upwork Job Success Rate. Delivering broadcast-quality video content, Vox-style motion graphics, and seamless VFX with meticulous attention to detail and fast turnarounds.",
    image: "/public/card1.png",
  },
  arsenal: {
    title: "TACTICAL ARSENAL",
    subtitle: "Tech Stack & Tools",
    description:
      "Advanced mastery of Adobe After Effects, Premiere Pro, and DaVinci Resolve. Specialized in high-retention YouTube editing, 2D/3D animation, and integrated sound design.",
    image: "/public/card2.png",
  },
  operations: {
    title: "ACTIVE OPERATIONS",
    subtitle: "Current Deployments",
    description:
      "Producing high-impact supercar content, long-form documentaries, and broadcast-quality motion graphics. Building long-term retention partnerships with high-tier creators and agencies.",
    image: "/public/card3.png",
  },
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT PARTICLES — floating geometric debris
   ═══════════════════════════════════════════════════════════════ */

function AmbientParticles() {
  const particles = useMemo(() => {
    const items = []
    for (let i = 0; i < 14; i++) {
      items.push({
        id: i,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 18 + 12,
        delay: Math.random() * 12,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color:
          Math.random() > 0.6
            ? "rgba(251,191,36,0.06)"
            : Math.random() > 0.5
            ? "rgba(255,255,255,0.03)"
            : "rgba(251,191,36,0.02)",
      })
    }
    return items
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.color,
          }}
          animate={{
            y: [0, -60 - Math.random() * 40, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Slowly rotating geometric shapes */}
      <motion.div
        className="absolute top-16 right-24 size-3 rounded-full border border-amber-500/10"
        animate={{ 
          rotate: 360, 
          opacity: [0.15, 0.45, 0.15] 
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      <motion.div
        className="absolute bottom-32 left-20 size-2 rounded-full border border-amber-500/10"
        animate={{ 
          rotate: -360, 
          opacity: [0.1, 0.35, 0.1] 
        }}
        transition={{ 
          duration: 32, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      <motion.div
        className="absolute top-40 left-40 size-1.5 rounded-full border border-zinc-700/20"
        animate={{ 
          rotate: 360, 
          opacity: [0.08, 0.25, 0.08] 
        }}
        transition={{ 
          duration: 24, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      <motion.div
        className="absolute bottom-20 right-40 size-[3px] rounded-full border border-zinc-700/15"
        animate={{ 
          rotate: -360, 
          opacity: [0.06, 0.2, 0.06] 
        }}
        transition={{ 
          duration: 28, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LIGHT SWEEP — diagonal highlight that periodically crosses
   ═══════════════════════════════════════════════════════════════ */

function LightSweep() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-5"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0, 0.06, 0.06, 0, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 4,
        times: [0, 0.3, 0.4, 0.6, 0.7, 1],
      }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent transform -translate-x-full"
        animate={{ 
          x: ["-10%", "110%"] 
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 7,
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent transform -translate-x-full"
        style={{ top: "30%" }}
        animate={{ 
          x: ["-10%", "110%"] 
        }}
        transition={{
          duration: 3.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 7,
          delay: 1.5,
        }}
      />
    </motion.div>
  )
}

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
   CROSSHAIR CORNERS
   ═══════════════════════════════════════════════════════════════ */

function CrosshairCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos: Record<string, string> = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    br: "bottom-0 right-0",
    bl: "bottom-0 left-0",
  }
  return (
    <div className={`absolute ${pos[position]}`}>
      <svg className="size-4 text-zinc-700/50" viewBox="0 0 20 20" fill="none" stroke="currentColor">
        <path d="M6 0V10M0 6H10" strokeWidth={0.6} opacity={0.5} />
        <path d="M14 0V10M20 6H10" strokeWidth={0.6} opacity={0.3} />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RECORDING INDICATOR
   ═══════════════════════════════════════════════════════════════ */

function RecordingIndicator() {
  return (
    <span className="relative flex size-2">
      <span className="animate-ping absolute inline-flex size-full rounded-full bg-emerald-500/40" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   VERTICAL STAT ROW (For narrow 15% column)
   ═══════════════════════════════════════════════════════════════ */

function VerticalStatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    // FIX: Added items-center and text-center to properly center the stats
    <div className="flex flex-col items-center text-center py-2 border-b border-zinc-800/40 last:border-0 gap-1.5">
      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </span>
      <span className="text-[11px] font-mono font-semibold text-amber-400/90">
        {value}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COLUMN 1: FULL PROFILE PICTURE (30%)
   ═══════════════════════════════════════════════════════════════ */

function ProfileColumn() {
  const [profileHovered, setProfileHovered] = useState(false)

  return (
    <motion.div
      className="relative h-[450px] sm:h-[550px] w-full rounded-2xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setProfileHovered(true)}
      onHoverEnd={() => setProfileHovered(false)}
    >
      <CrosshairCorner position="tl" />
      <CrosshairCorner position="tr" />
      <CrosshairCorner position="bl" />
      <CrosshairCorner position="br" />

      {/* The Full Image */}
      <motion.img
        src="/profile.png"
        alt="Ahmed Salah"
        className="absolute inset-0 w-full h-full object-cover object-top grayscale opacity-70 transition-all duration-700"
        animate={{ 
          scale: profileHovered ? 1.05 : 1,
          filter: profileHovered ? "grayscale(0%)" : "grayscale(100%)",
          opacity: profileHovered ? 1 : 0.7 
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 border-[4px] border-amber-500/10 m-3 rounded-xl pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_4px)]" />

      {/* ID Badge Label */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="bg-black/60 backdrop-blur-md border border-zinc-800/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-500 font-mono tracking-[0.3em] uppercase block mb-1">
              ID: ASAL-01
            </span>
            <h3 className="text-white font-display text-xl font-black uppercase tracking-tight">
              Operative <span className="text-amber-400">Identified</span>
            </h3>
          </div>
          <RecordingIndicator />
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COLUMN 2: ACTIVE SYSTEM & STATS (15%)
   ═══════════════════════════════════════════════════════════════ */

function ActiveSystemColumn() {
  const [bootComplete, setBootComplete] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBootComplete(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      className="relative h-[450px] sm:h-[550px] w-full rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_4px)]" />
      
      {/* Status bar */}
      <div className="flex flex-col items-center justify-center px-4 py-4 border-b border-zinc-800/40 bg-zinc-900/50 gap-2">
        <div className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${bootComplete ? "bg-amber-500/80 animate-pulse" : "bg-zinc-700"}`} />
        <span
          className={`text-[8px] font-mono uppercase tracking-[0.4em] transition-all duration-500 text-center ${
            bootComplete ? "text-emerald-500" : "text-zinc-600"
          }`}
        >
          {bootComplete ? "SYS_ACTIVE" : "INIT..."}
        </span>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-amber-500/30 to-transparent w-full" />

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col relative z-10">
        
        {/* FIX: Centered the Name text block */}
        <motion.div
          className="mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: bootComplete ? 1 : 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="font-display text-lg font-black uppercase tracking-tight text-white leading-tight">
            Ahmed
            <br/>
            <span className="text-amber-400">Salah</span>
          </h3>
        </motion.div>

        <div className="h-px w-full bg-zinc-800/60 mb-4" />

        {/* Vertical Stats */}
        <div className="space-y-1 flex-1">
          <VerticalStatRow label="Delivered" value="300+ Projects" />
          <VerticalStatRow label="Upwork" value={<span className="text-emerald-500">100% Success</span>} />
          <VerticalStatRow label="Core Stack" value="AE · PR · DR" />
          <VerticalStatRow label="Specialty" value="Broadcast VFX" />
          <VerticalStatRow
            label="Tier Status"
            value={
              <span className="inline-block bg-amber-500/10 text-amber-400 px-2 py-0.5 mt-1 rounded text-[9px] font-bold uppercase tracking-[0.2em] ring-1 ring-amber-500/20">
                ★ Premium
              </span>
            }
          />
        </div>

        {/* Blinking cursor */}
        {/* FIX: Centered the cursor container */}
        <div className="mt-auto pt-4 flex justify-center">
          <span className="text-[9px] font-mono text-zinc-600 tracking-[0.3em] uppercase">
            LOADED
            <motion.span
              className="inline-block w-[2px] h-3 bg-amber-500/80 ml-1 align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 0,
              }}
            />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COLUMN 3: 3D CARD STACK (55% - EXPANDED WIDTH)
   ═══════════════════════════════════════════════════════════════ */

function DossierCardStack({
  activeIndex,
  onTransitionComplete,
}: {
  activeIndex: number
  onTransitionComplete: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateY = useTransform(mouseX, [-340, 340], [-14, 14])
  const rotateX = useTransform(mouseY, [-340, 340], [14, -14])
  const hlX = useTransform(mouseX, [-340, 340], [-45, 95])
  const hlY = useTransform(mouseY, [-340, 340], [95, -45])

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const r = cardRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - r.left - r.width / 2)
      mouseY.set(e.clientY - r.top - r.height / 2)
    },
    [mouseX, mouseY],
  )

  const handleLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const card = cardData[CARD_KEYS[activeIndex % 3]]

  return (
    <div
      ref={cardRef}
      className="relative perspective-[1400px] select-none flex justify-center w-full h-[450px] sm:h-[550px]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Ghost stack layers - EXPANDED MAX-WIDTH */}
      <div
        className="absolute inset-0 rounded-2xl bg-zinc-900/35 border border-zinc-800/25 ring-1 ring-white/[0.025]"
        style={{
          transform: "translateY(26px) translateZ(-36px) scale(0.97)",
          filter: "blur(3px)",
          opacity: 0.45,
          width: "100%",
          maxWidth: "640px",
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl bg-zinc-900/20 border border-zinc-800/15 ring-1 ring-white/[0.015]"
        style={{
          transform: "translateY(52px) translateZ(-72px) scale(0.94)",
          filter: "blur(8px)",
          opacity: 0.2,
          width: "100%",
          maxWidth: "640px",
        }}
      />

      {/* Hero card - EXPANDED MAX-WIDTH */}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={onTransitionComplete}
      >
        <motion.div
          key={`dossier-${card.title}`}
          className="absolute top-0 flex flex-col w-full max-w-[640px] h-full overflow-hidden rounded-2xl border border-zinc-800/60 ring-1 ring-white/5 bg-zinc-900/95 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)]"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{
            opacity: 0,
            x: 90,
            rotateY: -22,
            scale: 0.93,
          }}
          animate={{
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            transition: {
              type: "spring",
              bounce: 0.28,
              damping: 13,
              mass: 0.8,
              stiffness: 240,
            },
          }}
          exit={{
            opacity: 0,
            x: -110,
            rotateY: 28,
            scale: 0.88,
            filter: "brightness(0.5)",
            transition: { 
              duration: 0.32, 
              ease: "easeIn" 
            },
          }}
        >
          {/* Animated ambient glow ring */}
          <motion.div
            className="absolute -inset-[2px] rounded-[calc(0.5rem+2px)] opacity-0"
            animate={{ 
              opacity: [0.25, 0.55, 0.25] 
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(251,191,36,0.14) 30%, transparent 50%, rgba(251,191,36,0.08) 70%, transparent 100%)",
              zIndex: -1,
            }}
          />

          {/* Image zone */}
          <div className="relative h-[100%] shrink-0 overflow-hidden bg-black">
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0% 0)" }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.12,
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center select-none opacity-80"
                draggable={false}
              />
            </motion.div>

            {/* Specular highlight tracking mouse */}
            <motion.div
              className="absolute inset-0 opacity-0 mix-blend-screen pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${hlX.get()}% ${hlY.get()}%, rgba(251,191,36,0.25), transparent 50%)`,
              }}
              aria-hidden="true"
            />

            {/* Bottom gradient fade - Made significantly darker and taller so text POPS */}
            <div
              className="absolute inset-x-0 bottom-0 h-[85%] pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.85) 45%, transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* Shimmer border sweep */}
            <motion.div
              className="absolute inset-0 rounded-t-2xl pointer-events-none opacity-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 5%, rgba(251,191,36,0.2) 50%, transparent 95%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
                delay: 1.5,
                repeatDelay: 1,
              }}
            />
            
            {/* ── HIGH POP TEXT CONTENT OVERLAID ON IMAGE ── */}
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10 flex flex-col justify-end">
              <motion.span
                className="text-[12px] font-black uppercase tracking-[0.4em] text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] block mb-2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                {card.title}
              </motion.span>
              <motion.h4
                className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-xl block mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                {card.subtitle}
              </motion.h4>
              <motion.p
                className="text-sm sm:text-base text-zinc-200 font-medium leading-relaxed drop-shadow-md block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
              >
                {card.description}
              </motion.p>
            </div>
          </div>

          {/* Corner indicators */}
          <div className="absolute top-4 left-4 flex gap-1.5 z-20">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="size-1.5 rounded-full bg-zinc-900 ring-1 ring-zinc-700/60"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
          <div className="absolute top-4 right-4 z-20">
            <span className="text-[9px] font-mono text-white tabular-nums bg-black/50 px-2.5 py-1 rounded backdrop-blur-md ring-1 ring-white/10">
              0{activeIndex + 1}|03
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON — light-following glow + shimmer
   ═══════════════════════════════════════════════════════════════ */

function MagneticButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!btnRef.current) return
      const r = btnRef.current.getBoundingClientRect()
      mx.set((e.clientX - (r.left + r.width / 2)) * 0.55)
      my.set((e.clientY - (r.top + r.height / 2)) * 0.55)
    },
    [mx, my],
  )

  const handleLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: mx, y: my }}
      className={`group relative flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-lg border bg-zinc-900 px-7 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 transition-all hover:bg-amber-500/10 active:scale-[0.97] disabled:opacity-40 disabled:cursor-wait ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        {children}
        <motion.svg
          className="h-3.5 w-3.5 -translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </span>

      {/* Shimmer sweep */}
      <motion.span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5,
          repeatDelay: 1,
        }}
      />

      {/* Glow border pulse */}
      <motion.div
        className="absolute -inset-[1px] rounded-lg opacity-0 blur-[1px]"
        animate={{ opacity: disabled ? 0 : [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(251,191,36,0.18), transparent)",
          zIndex: -1,
        }}
      />
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS DOTS
   ═══════════════════════════════════════════════════════════════ */

function ProgressBar({
  active,
  total,
  onSelect,
}: {
  active: number
  total: number
  onSelect?: (i: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === active
              ? "w-6 bg-gradient-to-r from-amber-500 to-amber-400"
              : "w-1.5 bg-zinc-700 hover:bg-zinc-600"
          }`}
          onClick={() => onSelect?.(i)}
          aria-label={`Show dossier ${i + 1}`}
        />
      ))}
      <span className="text-[8px] font-mono text-zinc-600 tracking-[0.3em] ml-2">
        0{active + 1} / 0{total}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FILM STRIP — running dot belt + sprockets + frame counter
   ═══════════════════════════════════════════════════════════════ */

function FilmStrip() {
  return (
    <div className="relative mt-24">
      {/* Sprocket row */}
      <div className="flex items-center justify-center gap-5 pb-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="size-1.5 rounded-full bg-zinc-800/50" />
        ))}
      </div>

      {/* Running belt */}
      <div className="relative h-3 overflow-hidden rounded-full bg-zinc-900/50">
        <div className="absolute inset-y-0 left-0 flex gap-4 animate-film-run">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`size-2 rounded-full ${
                i % 5 === 0
                  ? "bg-amber-500/30"
                  : i % 3 === 0
                  ? "bg-white/10"
                  : "bg-white/4"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Frame counter */}
      <div className="flex justify-center mt-2">
        <span className="text-[8px] font-mono text-zinc-700 tracking-[0.4em] uppercase tabular-nums">
          ▸ FRAME 0047 — EXP 36 — F/2.8 — 24fps
        </span>
      </div>

      <style>{`
        @keyframes film-run {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-film-run {
          animation: film-run 18s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   REDACTED TEXT COMPONENT (Creative Interactive Bio)
   ═══════════════════════════════════════════════════════════════ */

const Redacted = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-zinc-800 text-transparent hover:bg-transparent hover:text-amber-400 transition-all duration-300 rounded px-1.5 select-none cursor-crosshair inline-block mx-0.5">
    {children}
  </span>
);

/* ═══════════════════════════════════════════════════════════════
   STORYTELLING BIO — Decrypted Transmission Concept
   ═══════════════════════════════════════════════════════════════ */

function DecryptedTransmissionBio() {
  return (
    // FIX: Reduced margin-top to pull the section up closer to the cards
    <div className="relative mt-10 max-w-5xl mx-auto px-4 sm:px-6 z-10">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-amber-500/5 blur-[120px] z-[-1]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
        <div className="flex items-center gap-2">
          <RecordingIndicator />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500/80">
            Decrypted Origin Log
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
      </motion.div>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-zinc-400 font-medium font-mono">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.1 }}
        >
          [01] The creative journey is rarely a straight line. For me, it required breaking away from the rigid expectations of a <Redacted>clinical and academic</Redacted> background to pursue an undeniable obsession with visual storytelling. What began as late nights reverse-engineering <Redacted>After Effects</Redacted> and Premiere Pro quickly evolved from a self-taught passion into a relentless pursuit of cinematic perfection.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.2 }}
        >
          [02] There were downs, naturally. The transition was a grind. Building a brand from zero, pitching to international clients, and proving that my atmospheric, high-retention aesthetic could compete on a global stage took <Redacted>thousands of hours</Redacted> of unseen work. The freelance landscape is unforgiving, and standing out required more than just knowing the software—it required developing a unique, almost surgical precision in how I approach pacing and narrative flow.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.3 }}
        >
          [03] But the ups have defined the current era. Today, I operate a high-retention video production brand with a verified <span className="text-emerald-500 font-bold tracking-widest bg-emerald-500/10 px-1 rounded">100% SUCCESS RATE</span> on Upwork. I've had the privilege of partnering with top-tier global creators to produce everything from high-impact supercar visuals to complex documentary frameworks exploring <Redacted>geopolitics and supply chains</Redacted>.
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.4 }}
        >
          [04] Whether I'm leveraging AI cinematography to generate impossible realities, or meticulously crafting Vox-style motion graphics, the mission remains the same: to build immersive, broadcast-quality experiences that don't just hold attention, but <span className="text-white font-black tracking-widest">COMMAND IT.</span>
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }} 
          transition={{ delay: 0.8 }}
          className="pt-4 text-xs text-zinc-600 uppercase tracking-widest"
        >
          <span className="animate-pulse">_</span> END OF LOG
        </motion.p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CORNER ACCENT LINES — tall thin amber gradient bars
   ═══════════════════════════════════════════════════════════════ */

function CornerAccentLines() {
  return (
    <>
      <div className="absolute top-0 left-8 w-px h-20 bg-gradient-to-b from-amber-500/25 to-transparent" />
      <div className="absolute top-0 right-8 w-px h-20 bg-gradient-to-b from-amber-500/25 to-transparent" />
      <div className="absolute bottom-0 left-8 w-px h-20 bg-gradient-to-t from-amber-500/25 to-transparent" />
      <div className="absolute bottom-0 right-8 w-px h-20 bg-gradient-to-t from-amber-500/25 to-transparent" />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */

export default function AboutDossier() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const ambientLX = useTransform(mouseX, [-400, 400], [-60, 60])
  const ambientLY = useTransform(mouseY, [-400, 400], [-60, 60])

  const handleSectionMove = useCallback(
    (e: React.MouseEvent) => {
      if (!sectionRef.current) return
      const r = sectionRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - r.left - r.width / 2)
      mouseY.set(e.clientY - r.top - r.height / 2)
    },
    [mouseX, mouseY],
  )

  const handleSectionLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex(prev => (prev + 1) % 3)
    
    // FALLBACK TIMEOUT: Forces the button to unlock if the GPU gets overloaded
    setTimeout(() => {
      setIsTransitioning(false)
    }, 800)
  }, [isTransitioning])

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  /* Keyboard nav */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleNext])

  return (
    <section
    id="about"
      ref={sectionRef}
      className="relative w-full py-32 overflow-hidden"
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
    >
      {/* Layers */}
      <FilmGrain />
      <CornerAccentLines />

      {/* Ambient lights following cursor */}
      <motion.div
        className="pointer-events-none"
        animate={{ x: ambientLX, y: ambientLY }}
        transition={{ type: "spring", stiffness: 25, damping: 18 }}
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 size-[700px] rounded-full bg-amber-500/8 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 size-[500px] rounded-full bg-amber-600/6 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[900px] rounded-full bg-amber-500/4 blur-[200px]" />
      </motion.div>

      {/* Center radial */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 size-[600px] rounded-full bg-amber-500/5 blur-[120px]"
        aria-hidden="true"
      />

      {/* Light sweep crosses */}
      <LightSweep />

      {/* Floating particles + geometric shapes */}
      <AmbientParticles />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PNG Title */}
        <div className="relative inline-block w-full text-center pointer-events-none mb-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500/20 blur-[100px] size-[400px] h-[150px] rounded-full z-[-1]" />
          <img
            src="/my-story-title-scaled.png"
            alt="My Story"
            className="mx-auto -mt-[80px] md:-mt-[120px] -mb-[80px] md:-mb-[140px] h-auto w-full max-w-[400px] sm:max-w-[550px] md:max-w-[750px] relative z-10"
          />
        </div>

        {/* ── 3 COLUMN LAYOUT (30% / 15% / 55%) ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
          
          {/* Column 1: 30% Full Profile Picture */}
          <div className="w-full lg:w-[30%]">
            <ProfileColumn />
          </div>

          {/* Column 2: 15% Active System */}
          <div className="w-full lg:w-[15%]">
            <ActiveSystemColumn />
          </div>

          {/* Column 3: 55% Dossier Cards */}
          <div className="w-full lg:w-[55%] relative flex flex-col items-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-[120px] z-[-1]" />
            
            <DossierCardStack
              activeIndex={activeIndex}
              onTransitionComplete={handleTransitionComplete}
            />

            {/* Controls bar - EXPANDED MAX-WIDTH TO MATCH CARDS */}
            <div className="mt-6 flex w-full max-w-[640px] items-center justify-between gap-4">
              <ProgressBar
                active={activeIndex}
                total={3}
                onSelect={i => {
                  if (!isTransitioning) setActiveIndex(i)
                }}
              />
              <MagneticButton
                onClick={handleNext}
                disabled={isTransitioning}
              >
                NEXT &rarr;
              </MagneticButton>
            </div>

            {/* Hint */}
            <motion.p
              className="mt-4 text-[9px] font-mono text-zinc-600 tracking-[0.25em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 0.6 : 0 }}
              transition={{ delay: 2 }}
            >
              ← → Arrow keys to navigate · Click cards to explore
            </motion.p>
          </div>

        </div>
      </div>
      
      {/* Storytelling Bio */}
      <DecryptedTransmissionBio />

      {/* Film strip footer */}
      <FilmStrip />
    </section>
  )
}