// Built using Hyperiux Vault: https://vault.hyperiux.com
// Modified to procedurally generate Aurora Waves

'use client';

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ---- inlined from ./createSuspendedRaf ---- */
const DEFAULT_ROOT_MARGIN = "256px";

type RafRoot = Element | null | { current: Element | null } | (() => Element | null);

function resolveElement(root: RafRoot): Element | null {
  if (!root) return null;
  if (typeof root === "function") return root() ?? null;
  if (typeof root === "object" && "current" in root) return root.current ?? null;
  return root;
}

interface VisibilityGateOptions {
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
  onChange?: (active: boolean) => void;
}

interface VisibilityGate {
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

function createVisibilityGate({
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
  onChange,
}: VisibilityGateOptions = {}): VisibilityGate {
  let tabVisible = typeof document === "undefined" ? true : !document.hidden;
  let onscreen = true;
  let destroyed = false;
  let observer: IntersectionObserver | null = null;

  const isActive = () => {
    if (destroyed) return false;
    if (observeTab && !tabVisible) return false;
    if (observeOffscreen && resolveElement(root) && !onscreen) return false;
    return true;
  };

  let lastActive = isActive();

  const emit = () => {
    if (destroyed) return;
    const next = isActive();
    if (next === lastActive) return;
    lastActive = next;
    onChange?.(next);
  };

  const onVisibilityChange = () => {
    tabVisible = !document.hidden;
    emit();
  };

  if (observeTab && typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  const bindObserver = () => {
    if (!observeOffscreen || typeof IntersectionObserver === "undefined") return;
    const el = resolveElement(root);
    if (!el) return;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onscreen = entry.isIntersecting;
        emit();
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
  };

  bindObserver();

  return {
    get isActive() { return isActive(); },
    observe(nextRoot?: RafRoot) {
      if (destroyed) return;
      if (nextRoot != null) root = nextRoot;
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      onscreen = true;
      bindObserver();
      emit();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (observeTab && typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    },
  };
}

interface SuspendedRafOptions {
  onFrame: (time: number) => void;
  root?: RafRoot;
  rootMargin?: string;
  threshold?: number;
  observeTab?: boolean;
  observeOffscreen?: boolean;
}

interface SuspendedRaf {
  start: () => void;
  stop: () => void;
  readonly isRunning: boolean;
  readonly isActive: boolean;
  observe: (nextRoot?: RafRoot) => void;
  destroy: () => void;
}

function createSuspendedRaf({
  onFrame,
  root = null,
  rootMargin = DEFAULT_ROOT_MARGIN,
  threshold = 0,
  observeTab = true,
  observeOffscreen = true,
}: SuspendedRafOptions): SuspendedRaf {
  let rafId: number | null = null;
  let running = false;
  let destroyed = false;

  const stopRaf = () => {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const tick = (time: number) => {
    rafId = null;
    if (destroyed || !running || !gate.isActive) return;
    onFrame(time);
    if (!destroyed && running && gate.isActive) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const sync = () => {
    if (destroyed) return;
    if (running && gate.isActive) {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    } else {
      stopRaf();
    }
  };

  const gate = createVisibilityGate({
    root,
    rootMargin,
    threshold,
    observeTab,
    observeOffscreen,
    onChange: sync,
  });

  return {
    start() {
      if (destroyed) return;
      running = true;
      sync();
    },
    stop() {
      running = false;
      stopRaf();
    },
    get isRunning() { return running; },
    get isActive() { return gate.isActive; },
    observe(nextRoot?: RafRoot) {
      gate.observe(nextRoot);
      sync();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      running = false;
      stopRaf();
      gate.destroy();
    },
  };
}
/* ---- end inlined helper ---- */

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

const vertexShader = `
 varying vec2 vUv;
 void main() {
   vUv = uv;
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;

const fragmentShader = `
 uniform vec2 uResolution;
 uniform vec2 uMouse;
 uniform float uParallaxStrength;
 uniform float uDistortionMultiplier;
 uniform float uGlassStrength;
 uniform float uStripesFrequency;
 uniform float uGlassSmoothness;
 uniform float uEdgePadding;

 uniform float uTime;
 uniform float uSpeed;
 uniform float uGlow;
 uniform float uTheme;

 varying vec2 vUv;

 vec3 palette(float t, float theme) {
     vec3 darkColor1 = vec3(0.1, 0.2, 0.5);
     vec3 darkColor2 = vec3(0.8, 0.4, 0.9);
     
     vec3 lightColor1 = vec3(0.6, 0.75, 1.0);
     vec3 lightColor2 = vec3(0.95, 0.75, 1.0);
     
     vec3 c1 = mix(darkColor1, lightColor1, theme);
     vec3 c2 = mix(darkColor2, lightColor2, theme);
     
     return mix(c1, c2, 0.5 + 0.5 * sin(t));
 }

 float wave(vec2 uv, float freq, float phase) {
     return 0.4 * sin(uv.x * freq + uTime * uSpeed + phase);
 }

 float glow(float d, float strength) {
     return exp(-d * d * strength);
 }

 float displacement(float x, float num_stripes, float strength) {
   float modulus = 1.0 / num_stripes;
   return mod(x, modulus) * strength;
 }

 float fractalGlass(float x) {
   float stripeWidth = 1.0 / uStripesFrequency;
   float sampleStep = uGlassSmoothness * stripeWidth;
   float d = 0.0;
   for (int i = -5; i <= 5; i++) {
     d += displacement(x + float(i) * sampleStep, uStripesFrequency, uGlassStrength);
   }
   d = d / 11.0;
   return x + d;
 }

 float smoothEdge(float x, float padding) {
   float edge = padding;
   if (x < edge) {
     return smoothstep(0.0, edge, x);
   } else if (x > 1.0 - edge) {
     return smoothstep(1.0, 1.0 - edge, x);
   }
   return 1.0;
 }

 void main() {
   vec2 uv = vUv;
   float originalX = uv.x;
   float edgeFactor = smoothEdge(originalX, uEdgePadding);
   float distortedX = fractalGlass(originalX);
   uv.x = mix(originalX, distortedX, edgeFactor);
   float distortionFactor = uv.x - originalX;
   float parallaxDirection = -sign(0.5 - uMouse.x);
   vec2 parallaxOffset = vec2(
     parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength * (1.0 + abs(distortionFactor) * uDistortionMultiplier),
     0.0
   );
   parallaxOffset *= edgeFactor;
   uv += parallaxOffset;

   // Aurora logic using the distorted uv
   vec2 auroraUV = uv * 2.0 - 1.0;
   auroraUV.x *= uResolution.x / uResolution.y;

   float y = auroraUV.y;
   float w1 = wave(auroraUV, 3.0, 0.0);
   float w2 = wave(auroraUV, 5.0, 1.0);
   float w3 = wave(auroraUV, 7.0, 2.5);

   float waveLine = w1 + w2 * 0.6 + w3 * 0.4;
   float dist = abs(y - waveLine);
   float g = glow(dist, uGlow);

   vec3 col = palette(waveLine + y, uTheme);
   vec3 bg = mix(vec3(0.02, 0.02, 0.05), vec3(1.0), uTheme);
   float intensity = mix(1.5, 1.2, uTheme);
   col = mix(bg, col, g * intensity);

   gl_FragColor = vec4(col, 1.0);
 }
`;

interface FractalGlassProps {
  speed?: number
  glow?: number
  theme?: "dark" | "light"
  bgColor?: string
  stripesFrequency?: number
  glassStrength?: number
  glassSmoothness?: number
  parallaxStrength?: number
  distortionMultiplier?: number
  edgePadding?: number
}
export default function FractalGlass({
  speed = 1.0,
  glow = 4.0,
  theme = "dark",
  bgColor,
  stripesFrequency = 40,
  glassStrength = 2.0,
  glassSmoothness = 0.014,
  parallaxStrength = 0.15,
  distortionMultiplier = 8.0,
  edgePadding = 0.12,
}: FractalGlassProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const uniformsRef = useRef<any>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const isMobile = window.innerWidth < 768;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: "low-power",
      alpha: false,
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const actualStripes = isMobile ? Math.max(10, Math.floor(stripesFrequency / 3)) : stripesFrequency;

    const uniforms = {
      uResolution: { value: new THREE.Vector2(W, H) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uParallaxStrength: { value: parallaxStrength },
      uDistortionMultiplier: { value: distortionMultiplier },
      uGlassStrength: { value: glassStrength },
      uStripesFrequency: { value: actualStripes },
      uGlassSmoothness: { value: glassSmoothness },
      uEdgePadding: { value: edgePadding },
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uGlow: { value: glow },
      uTheme: { value: theme === "light" ? 1.0 : 0.0 },
    };
    uniformsRef.current = uniforms;

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    scene.add(new THREE.Mesh(geo, mat));

    const target = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };

    const setTarget = (x: number, y: number) => {
      target.x = x / window.innerWidth;
      target.y = 1 - y / window.innerHeight;
    };
    const onMouse = (e: MouseEvent) => setTarget(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => setTarget(e.touches[0].clientX, e.touches[0].clientY);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    // Debounced resize to avoid layout thrashing
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h);
        uniforms.uResolution.value.set(w, h);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const start = performance.now();
    // 30fps on mobile, ~60fps on desktop
    const frameInterval = isMobile ? 1000 / 30 : 1000 / 60;
    let lastFrameTime = 0;

    const loop = createSuspendedRaf({
      root: el,
      onFrame: (time: number) => {
        if (time - lastFrameTime < frameInterval) return;
        lastFrameTime = time;
        current.x += (target.x - current.x) * 0.04;
        current.y += (target.y - current.y) * 0.04;
        uniforms.uMouse.value.set(current.x, current.y);
        uniforms.uTime.value = (performance.now() - start) / 1000;
        renderer.render(scene, camera);
      },
    });
    loop.start();

    return () => {
      uniformsRef.current = null;
      loop.destroy();
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mat.dispose();
      geo.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []); // Run only once on mount

  useEffect(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uSpeed.value = speed;
      uniformsRef.current.uGlow.value = glow;
      uniformsRef.current.uTheme.value = theme === "light" ? 1.0 : 0.0;
      uniformsRef.current.uGlassStrength.value = glassStrength;
      uniformsRef.current.uGlassSmoothness.value = glassSmoothness;
      uniformsRef.current.uParallaxStrength.value = parallaxStrength;
      uniformsRef.current.uDistortionMultiplier.value = distortionMultiplier;
      uniformsRef.current.uEdgePadding.value = edgePadding;

      const isMobile = window.innerWidth < 768;
      const actualStripes = isMobile ? Math.max(10, Math.floor(stripesFrequency / 3)) : stripesFrequency;
      uniformsRef.current.uStripesFrequency.value = actualStripes;
    }
  }, [speed, glow, theme, stripesFrequency, glassStrength, glassSmoothness, parallaxStrength, distortionMultiplier, edgePadding]);

  return (
    <div
      ref={mountRef}
      className={bgColor ? undefined : "bg-background"}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...(bgColor ? { background: bgColor } : null),
      }}
    >

    </div>
  );
}
