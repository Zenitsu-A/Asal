'use client';

import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: { start: number; end: number };
  fadeOut: { start: number; end: number };
}

interface BlurSettings {
  blurIn: { start: number; end: number };
  blurOut: { start: number; end: number };
  maxBlur: number;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  className?: string;
  style?: React.CSSProperties;
}

const DEPTH = 50;
const MAX_OFF = 8;

const vertSrc = `
  uniform float scrollForce; uniform float time; uniform float isHovered;
  varying vec2 vUv;
  void main(){ vUv=uv; vec3 p=position;
    float ci=scrollForce*0.3, d=length(p.xy), c=d*d*ci;
    float r1=sin(p.x*2.0+scrollForce*3.0)*0.02, r2=sin(p.y*2.5+scrollForce*2.0)*0.015;
    float cloth=(r1+r2)*abs(ci)*2.0, flag=0.0;
    if(isHovered>0.5){ flag=sin(p.x*3.0+time*8.0)*0.1*smoothstep(-0.5,0.5,p.x);
      flag+=sin(p.x*5.0+time*12.0)*0.03*smoothstep(-0.5,0.5,p.x); }
    p.z-=c+cloth+flag;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`;

const fragSrc = `
  uniform sampler2D map; uniform float opacity; uniform float blurAmount;
  varying vec2 vUv;
  void main(){ vec4 color=texture2D(map,vUv);
    if(blurAmount>0.0){ vec2 ts=1.0/vec2(textureSize(map,0)); vec4 b=vec4(0.0); float t=0.0;
      for(float x=-2.0;x<=2.0;x+=1.0) for(float y=-2.0;y<=2.0;y+=1.0){
        vec2 o=vec2(x,y)*ts*blurAmount; float w=1.0/(1.0+length(vec2(x,y)));
        b+=texture2D(map,vUv+o)*w; t+=w; }
      color=b/t; }
    gl_FragColor=vec4(color.rgb, color.a*opacity); } `;

function makeMat() {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: { 
      map: { value: null }, 
      opacity: { value: 1 }, 
      blurAmount: { value: 0 },
      scrollForce: { value: 0 }, 
      time: { value: 0 }, 
      isHovered: { value: 0 } 
    },
    vertexShader: vertSrc, 
    fragmentShader: fragSrc,
  });
}

function Scene({ 
  images, speed = 1, visibleCount = 12,
  fadeSettings = { fadeIn: { start: 0.05, end: 0.15 }, fadeOut: { start: 0.85, end: 0.95 } },
  blurSettings = { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.9, end: 1.0 }, maxBlur: 3.0 },
}: {
  images: ImageItem[]; speed?: number; visibleCount?: number;
  fadeSettings?: FadeSettings; blurSettings?: BlurSettings;
}) {
  const { gl } = useThree();
  const velRef = useRef(0);
  const autoPlay = useRef(true);
  const lastInt = useRef(Date.now());
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const mats = useMemo(() => Array.from({ length: visibleCount }, () => makeMat()), [visibleCount]);
  const norm = useMemo(() => images.map(i => (typeof i === 'string' ? i : i.src)), [images]);
  const texs = useTexture(norm);
  const ti = norm.length;

  const pos = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const ha = (i * 2.618) % (Math.PI * 2), va = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      out.push({
        x: Math.sin(ha) * ((i % 3) * 1.2) * MAX_OFF / 3,
        y: Math.cos(va) * (((i + 1) % 4) * 0.8) * MAX_OFF / 4,
      });
    }
    return out;
  }, [visibleCount]);

  const planes = useRef<{ z: number; idx: number; x: number; y: number }[]>([]);
  useEffect(() => {
    planes.current = Array.from({ length: visibleCount }, (_, i) => ({
      z: ((DEPTH / visibleCount) * i) % DEPTH,
      idx: ti > 0 ? i % ti : 0,
      x: pos[i]?.x ?? 0,
      y: pos[i]?.y ?? 0,
    }));
  }, [DEPTH, pos, ti, visibleCount]);

  // Scoped Event Listeners (Sticky Scroll Setup)
  useEffect(() => {
    const canvas = gl.domElement;
    const h = (e: WheelEvent) => {
      velRef.current += e.deltaY * 0.01 * speed;
      autoPlay.current = false; lastInt.current = Date.now();
    };
    canvas.addEventListener('wheel', h, { passive: true });
    return () => canvas.removeEventListener('wheel', h);
  }, [speed, gl]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { velRef.current -= 2 * speed; autoPlay.current = false; lastInt.current = Date.now(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { velRef.current += 2 * speed; autoPlay.current = false; lastInt.current = Date.now(); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [speed]);

  useEffect(() => {
    const id = setInterval(() => { if (Date.now() - lastInt.current > 3000) autoPlay.current = true; }, 1000);
    return () => clearInterval(id);
  }, []);

  useFrame((state, delta) => {
    if (autoPlay.current) velRef.current += 0.3 * delta;
    velRef.current *= 0.95;
    const sv = velRef.current;
    const time = state.clock.getElapsedTime();
    const adv = ti > 0 ? (visibleCount % ti || ti) : 0;

    // Cinematic Camera Parallax
    const targetX = state.pointer.x * 2.5;
    const targetY = state.pointer.y * 2.5;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, -DEPTH / 2);

    mats.forEach((m, i) => {
      const p = planes.current[i];
      if (!m?.uniforms || !p) return;

      m.uniforms.time.value = time;
      m.uniforms.scrollForce.value = sv;

      let nz = p.z + sv * delta * 10;
      if (nz >= DEPTH) {
        const w = Math.floor(nz / DEPTH); nz -= w * DEPTH;
        if (w > 0 && adv > 0 && ti > 0) p.idx = (p.idx + w * adv) % ti;
      } else if (nz < 0) {
        const w = Math.ceil(-nz / DEPTH); nz += w * DEPTH;
        if (w > 0 && adv > 0 && ti > 0) { const s = p.idx - w * adv; p.idx = ((s % ti) + ti) % ti; }
      }
      p.z = ((nz % DEPTH) + DEPTH) % DEPTH;

      const normalizedPosition = p.z / DEPTH;
      
      // Calculate Fade
      let opacity = 1;
      if (normalizedPosition >= fadeSettings.fadeIn.start && normalizedPosition <= fadeSettings.fadeIn.end) {
        opacity = (normalizedPosition - fadeSettings.fadeIn.start) / (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0;
      } else if (normalizedPosition >= fadeSettings.fadeOut.start && normalizedPosition <= fadeSettings.fadeOut.end) {
        opacity = 1 - ((normalizedPosition - fadeSettings.fadeOut.start) / (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start));
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0;
      }
      m.uniforms.opacity.value = Math.max(0, Math.min(1, opacity));

      // Calculate Blur
      let blur = 0;
      if (normalizedPosition >= blurSettings.blurIn.start && normalizedPosition <= blurSettings.blurIn.end) {
        blur = blurSettings.maxBlur * (1 - ((normalizedPosition - blurSettings.blurIn.start) / (blurSettings.blurIn.end - blurSettings.blurIn.start)));
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur;
      } else if (normalizedPosition >= blurSettings.blurOut.start && normalizedPosition <= blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur * ((normalizedPosition - blurSettings.blurOut.start) / (blurSettings.blurOut.end - blurSettings.blurOut.start));
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur;
      }
      m.uniforms.blurAmount.value = Math.max(0, Math.min(blurSettings.maxBlur, blur));

      // Link Texture and Transform Mesh Directly
      const tex = texs[p.idx];
      if (tex) {
        m.uniforms.map.value = tex;
        const mesh = meshRefs.current[i];
        if (mesh) {
          mesh.position.set(p.x, p.y, p.z - DEPTH / 2);
          
          // Zero-Gravity Suspension: Photos subtly float and tilt
          const floatX = Math.sin(time * 0.5 + i) * 0.05;
          const floatY = Math.cos(time * 0.3 + i * 2) * 0.05;
          const floatZ = Math.sin(time * 0.2 + i * 1.5) * 0.02;
          
          mesh.rotation.set(
            floatX - state.pointer.y * 0.15, 
            floatY + state.pointer.x * 0.15, 
            floatZ
          );
          
          const img = tex.image as HTMLImageElement | undefined;
          const a = img?.width && img?.height ? img.width / img.height : 1;
          mesh.scale.set(a > 1 ? 2 * a : 2, a > 1 ? 2 : 2 / a, 1);
        }
      }
    });
  });

  if (ti === 0) return null;

  return (
    <>
      {/* 1. Cinematic Floating Dust Motes (Amplified) */}
      <Sparkles
        count={1500} // Massively increased density
        scale={[50, 30, DEPTH * 1.5]} // Spread wider to ensure they cross the camera lens
        position={[0, 0, -DEPTH / 2]} // Pushed deeper so they travel towards you
        color="#fbbf24" // Amber
        size={8} // Physically larger particles
        speed={0.5} // Slightly faster so the motion is obvious
        opacity={0.5} // High visibility
        noise={0.5} // More chaotic, organic swirling
      />

      {/* 2. Deep Tunnel Amber Glow (Core Light) */}
      <mesh position={[0, 0, -DEPTH / 2 - 2]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial 
          color="#d97706" 
          transparent 
          opacity={0.01} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </mesh>

      {/* 3. The Interactive Image Gallery */}
      {planes.current.map((_, i) => (
        <mesh 
          key={`plane-${i}`} 
          ref={(el) => { meshRefs.current[i] = el; }}
          onPointerEnter={() => { if (mats[i]?.uniforms) mats[i].uniforms.isHovered.value = 1.0; }}
          onPointerLeave={() => { if (mats[i]?.uniforms) mats[i].uniforms.isHovered.value = 0.0; }}
        >
          <planeGeometry args={[1, 1, 32, 32]} />
          <primitive object={mats[i]} />
        </mesh>
      ))}
    </>
  );
}

// Custom styled fallback matching your brand
function Fallback({ images }: { images: ImageItem[] }) {
  const norm = useMemo(() => images.map(i => (typeof i === 'string' ? { src: i, alt: '' } : i)), [images]);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-zinc-950 p-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-0.5 w-6 rounded-full bg-amber-500/60" />
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Gallery Fallback (WebGL Disabled)
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto w-full max-w-6xl p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm">
        {norm.map((img, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800 transition-all duration-500 hover:ring-amber-500/30">
            <img src={img.src || '/placeholder.svg'} alt={img.alt || ''} className="w-full aspect-video object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InfiniteGallery({
  images, className = 'h-[600px] w-full', style, speed = 1,
  visibleCount = 12,
  fadeSettings = { fadeIn: { start: 0.05, end: 0.25 }, fadeOut: { start: 0.4, end: 0.43 } },
  blurSettings = { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.4, end: 0.43 }, maxBlur: 8.0 },
}: InfiniteGalleryProps) {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const g = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!g) setOk(false);
    } catch { setOk(false); }
  }, []);

  if (!ok) return <div className={className} style={style}><Fallback images={images} /></div>;

  return (
    <div className={className} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      <Suspense fallback={
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-zinc-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-500/70">
            Loading Cinematic Assets
          </span>
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 0], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true }} dpr={[1, 2]}
          style={{ width: '100%', height: '100%', display: 'block' }}>
          <Scene images={images} speed={speed} visibleCount={visibleCount}
            fadeSettings={fadeSettings} blurSettings={blurSettings} />
        </Canvas>
      </Suspense>
    </div>
  );
}