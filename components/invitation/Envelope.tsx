"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const Florals = ({ className = "" }: { className?: string }) => (
  <svg className={`env-floral ${className}`} viewBox="0 0 120 120" aria-hidden>
    <g fill="none" stroke="#B98A45" strokeWidth=".6" opacity=".8">
      <path d="M60 118C58 80 62 50 60 20" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse key={a} cx="60" cy="38" rx="6" ry="17" transform={`rotate(${a} 60 44)`} fill="#F2D9CF" fillOpacity=".7" />
      ))}
      <circle cx="60" cy="44" r="4" fill="#E8C98D" />
      <path d="M60 90C44 84 36 74 32 62M60 76C76 70 84 60 88 48" />
    </g>
  </svg>
);

function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <div className="env-stage">
      <motion.div className="env-wrap" animate={opening ? { scale: 1.9, y: "8%" } : { scale: 1 }} transition={{ delay: 2.6, duration: 2.4, ease: [0.65, 0, 0.35, 1] }}>
        <div className="env-body">
          <div className="env-grain" />
          <motion.div className="env-card" animate={opening ? { y: "-46%" } : { y: 0 }} transition={{ delay: 2.2, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}>
            <span>H ✦ I</span>
          </motion.div>
          <motion.div className="env-glow" initial={{ opacity: 0 }} animate={opening ? { opacity: 1, scale: 1.6 } : {}} transition={{ delay: 1.3, duration: 2.2 }} />
          {opening && <div className="env-rays" />}
          <div className="env-front">
            <div className="env-fold env-fold-l" /><div className="env-fold env-fold-r" /><div className="env-fold env-fold-b" />
            <Florals className="fl-left" /><Florals className="fl-right" /><Florals className="fl-bottom" />
          </div>
          <motion.div className="env-flap" animate={opening ? { rotateX: -178 } : { rotateX: 0 }} transition={{ delay: 0.9, duration: 1.7, ease: [0.45, 0, 0.2, 1] }}>
            <Florals className="fl-top" />
          </motion.div>
          <motion.button
            className="env-seal" aria-label="Open invitation" onClick={onOpen}
            animate={opening ? { y: -8, scale: 1.08, opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <span className="seal-shine" />
            <span className="seal-mono">H ✦ I</span>
          </motion.button>
        </div>
      </motion.div>
      <motion.p className="env-cue" animate={{ opacity: opening ? 0 : 1 }}>Tap to Open</motion.p>
    </div>
  );
}
export default memo(Envelope);