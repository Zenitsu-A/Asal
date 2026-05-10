"use client";

import { motion } from "framer-motion";
import React from "react";
import { Separator } from "./separator";

interface Testimonial {
  text: string;
  name: string;
  role: string;
  initials: string;
}

// Helper to auto-generate initials from names
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const ALL_TESTIMONIALS: Testimonial[] = [
  {
    name: "MacK Butsko",
    role: "Youtube Faceless video + Logo and banner",
    text: "Ahmed completely elevated my channel. The faceless videos are super engaging, and the logo and banner gave my brand the premium, professional look it desperately needed!",
    initials: getInitials("MacK Butsko"),
  },
  {
    name: "Akram Oweidah",
    role: "Dental 2d / 3d motion graphics",
    text: "Incredible attention to detail on our dental 2D and 3D motion graphics. The visuals were clean, anatomically accurate, and visually stunning. Highly recommended.",
    initials: getInitials("Akram Oweidah"),
  },
  {
    name: "Fauquier Naacp Communications Committee",
    role: "Video Editing of Conference",
    text: "Ahmed provided exceptional video editing for our conference. He beautifully captured the essence of the event with seamless transitions and great audio balancing.",
    initials: getInitials("Fauquier Naacp"),
  },
  {
    name: "Quang Nguyen",
    role: "Professional Video Editing",
    text: "One of the best editors I've worked with. Fast, communicative, and delivers high-end cinematic quality every single time.",
    initials: getInitials("Quang Nguyen"),
  },
  {
    name: "Salman",
    role: "Video Editor and 3d parallax Animator MagnetsMedia style",
    text: "Absolutely nailed the MagnetsMedia style! The 3D parallax effects and fast-paced editing were flawless. He understands exactly how to keep viewer retention high.",
    initials: getInitials("Salman"),
  },
  {
    name: "Ismael Ruiz",
    role: "Professional Video Editor",
    text: "A true professional. He understands pacing, retention, and how to craft a compelling story through video editing. Will definitely hire again.",
    initials: getInitials("Ismael Ruiz"),
  },
  {
    name: "Upwork Client",
    role: "Add subtitles and title cards on existing video",
    text: "Ahmed is super professional, skilled, creative, communicative and completes work on time. He is a joy to work with. Highly recommended!",
    initials: getInitials("Upwork Client"),
  },
  {
    name: "Rosa from MABI",
    role: "Lyric Video for Band",
    text: "Ahmed was excellent, talented, prompt, communicative. The end result was exactly what I needed. I would definitely work with him again!",
    initials: getInitials("Rosa MABI"),
  },
  {
    name: "Salper Partalci",
    role: "Experienced Video Editor for construction / mega project YouTube channel",
    text: "Great work all round!",
    initials: getInitials("Salper Partalci"),
  },
  {
    name: "Jose Gomez",
    role: "A Motion Graphics Editor 2D VFX",
    text: "Great job!",
    initials: getInitials("Jose Gomez"),
  },
  {
    name: "Zal Raskn",
    role: "Create Vox style video",
    text: "Had a fantastic experience working with Ahmed and eagerly anticipate our next project!",
    initials: getInitials("Zal Raskn"),
  },
  {
    name: "Reinhard Senger",
    role: "🎬 Hiring a Video Editor – Help Us Create High-Impact Supercar Content! 🚀",
    text: "Ahmed, this looks incredible! Thanks so much for the hard work here and I think there will certainly be more work for you in the future!",
    initials: getInitials("Reinhard Senger"),
  },
];

// Split the testimonials into 3 columns for the masonry layout
const col1 = ALL_TESTIMONIALS.slice(0, 4);
const col2 = ALL_TESTIMONIALS.slice(4, 8);
const col3 = ALL_TESTIMONIALS.slice(8, 12);

interface TestimonialsColumnProps {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}

export const TestimonialsColumn = ({ className, testimonials, duration = 25 }: TestimonialsColumnProps) => {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, name, role, initials }, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-6 md:p-8 transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] group"
              >
                {/* Amber glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Large quotation mark */}
                <svg
                  className="absolute -left-1 -top-1 h-10 w-10 text-amber-500/10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <div className="relative z-10">
                  {/* 5 stars */}
                  <div className="mb-4 flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm leading-relaxed text-zinc-300 italic mb-6">
                    &ldquo;{text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 text-sm font-bold text-amber-400 ring-1 ring-amber-500/20">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{name}</p>
                      <p className="text-[11px] text-zinc-500 truncate" title={role}>{role}</p>
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-zinc-500 hidden sm:inline-block">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative w-full bg-black py-24">
      
      {/* Background Ambient Glows */}
      {/* Strong top glow for seamless transition from BrandLogosSection */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-amber-500/15 blur-[120px] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[30%] bg-violet-600/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* The Title PNG (Fixed spacing with aggressive negative margins) */}
            <div className="relative inline-block w-full pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500/20 blur-[60px] w-[300px] h-[100px] rounded-full z-[-1]" />
              <img
                src="/client-reviews-title-scaled.png"
                alt="Client Reviews"
                className="mx-auto h-auto w-full max-w-[400px] sm:max-w-[550px] md:max-w-[750px] -mt-[80px] md:-mt-[120px] -mb-[80px] md:-mb-[140px] relative z-10"
              />
            </div>
            
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto mt-0 mb-10 relative z-20">
              Trusted by creators and brands worldwide to deliver high-retention, cinematic masterpieces that drive real results.
            </p>

            {/* UPWORK STATS ROW */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 relative z-20">
              
              {/* Stat 1: Top Rated */}
              <div className="flex items-center gap-3 bg-zinc-900/50 border border-[#14a800]/30 rounded-full px-5 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(20,168,0,0.1)]">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#14a800]/20 text-[#14a800]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-zinc-100 tracking-wide uppercase">Top Rated Talent</span>
              </div>

              {/* Stat 2: 100% Success */}
              <div className="flex items-center gap-3 bg-zinc-900/50 border border-amber-500/30 rounded-full px-5 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <div className="text-amber-400 font-black text-lg leading-none">100%</div>
                <Separator orientation="vertical" className="h-4 bg-zinc-700" />
                <span className="text-sm font-bold text-zinc-300 tracking-wide uppercase">Job Success</span>
              </div>

              {/* Stat 3: 5 Star Average */}
              <div className="flex items-center gap-3 bg-zinc-900/50 border border-amber-500/30 rounded-full px-5 py-2.5 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <Separator orientation="vertical" className="h-4 bg-zinc-700" />
                <span className="text-sm font-bold text-zinc-300 tracking-wide uppercase">5.0 Average</span>
              </div>

            </div>
          </motion.div>
        </div>

        {/* TESTIMONIAL COLUMNS */}
        <div className="relative mt-16 h-[600px] md:h-[800px] overflow-hidden" 
             style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
            <TestimonialsColumn 
              testimonials={col1} 
              duration={35} 
              className="hidden lg:block" 
            />
            <TestimonialsColumn 
              testimonials={col2} 
              duration={45} 
              className="hidden md:block" 
            />
            <TestimonialsColumn 
              testimonials={col3} 
              duration={40} 
              className="block" 
            />
          </div>
        </div>

      </div>
    </section>
  );
};