"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  size?: number;
  opacity?: number;
  sizeAttenuation?: boolean;
  vertexColors?: boolean;
  themeOverride?: "dark" | "light";
};

export function DottedSurface({
  className,
  size = 12,
  opacity = 1.0,
  sizeAttenuation = true,
  vertexColors = true,
  themeOverride,
  ...props
}: DottedSurfaceProps) {
  const { theme, resolvedTheme } = useTheme();
  // Provide a reliable fallback if theme is undefined during SSR
  const currentTheme = themeOverride || resolvedTheme || theme || "dark";
  const isDark = currentTheme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set start time once and keep it stable across any fast-refresh or re-renders
    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now();
    }

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(isDark ? 0x000000 : 0xffffff, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    // Moved camera further back (Z: 1800) and slightly higher (Y: 450) to zoom out
    camera.position.set(0, 900, 4000);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);

    // Completely clear any stale/frozen canvases left behind by Next.js hot reloads!
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const positions: number[] = [];
    const colors: number[] = [];

    // Create geometry for all particles
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0; // Will be animated
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions.push(x, y, z);

        // Colors should be normalized between 0 and 1 for Float32BufferAttribute
        if (isDark) {
          colors.push(0.8, 0.8, 0.8);
        } else {
          colors.push(0.1, 0.1, 0.1);
        }
      }
    }

    const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", positionAttribute);
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
      size,
      vertexColors,
      color: vertexColors ? 0xffffff : isDark ? 0xc8c8c8 : 0x000000,
      transparent: true,
      opacity,
      sizeAttenuation,
    });

    // Create points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (event: PointerEvent) => {
      mouseX = event.clientX - window.innerWidth / 2;
      mouseY = event.clientY - window.innerHeight / 2;
    };
    window.addEventListener("pointermove", onPointerMove);

    // Animation function
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTimeRef.current) * 0.001;

      // Restored gentle mouse sway mixed with a very subtle automatic drift
      const baseSway = Math.sin(elapsed * 0.2) * 50;
      camera.position.x += ((mouseX * 0.1 + baseSway) - camera.position.x) * 0.05;
      const targetY = Math.max(100, Math.min(800, 450 + (-mouseY * 0.5)));
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Robust JS buffer update using the official setY accessor
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const newY = Math.sin((ix + elapsed * 3) * 0.3) * 100 + Math.sin((iy + elapsed * 2) * 0.5) * 100;
          positionAttribute.setY(i, newY);
          i++;
        }
      }

      // Explicitly mark the attribute for update
      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);

      cancelAnimationFrame(animationFrameId);

      // Clean up Three.js objects to prevent memory leaks
      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // ignore if already removed
        }
      }
    };
  }, [isDark, size, opacity, sizeAttenuation, vertexColors]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
      {...props}
    />
  );
}

export default DottedSurface;
