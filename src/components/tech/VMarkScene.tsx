"use client";

/**
 * Spec 5 — the 3D V-mark hero object.
 *
 * PROVISIONAL. The spec marks this section "CONCEPT ONLY, NOT FINALIZED" and
 * lists four things to settle before build. Three are now settled in code and
 * are cheap to reverse; the fourth was answered by the artwork itself:
 *
 *   1. V-mark geometry  — read from public/VB-01.svg. It is a single solid
 *      triangular wedge, NOT two intersecting strokes. See v-mark-geometry.ts.
 *   2. Eyes in/out      — OUT. Non-goal 2 forbids cartoon facial features and
 *      the spec itself says the treatment "pulls toward mascot territory".
 *      Reversible: it would be an additive layer on <Shards />, nothing here
 *      is shaped around its absence.
 *   3. Transition trigger — the audience selection in 4.2, via the shared
 *      track store. Spec 4.2 already wants that selection to drive 4.3, so
 *      driving the hero from the same value keeps one source of truth.
 *   4. Mobile fallback  — VMarkFallback.tsx (static, no WebGL). Chosen by the
 *      parent, which never mounts this component on small/low-power devices.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  LEFT_BLADE,
  RIGHT_BLADE,
  BLADE_DEPTH,
  BLOCK,
  buildLeftShards,
  centroid,
  type Pt,
} from "./v-mark-geometry";
import { useTechTrackStore } from "@/store/tech-track-store";

const OBSIDIAN = "#18181c";
const RIM = "#2997ff"; // brand accent (dark mode) — spec 3

/** Build an extruded, lightly bevelled solid from a 2D polygon. */
function buildExtruded(points: Pt[]) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: BLADE_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 1,
  });
  // Centre the depth so the mark rotates about its own middle.
  geo.translate(0, 0, -BLADE_DEPTH / 2);
  geo.computeVertexNormals();
  return geo;
}

function useExtruded(points: Pt[]) {
  return useMemo(() => buildExtruded(points), [points]);
}

function obsidianMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: OBSIDIAN,
    metalness: 0.5,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    reflectivity: 0.8,
  });
}

/** A single static blade. */
function Blade({ points, opacity }: { points: Pt[]; opacity: React.RefObject<number> }) {
  const geo = useExtruded(points);
  const mat = useMemo(() => obsidianMaterial(), []);
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const m = ref.current.material as THREE.MeshPhysicalMaterial;
    const target = opacity.current;
    if (m.opacity !== target) {
      m.opacity = target;
      m.transparent = target < 0.999;
      m.needsUpdate = false;
    }
    ref.current.visible = target > 0.001;
  });

  return <mesh ref={ref} geometry={geo} material={mat} />;
}

/**
 * "Personal brands" state: the left blade comes apart into loose shards.
 * Each shard drifts along the vector from the blade's centre through its own
 * centroid, so the break reads as organic rather than an exploded diagram.
 */
function Shards({ amount }: { amount: React.RefObject<number> }) {
  const shards = useMemo(() => buildLeftShards(6), []);
  const bladeCenter = useMemo(() => centroid(LEFT_BLADE), []);

  const geos = useMemo(() => shards.map(buildExtruded), [shards]);
  const mat = useMemo(() => obsidianMaterial(), []);
  const group = useRef<THREE.Group>(null);

  // Deterministic per-shard drift — no Math.random, so SSR and client agree
  // and the motion is identical on every load.
  const drift = useMemo(
    () =>
      shards.map((s, i) => {
        const c = centroid(s);
        const dx = c[0] - bladeCenter[0];
        const dy = c[1] - bladeCenter[1];
        const len = Math.hypot(dx, dy) || 1;
        const spread = 0.18 + i * 0.05;
        return {
          x: (dx / len) * spread - 0.06 * i,
          y: (dy / len) * spread,
          z: Math.sin(i * 1.7) * 0.14,
          rx: Math.sin(i * 2.1) * 0.5,
          ry: Math.cos(i * 1.3) * 0.6,
          rz: Math.sin(i * 0.9) * 0.35,
        };
      }),
    [shards, bladeCenter]
  );

  useFrame(() => {
    if (!group.current) return;
    const a = amount.current;
    group.current.children.forEach((child, i) => {
      const d = drift[i];
      if (!d) return;
      child.position.set(d.x * a, d.y * a, d.z * a);
      child.rotation.set(d.rx * a, d.ry * a, d.rz * a);
    });
  });

  return (
    <group ref={group}>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} material={mat} />
      ))}
    </group>
  );
}

/**
 * "Businesses" state: the right blade squares up into a clean architectural
 * block. Crossfaded with a matching scale so it reads as the same mass
 * resolving, not a different object appearing.
 */
function Block({ amount }: { amount: React.RefObject<number> }) {
  const mat = useMemo(() => obsidianMaterial(), []);
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const a = amount.current;
    const m = ref.current.material as THREE.MeshPhysicalMaterial;
    m.opacity = a;
    m.transparent = a < 0.999;
    ref.current.visible = a > 0.001;
    const s = 0.9 + 0.1 * a;
    ref.current.scale.set(s, s, s);
  });

  return (
    <mesh
      ref={ref}
      material={mat}
      position={[BLOCK.center[0], BLOCK.center[1], 0]}
      visible={false}
    >
      <boxGeometry args={[BLOCK.width * 0.86, BLOCK.height * 0.92, BLOCK.depth]} />
    </mesh>
  );
}

function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const track = useTechTrackStore((s) => s.track);
  const group = useRef<THREE.Group>(null);

  // Animated 0..1 amounts, damped toward their targets in useFrame so state
  // changes ease rather than snap.
  const businessAmt = useRef(0);
  const personalAmt = useRef(0);
  const rightOpacity = useRef(1);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const k = 1 - Math.pow(0.001, d); // frame-rate independent damping

    const bTarget = track === "business" ? 1 : 0;
    const pTarget = track === "personal" ? 1 : 0;

    businessAmt.current += (bTarget - businessAmt.current) * k;
    personalAmt.current += (pTarget - personalAmt.current) * k;

    // The right blade fades out exactly as the block fades in. The left blade
    // needs no fade — its shards ARE the blade when personalAmt is 0.
    rightOpacity.current = 1 - businessAmt.current;

    if (!group.current) return;
    if (reducedMotion) {
      group.current.rotation.set(0, -0.32, 0);
      return;
    }
    // Idle: a slow, shallow drift. Deliberately not a full spin — spec 3 asks
    // for subtle micro-animation, and non-goal 4 rules out portfolio-style
    // free-roam camera work.
    const t = state.clock.elapsedTime;
    group.current.rotation.y = -0.32 + Math.sin(t * 0.28) * 0.22;
    group.current.rotation.x = Math.sin(t * 0.21) * 0.075;
    group.current.position.y = Math.sin(t * 0.5) * 0.035;
  });

  return (
    <group ref={group} scale={1.32}>
      {/* Left blade — at rest the shards tile it exactly; on "personal
          brands" they separate into fragments. */}
      <Shards amount={personalAmt} />
      {/* Right blade — solidifies into the block on "businesses". */}
      <Blade points={RIGHT_BLADE} opacity={rightOpacity} />
      <Block amount={businessAmt} />
    </group>
  );
}

export default function VMarkScene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      // Clamp DPR: a retina phone at dpr 3 quadruples fragment cost for no
      // visible gain on a matte object.
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.4], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ pointerEvents: "none" }}
      // The hero copy and CTA must be reachable; the canvas never takes input.
      aria-hidden="true"
    >
      {/* Deep ambient so the black reads as material, not a silhouette. */}
      <ambientLight intensity={3.5} />
      {/* Key — cool white, high and to the left. */}
      <directionalLight position={[-3, 4, 3]} intensity={10.0} color="#ffffff" />
      {/* Direct front light for clear visibility and specular shine. */}
      <directionalLight position={[0, 0, 5]} intensity={8.0} color="#ffffff" />
      {/* Rim lights in the brand blue along the inner edges (spec 5). */}
      <pointLight position={[2.4, -1.2, 1.4]} intensity={80} color={RIM} distance={15} />
      <pointLight position={[-2.2, 1.6, -1.8]} intensity={75} color={RIM} distance={15} />
      {/* A touch of warm bounce so the obsidian isn't monochrome-flat. */}
      <pointLight position={[0, -2.4, 2]} intensity={40} color="#ffffff" distance={10} />
      <Rig reducedMotion={reducedMotion} />
    </Canvas>
  );
}
