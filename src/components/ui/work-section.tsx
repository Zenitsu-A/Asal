"use client";

import { useEffect, useRef, useState, useMemo, forwardRef, type Ref, type HTMLAttributes, type ReactNode, type MutableRefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { McqProject } from "./mcq-project";
import { VoxStyleProject } from "./vox-style-project";
import { MapAnimationProject } from "./map-animation-project";
import { ViralReelsProject } from "./viral-reels-project";
import { Animations2DProject } from "./2d-animations-project";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- HELPER UTILITIES ---

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref != null) {
          (ref as MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };
    handleResize();
    let timeoutId: number;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleResize, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);
  return value;
}

// --- PREMIUM MESH & GRID BACKGROUND ---

const MeshBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-0 z-0 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage: "url('/Grid.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] rounded-full bg-amber-500/10 blur-[150px]" />
      <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-400/5 blur-[120px]" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[150px]" />
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-amber-500/10 blur-[150px]" />
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 60%, black 100%)`,
        }}
      />
    </div>
  );
};

// --- GALLERY COMPONENTS ---

interface CombinedRadialGalleryProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  outerChildren: ReactNode[];
  innerChildren: ReactNode[];
  scrollDuration?: number;
  visiblePercentage?: number;
  outerRadius?: number;
  innerRadius?: number;
  outerMobileRadius?: number;
  innerMobileRadius?: number;
  startTrigger?: string;
  onItemSelect?: (index: number) => void;
  direction?: "ltr" | "rtl";
  disabled?: boolean;
}

export const CombinedRadialGallery = forwardRef<HTMLDivElement, CombinedRadialGalleryProps>(
  (
    {
      outerChildren,
      innerChildren,
      scrollDuration = 3000,
      visiblePercentage = 50,
      outerRadius = 500,
      innerRadius = 200,
      outerMobileRadius = 190,
      innerMobileRadius = 90,
      startTrigger = "center center",
      onItemSelect,
      direction = "ltr",
      disabled = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const outerChildRef = useRef<HTMLLIElement>(null);
    const innerChildRef = useRef<HTMLLIElement>(null);
    const mergedRef = useMergeRefs(ref, pinRef);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const currentOuterRadius = useResponsiveValue(outerRadius, outerMobileRadius);
    const currentInnerRadius = useResponsiveValue(innerRadius, innerMobileRadius);
    const circleDiameter = currentOuterRadius * 2;
    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);
    const outerCount = outerChildren.length;
    const innerCount = innerChildren.length;
    const totalCount = outerCount + innerCount;

    useEffect(() => {
      setIsMounted(true);
      if (!outerChildRef.current && outerCount > 0) return;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setChildSize({ w: entry.contentRect.width, h: entry.contentRect.height });
        }
        ScrollTrigger.refresh();
      });
      if (outerChildRef.current) observer.observe(outerChildRef.current);
      if (innerChildRef.current) observer.observe(innerChildRef.current);
      return () => observer.disconnect();
    }, [outerCount, innerCount]);

    useEffect(() => {
      if (!pinRef.current || !containerRef.current || totalCount === 0) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion) {
        gsap.fromTo(
          containerRef.current.children,
          { scale: 0, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1.2,
            ease: "back.out(1.2)",
            stagger: 0.05,
            scrollTrigger: { trigger: pinRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
        gsap.to(containerRef.current, {
          rotation: 360,
          ease: "none",
          scrollTrigger: { trigger: pinRef.current, pin: true, start: startTrigger, end: `+=${scrollDuration}`, scrub: 0.5, invalidateOnRefresh: true },
        });
      }
      return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    }, [scrollDuration, currentOuterRadius, currentInnerRadius, startTrigger, totalCount]);

    if (totalCount === 0) return null;
    const scaleFactor = 1.25;
    const calculatedBuffer = childSize ? childSize.h * scaleFactor - childSize.h + 60 : 150;
    const visibleAreaHeight = childSize ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer : circleDiameter * visibleDecimal + 200;

    return (
      <div ref={mergedRef} className={`w-full relative flex items-center justify-center overflow-hidden ${className}`} {...rest}>
        <div className="relative w-full overflow-hidden" style={{ height: `${visibleAreaHeight}px`, maskImage: "linear-gradient(to top, transparent 0%, black 30%, black 100%)", WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 30%, black 100%)" }}>
          <ul ref={containerRef} className={`absolute left-1/2 -translate-x-1/2 m-0 p-0 list-none transition-opacity duration-500 ease-out ${disabled ? "opacity-50 pointer-events-none grayscale" : ""} ${isMounted ? "opacity-100" : "opacity-0"}`} dir={direction} style={{ width: circleDiameter, height: circleDiameter, bottom: -(circleDiameter * hiddenDecimal) }}>
            {outerChildren.map((child, index) => {
              const angle = (index / outerCount) * 2 * Math.PI;
              let x = currentOuterRadius * Math.cos(angle);
              const y = currentOuterRadius * Math.sin(angle);
              if (direction === "rtl") x = -x;
              const rotationAngle = (angle * 180) / Math.PI + 90;
              const isHovered = hoveredIndex === index;
              return (
                <li key={`outer-${index}`} ref={index === 0 ? outerChildRef : null} className="absolute top-1/2 left-1/2" style={{ zIndex: isHovered ? 100 : 20, transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotationAngle}deg)` }}>
                  {/* PERFECT FIX: Only blur and grayscale, NO opacity drop! */}
                  <div onMouseEnter={() => !disabled && setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} className={`block cursor-pointer rounded-2xl transition-all duration-500 ease-out ${isHovered ? "scale-[1.15] -translate-y-6 shadow-2xl shadow-amber-500/20" : "scale-100"} ${hoveredIndex !== null && !isHovered ? "blur-[2px] grayscale" : "blur-0 grayscale-0"}`}>{child}</div>
                </li>
              );
            })}
            {innerChildren.map((child, index) => {
              const angle = (index / innerCount) * 2 * Math.PI;
              let x = currentInnerRadius * Math.cos(angle);
              const y = currentInnerRadius * Math.sin(angle);
              if (direction === "rtl") x = -x;
              const rotationAngle = (angle * 180) / Math.PI + 90;
              const adjIdx = index + outerCount;
              const isHovered = hoveredIndex === adjIdx;
              return (
                <li key={`inner-${index}`} ref={index === 0 ? innerChildRef : null} className="absolute top-1/2 left-1/2" style={{ zIndex: isHovered ? 100 : 5, transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotationAngle}deg)` }}>
                  {/* PERFECT FIX: Only blur and grayscale, NO opacity drop! */}
                  <div onMouseEnter={() => !disabled && setHoveredIndex(adjIdx)} onMouseLeave={() => setHoveredIndex(null)} className={`block cursor-pointer rounded-2xl transition-all duration-500 ease-out ${isHovered ? "scale-[1.05] -translate-y-4 shadow-2xl shadow-amber-500/20" : "scale-[0.85]"} ${hoveredIndex !== null && !isHovered ? "blur-[2px] grayscale" : "blur-0 grayscale-0"}`}>{child}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);
CombinedRadialGallery.displayName = "CombinedRadialGallery";

// --- VIDEO DATA & CARDS ---

const videoLinks = [
  "https://youtu.be/l1COWpNRpTI", "https://youtu.be/RBN1g1qT4hA", "https://youtu.be/RBN1g1qT4hA",
  "https://youtu.be/RYF82CGVKhw", "https://youtu.be/d_tGeya7P9U", "https://youtu.be/Qiw-28LCfsM",
  "https://youtu.be/7g85LdUhgNM", "https://youtu.be/akNYlu8dxyc", "https://youtu.be/jkEVcgzOqW8",
  "https://youtu.be/alItpZWF69c", "https://youtu.be/WPlU1rs4Hgo", "https://youtu.be/Kc9GhWGEIcY",
  "https://youtu.be/X0KUQFKuj48", "https://youtu.be/ReDWhRXKCEY", "https://youtu.be/hKc5Zqyupe4",
  "https://youtu.be/Us1EdOEYLv8", "https://youtu.be/RpC8KMWHHqQ", "https://youtu.be/AAna--RDBug",
  "https://youtu.be/NKGMlXk3Cbs", "https://youtu.be/fp4pMjxODKw", "https://youtu.be/pLGjdFKXtYQ",
  "https://youtu.be/DuMSvfNWtTs", "https://youtu.be/ODdJ2VQzAow", "https://youtu.be/i_Yth9634oA",
  "https://youtu.be/A_Fj1YpYEbI", "https://youtu.be/h5bFVp444WM", "https://youtu.be/XA7_xAH5b_M",
];

const videoLinksOuter = videoLinks.slice(0, 18);
const videoLinksInner = videoLinks.slice(18, 27);

function getEmbedUrl(url: string): string {
  if (url.includes("youtu.be/") || url.includes("youtube.com/")) {
    const videoId = url.includes("youtu.be/") ? url.split("youtu.be/")[1].split("?")[0] : new URL(url).searchParams.get("v") || "";
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

// Premium Card
function VideoCard({ url, index, onClick }: { url: string; index: number; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group w-[238px] md:w-[272px] rounded-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/5 transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] cursor-pointer"
    >
      <div className="relative aspect-video bg-black/50 ring-1 ring-white/5 z-0">
        <iframe 
          src={`${getEmbedUrl(url)}?autoplay=0&mute=1&controls=0&modestbranding=1&rel=0`} 
          title={`Work sample ${index + 1}`} 
          className="w-full h-full relative z-10 pointer-events-none" 
          tabIndex={-1}
          loading="lazy"
        />
      </div>
      
      <div className="p-4 relative bg-[#0f0f11] z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-2 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-500/10 text-amber-400 border border-amber-500/20">
            YouTube
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider">#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="text-zinc-100 font-semibold text-sm mb-1 tracking-wide relative z-10">Video Edit</h3>
        <p className="text-zinc-500 text-xs relative z-10">Professional video editing & motion graphics</p>
      </div>
    </div>
  );
}

function VideoCardSmall({ url, index, onClick }: { url: string; index: number; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group w-[200px] md:w-[240px] rounded-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-white/5 transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] cursor-pointer"
    >
      <div className="relative aspect-video bg-black/50 ring-1 ring-white/5 z-0">
        <iframe 
          src={`${getEmbedUrl(url)}?autoplay=0&mute=1&controls=0&modestbranding=1&rel=0`} 
          title={`Work sample ${index + 1}`} 
          className="w-full h-full relative z-10 pointer-events-none" 
          tabIndex={-1}
        />
      </div>
      
      <div className="p-3 relative bg-[#0f0f11] z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-1.5 relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-500/10 text-amber-400 border border-amber-500/20">
            YouTube
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          <span className="text-zinc-500 text-[9px] uppercase tracking-wider">#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="text-zinc-100 font-semibold text-xs mb-0.5 tracking-wide relative z-10">Video Edit</h3>
        <p className="text-zinc-500 text-[10px] relative z-10">Professional video editing & motion graphics</p>
      </div>
    </div>
  );
}

// --- MAIN WORK SECTION ---

export const WorkSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedVideo]);

  return (
    <section id="work" className="relative w-full bg-black pt-0 pb-4">
      
      <MeshBackground />

      <div className="relative z-10">
        
        <div className="text-center mb-1 mt-1 relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />
          
          <img
            src="/my-work-title-scaled.png"
            alt="My Work"
            className="mx-auto -mt-30 -mb-40 h-auto w-auto max-w-[350px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] relative z-10"
          />
          <br />
          <p className="text-zinc-400 text-sm md:text-base -mt-30 -mb-15 relative z-10">
            A showcase of my latest projects and creative work
          </p>
        </div>

        <CombinedRadialGallery
          outerChildren={videoLinksOuter.map((url, index) => (
            <VideoCard 
              key={index} 
              url={url} 
              index={index} 
              onClick={() => setSelectedVideo(url)} 
            />
          ))}
          innerChildren={videoLinksInner.map((url, index) => (
            <VideoCardSmall 
              key={index} 
              url={url} 
              index={index + 18} 
              onClick={() => setSelectedVideo(url)} 
            />
          ))}
          scrollDuration={3000}
          visiblePercentage={55}
          outerRadius={500}
          innerRadius={200}
          outerMobileRadius={190}
          innerMobileRadius={90}
          startTrigger="center center"
        />
        
        <McqProject />

        <div className="relative flex items-center justify-center py-16">
          <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-amber-500/20 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
        </div>

        <VoxStyleProject />

        <div className="relative flex items-center justify-center py-8">
          <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-amber-500/20 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
          </div>
        </div>

        <MapAnimationProject />

        <div className="relative flex items-center justify-center py-8">
          <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-amber-500/20 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
          </div>
        </div>

        <ViralReelsProject />

        <div className="relative flex items-center justify-center py-8">
          <div className="h-px w-full max-w-lg bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          <div className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-amber-500/20 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
          </div>
        </div>

        <Animations2DProject />
      </div>

      {/* --- VIDEO PLAYER MODAL --- */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
              onClick={() => setSelectedVideo(null)} 
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-video bg-zinc-950 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-md ring-1 ring-white/10 transition-all duration-300 hover:bg-black/80 hover:text-amber-400 hover:ring-amber-500/50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>

              <iframe
                src={`${getEmbedUrl(selectedVideo)}?autoplay=1&modestbranding=1&rel=0`}
                title="Video Player"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full relative z-10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};