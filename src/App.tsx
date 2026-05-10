import { HeroSection } from './components/ui/hero-odyssey'
import { WorkSection } from './components/ui/work-section'
import { BrandLogosSection } from './components/ui/brand-logos-section'
import { TestimonialsSection } from './components/ui/testimonials-section'
import InfiniteGallery from './components/ui/InfiniteGallery'
import AboutDossier from './components/ui/about-dossier'
import Footer from './components/ui/footer'

const galleryImages = [
  '/Frames/12.png',
  '/Frames/5.png',
  '/Frames/6.jpg',
  '/Frames/9.jpg',
  '/Frames/13.jpg',
  '/Frames/16.jpg',
  '/Frames/19.jpg',
  '/Frames/1.jpg.avif',
  '/Frames/8.avif',
  '/Frames/3.avif',
  '/Frames/4.avif',
  '/Frames/22.png',
  '/Frames/21.png',
  '/Frames/20.png',
  '/Frames/11.png',
  '/Frames/14.png',
  '/Frames/7.png',
  '/Frames/15.png',
  '/Frames/17.png',
  '/Frames/18.png',
  '/Frames/2.png',
  '/Frames/10.png',
]

function App() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      {/* High-Retention Sticky Track (Controls how long they scroll) */}
{/* High-Retention Sticky Track */}
<section className="relative w-full h-[250vh] bg-zinc-950">

  {/* The Sticky Container */}
  <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center border-y border-zinc-800/60 bg-zinc-950">

    {/* THE WOW FACTOR 3: Analog Film Grain (Fuses the 3D and DOM layers) */}
    <div
      className="absolute inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-screen"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />

    {/* Rembrandt Asymmetrical Lighting Setup */}
    <div className="pointer-events-none absolute -top-[10%] -right-[10%] h-[700px] w-[700px] rounded-full bg-amber-500/15 blur-[160px] z-0 transition-opacity duration-1000" />
    <div className="pointer-events-none absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[140px] z-0" />

    {/* Top Film Strip Motif */}
    <div className="absolute top-6 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none opacity-40">
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`tl-${i}`} className="h-1.5 w-3 rounded-[2px] bg-zinc-600" style={{ opacity: 0.3 + (i % 3) * 0.2 }} />
        ))}
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`tr-${i}`} className="h-1.5 w-3 rounded-[2px] bg-zinc-600" style={{ opacity: 0.3 + (i % 3) * 0.2 }} />
        ))}
      </div>
    </div>

    {/* Heavy Vignette & Edge Shadowing */}
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 z-10 pointer-events-none opacity-90" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(9,9,11,0.9)_100%)] z-10 pointer-events-none" />

    {/* Full Bleed 3D Gallery */}
    <InfiniteGallery
      images={galleryImages}
      speed={1.2}
      visibleCount={12}
      className="absolute inset-0 w-full h-full z-0"
    />

    {/* Original Typography Overlay (Single line, Serif) */}
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-center px-3 mix-blend-exclusion text-white z-20">
      <h1 className="font-serif text-4xl md:text-7xl tracking-tight opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        <span className="italic">I create;</span> therefore I am
      </h1>
    </div>

    {/* Custom UI Cues */}
    <div className="absolute bottom-10 left-0 right-0 pointer-events-none flex items-center justify-center gap-3 z-20">
      <svg className="h-3 w-3 animate-pulse text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">
        Scroll to explore
      </span>
      <svg className="h-3 w-3 animate-pulse text-amber-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>

    {/* Bottom Film Strip Motif */}
    <div className="absolute bottom-6 left-0 right-0 flex justify-between items-center px-8 z-20 pointer-events-none opacity-40">
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`bl-${i}`} className="h-1.5 w-3 rounded-[2px] bg-zinc-600" style={{ opacity: 0.3 + (i % 3) * 0.2 }} />
        ))}
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`br-${i}`} className="h-1.5 w-3 rounded-[2px] bg-zinc-600" style={{ opacity: 0.3 + (i % 3) * 0.2 }} />
        ))}
      </div>
    </div>

  </div>
</section>
      <WorkSection />
      <BrandLogosSection />
      <TestimonialsSection />

<AboutDossier />
<Footer />
    </div>
  )
}

export default App