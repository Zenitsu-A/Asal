"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

interface FeatureItemProps {
  name: string;
  value: string;
}

interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
}

const Lightning: React.FC<LightningProps> = ({
  hue = 40,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;

      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0), 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));

          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;

          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const startTime = performance.now();
    let animationFrameId: number | null = null;

    const render = () => {
      if (!gl || !program) return;
      try {
        gl.useProgram(program);
        resizeCanvas();
        gl.viewport(0, 0, canvas.width, canvas.height);

        const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
        const iTimeLocation = gl.getUniformLocation(program, "iTime");
        const uHueLocation = gl.getUniformLocation(program, "uHue");
        const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset");
        const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
        const uIntensityLocation = gl.getUniformLocation(program, "uIntensity");
        const uSizeLocation = gl.getUniformLocation(program, "uSize");

        gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
        const currentTime = performance.now();
        gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
        gl.uniform1f(uHueLocation, hue);
        gl.uniform1f(uXOffsetLocation, xOffset);
        gl.uniform1f(uSpeedLocation, speed);
        gl.uniform1f(uIntensityLocation, intensity);
        gl.uniform1f(uSizeLocation, size);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } catch (e) {
        // error handling
      }
      animationFrameId = requestAnimationFrame(render);
    };
    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      if (program) gl.deleteProgram(program);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
    };
  }, [hue, xOffset, speed, intensity, size]);

  return <canvas ref={canvasRef} className="w-full h-full relative pointer-events-none" style={{ pointerEvents: 'none' }} />;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ name, value }) => {
  return (
    <div className="group transition-all duration-300 hover:scale-110">
      <div className="flex items-center gap-2 relative px-4 py-2 bg-zinc-900/40 rounded-full backdrop-blur-md border border-white/10">
        <div className="relative">
          <div className="w-2 h-2 bg-amber-400 rounded-full group-hover:animate-pulse"></div>
          <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="text-white relative">
          <div className="font-medium group-hover:text-amber-300 transition-colors duration-300 text-xs sm:text-sm">{name}</div>
        </div>
      </div>
    </div>
  );
};

const tools = [
  { name: "Motion Design", value: "After Effects" },
  { name: "Video Editing", value: "Premiere Pro" },
  { name: "3D Art", value: "Blender" },
  { name: "Compositing", value: "After Effects" },
  { name: "AI Content Creator", value: "AI Tools" },
];

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON (Injected for the Hero CTA)
   ═══════════════════════════════════════════════════════════════ */
function MagneticButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  }, [mx, my]);

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: mx, y: my }}
      className={`group relative flex cursor-pointer select-none items-center justify-center gap-3 overflow-hidden rounded-full font-bold uppercase tracking-wider text-white transition-all active:scale-[0.98] ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
        {children}
      </span>
      <motion.span
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1, repeatDelay: 2 }}
      />
    </motion.button>
  );
}

export const HeroSection: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPNG, setShowPNG] = useState(false);
  const [videoVisible, setVideoVisible] = useState(true);
  const [lightningHue] = useState(40);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative w-full min-h-[100svh] bg-black text-white overflow-hidden flex flex-col">
      {/* Background layer - hero image with flicker */}
      <motion.img
        src="/hero.png"
        alt=""
        className="absolute top-[100px] left-0 w-full h-[calc(100%-100px)] object-cover object-center z-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.6, 1, 0.7, 1, 0.85, 1] }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Lightning overlay at 50% opacity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div className="absolute inset-0 h-full pointer-events-none">
          <Lightning hue={lightningHue} xOffset={0} speed={1.6} intensity={0.5} size={2} />
        </div>
      </motion.div>

      {/* Glowing orbs */}
      <div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-3xl z-30 pointer-events-none" />
      <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-3xl z-30 pointer-events-none" />

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent z-30 pointer-events-none" />

      {/* ── FOREGROUND CONTENT LAYER ── */}
      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-full flex-1 w-full justify-center">
        
        {/* Navigation */}
        <div className="bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-full px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-lg absolute top-6 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8">
          {/* Left: Logo */}
          <div className="flex items-center">
            <img src="/asal-title-scaled.png" alt="AS" className="h-8 sm:h-12 w-auto object-contain" />
          </div>

          {/* Center: Nav items - Fully linked up */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              className="text-sm font-medium hover:text-amber-400 transition-colors" 
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Work
            </button>
            <button 
              className="text-sm font-medium hover:text-amber-400 transition-colors" 
              onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Testimonials
            </button>
            <button 
              className="text-sm font-medium hover:text-amber-400 transition-colors"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              About
            </button>
            <button 
              className="text-sm font-medium hover:text-amber-400 transition-colors"
              onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Blog
            </button>
          </div>

          {/* Right: Contact Button */}
          <div className="flex items-center space-x-4">
            <button 
              className="hidden md:block px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all duration-300"
              onClick={() => window.location.href = "mailto:asalofficialacc@gmail.com"}
            >
              Let's Talk
            </button>
            
            <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu - Fully linked up */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl font-medium">
              <button className="absolute top-8 right-8 p-2" onClick={() => setMobileMenuOpen(false)}>
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <button className="hover:text-amber-400" onClick={() => { setMobileMenuOpen(false); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }}>Work</button>
              <button className="hover:text-amber-400" onClick={() => { setMobileMenuOpen(false); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }}>Testimonials</button>
              <button className="hover:text-amber-400" onClick={() => { setMobileMenuOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</button>
              <button className="hover:text-amber-400" onClick={() => { setMobileMenuOpen(false); document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' }); }}>Blog</button>
              <button 
                className="px-8 py-3 mt-4 bg-gradient-to-r from-amber-500 to-violet-600 rounded-full font-bold uppercase tracking-wider" 
                onClick={() => { setMobileMenuOpen(false); window.location.href = "mailto:asalofficialacc@gmail.com"; }}
              >
                Let's Talk
              </button>
            </div>
          </motion.div>
        )}

        {/* ── MAIN HERO CENTER ── */}
        {/* Adjusted spacing so it naturally flows better on laptops */}
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-28 sm:mt-32">
          
          {/* Eyebrow Label */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2 px-4 py-1.5 bg-zinc-900/60 border border-white/10 backdrop-blur-md rounded-full text-[11px] font-mono tracking-widest uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-zinc-300">Available for new deployments</span>
          </motion.div>

          {/* Locked-height box - Shrunk max heights slightly so it doesn't push bottom content off screen */}
          <div className="relative w-full h-[220px] sm:h-[280px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
            <AnimatePresence>
              {videoVisible && (
                <motion.div
                  key="video-wrapper"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute z-50 flex items-center justify-center"
                >
                  <video
                    autoPlay
                    muted
                    playsInline
                    onTimeUpdate={(e) => {
                      const video = e.currentTarget;
                      if (video.duration - video.currentTime < 0.6) {
                        setShowPNG(true);
                      }
                    }}
                    onEnded={() => setVideoVisible(false)}
                    className="w-auto h-auto max-w-[320px] sm:max-w-[450px] md:max-w-[600px] pointer-events-none transform scale-[1.59]"
                  >
                    <source src="/hero-animation.webm" type="video/webm" />
                  </video>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PNG remains "rendered" but fades in based on video progress */}
            <motion.div
              className="absolute flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: showPNG ? 1 : 0 }}
              transition={{ duration: 0.70 }}
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-[80px] rounded-full scale-75 animate-pulse" />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <img
                  src="/asal-title-scaled.png"
                  alt="ASAL"
                  className="h-auto w-auto relative z-10 max-w-[320px] sm:max-w-[450px] md:max-w-[600px] transform scale-[1.60] -mb-9"
                />
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* ── BOTTOM ACTIONS (Now flowing naturally below the logo) ── */}
        <div className="mt-8 flex flex-col items-center pb-8 z-50 relative w-full">
          
          {/* Tools section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 max-w-3xl px-2"
          >
            {tools.map((tool) => (
              <FeatureItem key={tool.name} name={tool.name} value={tool.value} />
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <MagneticButton 
              className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-amber-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-[10px] sm:text-xs"
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            >
              START A PROJECT
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </MagneticButton>
            
            <MagneticButton 
              className="px-6 sm:px-8 py-3.5 bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-[10px] sm:text-xs"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              My ART
            </MagneticButton>
          </motion.div>

        </div>

      </div>
    </div>
  );
};