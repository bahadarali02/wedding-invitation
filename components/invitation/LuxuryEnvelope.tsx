"use client";

import { motion } from "framer-motion";

type Props = {
  opening: boolean;
  onOpen: () => void;
};

function EmbossBouquet({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 260"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="emboss"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="1.2"
            result="blur"
          />

          <feOffset
            dx="-1.5"
            dy="-1.5"
            result="highlight"
          />

          <feFlood
            floodColor="#fffdf9"
            floodOpacity="0.95"
            result="highlightColor"
          />

          <feComposite
            in="highlightColor"
            in2="highlight"
            operator="in"
            result="highlightComposite"
          />

          <feOffset
            dx="1.5"
            dy="1.5"
            result="shadow"
          />

          <feFlood
            floodColor="#b98b70"
            floodOpacity="0.34"
            result="shadowColor"
          />

          <feComposite
            in="shadowColor"
            in2="shadow"
            operator="in"
            result="shadowComposite"
          />

          <feMerge>
            <feMergeNode in="shadowComposite" />
            <feMergeNode in="highlightComposite" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        filter="url(#emboss)"
        fill="none"
        stroke="#e5cfc1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M160 222C158 186 159 147 160 108" />
        <path d="M160 168C130 153 104 130 87 100" />
        <path d="M160 160C190 148 216 125 233 94" />

        <path d="M117 145C97 134 86 116 83 97" />
        <path d="M203 140C224 127 234 108 237 88" />

        <path d="M137 187C117 181 98 170 85 155" />
        <path d="M182 187C202 181 221 170 235 154" />

        {[
          [112, 131, -28],
          [92, 111, -32],
          [78, 91, -36],
          [130, 176, -24],
          [104, 163, -22],
          [208, 128, 28],
          [229, 108, 31],
          [243, 88, 36],
          [191, 174, 23],
          [217, 161, 20],
        ].map(([x, y, r], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="18"
            ry="7"
            transform={`rotate(${r} ${x} ${y})`}
          />
        ))}

        {/* flower */}
        <path d="M160 105C145 92 143 77 151 66C162 72 168 87 160 105Z" />
        <path d="M160 105C175 92 177 77 169 66C158 72 152 87 160 105Z" />
        <path d="M160 108C141 110 127 100 127 87C141 85 154 92 160 108Z" />
        <path d="M160 108C179 110 193 100 193 87C179 85 166 92 160 108Z" />
        <path d="M160 109C148 125 133 130 122 121C130 108 144 103 160 109Z" />
        <path d="M160 109C172 125 187 130 198 121C190 108 176 103 160 109Z" />

        <circle cx="160" cy="108" r="15" />
        <circle cx="160" cy="108" r="7" />

        <circle cx="84" cy="99" r="5" />
        <circle cx="236" cy="93" r="5" />
      </g>
    </svg>
  );
}

function SideVine({
  mirror = false,
}: {
  mirror?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 420"
      className={mirror ? "-scale-x-100" : ""}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="sideEmboss"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation="0.9"
            result="blur"
          />
          <feOffset
            dx="-1"
            dy="-1"
            result="h"
          />
          <feOffset
            dx="1"
            dy="1"
            result="s"
          />

          <feFlood
            floodColor="#fffdf9"
            floodOpacity=".9"
            result="hc"
          />

          <feFlood
            floodColor="#b98b70"
            floodOpacity=".28"
            result="sc"
          />

          <feComposite
            in="hc"
            in2="h"
            operator="in"
            result="hc2"
          />

          <feComposite
            in="sc"
            in2="s"
            operator="in"
            result="sc2"
          />

          <feMerge>
            <feMergeNode in="sc2" />
            <feMergeNode in="hc2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        filter="url(#sideEmboss)"
        fill="none"
        stroke="#e2c9ba"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M61 397C57 344 59 292 63 241C66 191 62 145 59 97C57 65 63 37 79 18" />

        {[
          [61, 345, -18],
          [58, 315, 24],
          [63, 280, -25],
          [58, 245, 23],
          [63, 210, -24],
          [58, 176, 24],
          [62, 142, -24],
          [60, 108, 24],
          [68, 74, -18],
        ].map(([x, y, r], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="15"
            ry="6"
            transform={`rotate(${r} ${x} ${y})`}
          />
        ))}

        {[330, 260, 190, 120, 53].map((y) => (
          <g key={y}>
            <circle cx="61" cy={y} r="5.5" />
            <path d={`M61 ${y - 12}C55 ${y - 8} 55 ${y - 2} 61 ${y}`} />
            <path d={`M73 ${y}C69 ${y - 6} 63 ${y - 6} 61 ${y}`} />
            <path d={`M61 ${y + 12}C67 ${y + 8} 67 ${y + 2} 61 ${y}`} />
            <path d={`M49 ${y}C53 ${y + 6} 59 ${y + 6} 61 ${y}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function LuxuryEnvelope({
  opening,
  onOpen,
}: Props) {
  return (
    <div className="premium-envelope-stage">

      {/* inner golden illumination */}
      <motion.div
        className="premium-inner-glow"
        animate={
          opening
            ? {
                opacity: [0, 0.3, 1, 0.88],
                scale: [0.35, 0.65, 1.35, 2.2],
              }
            : {
                opacity: 0,
                scale: 0.35,
              }
        }
        transition={{
          delay: 0.42,
          duration: 1.7,
          ease: "easeOut",
        }}
      />

      {/* light rays */}
      {opening &&
        Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            className="premium-ray"
            initial={{
              opacity: 0,
              scaleY: 0.1,
            }}
            animate={{
              opacity: [0, 0.55, 0],
              scaleY: [0.1, 1, 1.15],
            }}
            transition={{
              delay: 0.62 + i * 0.012,
              duration: 1.25,
            }}
            style={{
              transform: `translate(-50%,-100%) rotate(${i * 18}deg)`,
            }}
          />
        ))}

      {/* card inside */}
      <motion.div
        className="premium-inner-card"
        animate={
          opening
            ? {
                y: -245,
                opacity: 1,
                scale: 1,
              }
            : {
                y: 80,
                opacity: 0,
                scale: 0.9,
              }
        }
        transition={{
          delay: 0.8,
          duration: 1.45,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="premium-card-arch" />

        <div className="premium-card-copy">
          <span className="premium-kicker">
            Wedding Celebrations
          </span>

          <span className="premium-name">
            Dr Haider Ali
          </span>

          <span className="premium-weds">
            Weds
          </span>

          <span className="premium-name">
            Sidra Noureen
          </span>

          <span className="premium-separator">
            <i />
            <b>✦</b>
            <i />
          </span>

          <span className="premium-name premium-name-small">
            Iqra Asghar
          </span>

          <span className="premium-weds">
            Weds
          </span>

          <span className="premium-name premium-name-small">
            M Zunair
          </span>
        </div>
      </motion.div>

      {/* envelope back */}
      <div className="premium-envelope-back" />

      {/* opening underside */}
      <motion.div
        className="premium-flap-under"
        animate={{
          opacity: opening ? 1 : 0,
        }}
        transition={{
          delay: 0.35,
          duration: 0.5,
        }}
      >
        <EmbossBouquet className="under-floral" />
      </motion.div>

      {/* left fold */}
      <motion.div
        className="premium-fold premium-left"
        animate={
          opening
            ? {
                x: -13,
                rotateY: 7,
              }
            : {
                x: 0,
                rotateY: 0,
              }
        }
        transition={{
          delay: 0.6,
          duration: 1.15,
        }}
      >
        <div className="vine-left">
          <SideVine />
        </div>
      </motion.div>

      {/* right fold */}
      <motion.div
        className="premium-fold premium-right"
        animate={
          opening
            ? {
                x: 13,
                rotateY: -7,
              }
            : {
                x: 0,
                rotateY: 0,
              }
        }
        transition={{
          delay: 0.6,
          duration: 1.15,
        }}
      >
        <div className="vine-right">
          <SideVine mirror />
        </div>
      </motion.div>

      {/* bottom fold */}
      <motion.div
        className="premium-fold premium-bottom"
        animate={{
          y: opening ? 9 : 0,
        }}
        transition={{
          delay: 0.56,
          duration: 1.15,
        }}
      >
        <EmbossBouquet className="bottom-bouquet" />
      </motion.div>

      {/* top flap */}
      <motion.div
        className="premium-top-flap"
        animate={{
          rotateX: opening ? -178 : 0,
        }}
        transition={{
          delay: 0.18,
          duration: 1.18,
          ease: [0.22, 0.82, 0.22, 1],
        }}
      >
        <EmbossBouquet className="top-bouquet" />
      </motion.div>

      {/* wax seal */}
      <motion.button
        type="button"
        aria-label="Open invitation"
        onClick={onOpen}
        disabled={opening}
        className="premium-wax"
        animate={
          opening
            ? {
                scale: [1, 1.06, 1.13, 0.3],
                rotate: [0, -2, 5, 16],
                opacity: [1, 1, 0.9, 0],
                y: [0, -2, -5, 16],
              }
            : {
                scale: [1, 1.012, 1],
              }
        }
        transition={
          opening
            ? {
                duration: 0.8,
                times: [0, 0.3, 0.55, 1],
              }
            : {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <span className="premium-wax-inner" />

        <span className="premium-monogram">
          H
          <small>✦</small>
          I
        </span>
      </motion.button>

      {/* particles */}
      {opening &&
        Array.from({ length: 30 }).map((_, i) => {
          const angle = i * 0.78;
          const distance =
            70 + (i % 7) * 27;

          return (
            <motion.span
              key={i}
              className="premium-particle"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                delay: 0.62 + (i % 5) * 0.025,
                duration: 1.3,
              }}
            />
          );
        })}
    </div>
  );
}