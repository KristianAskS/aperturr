"use client"

import { motion } from "framer-motion"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    // prettier‑ignore
    d: `M-${380 - i * 5 * position} -${189 + i * 6}
        C-${380 - i * 5 * position} -${189 + i * 6}
        -${312 - i * 5 * position} ${216 - i * 6}
        ${152 - i * 5 * position} ${343 - i * 6}
        C${616 - i * 5 * position} ${470 - i * 6}
        ${684 - i * 5 * position} ${875 - i * 6}
        ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden select-none pointer-events-none">
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        {paths.map(({ id, d, width }) => (
          <motion.path
            key={id}
            d={d}
            stroke="currentColor"
            strokeWidth={width}
            strokeOpacity={0.1 + id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function BackgroundPaths({ title = "Background Paths" }: { title?: string }) {
  const words = title.split(" ")

  return (
    <div className="absolute inset-0 overflow-hidden select-none">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      {/* optional animated title ‑ hidden for accessibility only */}
      <div className="sr-only">
        {words.map((w) => (
          <span key={w}>{w} </span>
        ))}
      </div>
    </div>
  )
}