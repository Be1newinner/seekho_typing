"use client";

import { motion } from "framer-motion";

export type MascotState = "idle" | "focused" | "happy" | "thinking" | "sad";

interface GameMascotProps {
  state?: MascotState;
  className?: string;
}

export function GameMascot({ state = "idle", className = "" }: GameMascotProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Robot Head */}
      <motion.div
        animate={{
          y: state === "happy" ? [0, -10, 0] : [0, -5, 0],
          rotate: state === "thinking" ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        className="relative w-24 h-24 game-glass rounded-2xl flex items-center justify-center overflow-hidden"
      >
        {/* Face Screen */}
        <div className="absolute inset-2 bg-black rounded-lg flex flex-col items-center justify-center gap-2">
          {/* Eyes */}
          <div className="flex gap-4">
            <motion.div
              animate={{
                scaleY: state === "focused" ? 0.3 : [1, 1, 0.1, 1],
                height: state === "sad" ? 4 : 12,
              }}
              transition={{
                duration: state === "focused" ? 0.2 : 4,
                repeat: state === "focused" ? 0 : Infinity,
              }}
              className="w-4 h-3 bg-game-cyan rounded-full shadow-[0_0_10px_var(--game-neon-cyan)]"
            />
            <motion.div
              animate={{
                scaleY: state === "focused" ? 0.3 : [1, 1, 0.1, 1],
                height: state === "sad" ? 4 : 12,
              }}
              transition={{
                duration: state === "focused" ? 0.2 : 4,
                repeat: state === "focused" ? 0 : Infinity,
              }}
              className="w-4 h-3 bg-game-cyan rounded-full shadow-[0_0_10px_var(--game-neon-cyan)]"
            />
          </div>

          {/* Mouth / Communication Light */}
          <motion.div
            animate={{
              width: state === "happy" ? 24 : state === "sad" ? 12 : 16,
              height: state === "happy" ? 8 : 4,
              borderRadius: state === "happy" ? "0 0 100px 100px" : "2px",
            }}
            className="w-4 h-1 bg-game-cyan shadow-[0_0_8px_var(--game-neon-cyan)]"
          />
        </div>

        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 w-full animate-scanline opacity-30" />
      </motion.div>

      {/* Antenna */}
      <div className="absolute -top-4 w-1 h-4 bg-gray-400">
        <motion.div
          animate={{
            backgroundColor: state === "happy" ? "var(--game-neon-green)" : state === "sad" ? "var(--game-neon-red)" : "var(--game-neon-cyan)",
            boxShadow:
              state === "happy"
                ? "0 0 10px var(--game-neon-green)"
                : state === "sad"
                ? "0 0 10px var(--game-neon-red)"
                : "0 0 10px var(--game-neon-cyan)",
          }}
          className="w-3 h-3 rounded-full -top-3 -left-1 absolute"
        />
      </div>

      {/* Status indicator bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        key={state}
        className="absolute -right-12 top-0 px-3 py-1 game-glass rounded-full text-[10px] font-black text-game-cyan uppercase tracking-wider"
      >
        {state === "idle" && "Standby"}
        {state === "focused" && "Analyzing"}
        {state === "happy" && "Amazing!"}
        {state === "thinking" && "Hold on..."}
        {state === "sad" && "Oops!"}
      </motion.div>
    </div>
  );
}
