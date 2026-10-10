"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import type { Mapped } from "@/app/i/[token]/invitation-client";

/* =========================================================
   PERFORMANCE NOTES

   Optimized for mobile:
   - removed scroll-linked Framer Motion calculations
   - removed duplicate reflected Skyline SVG
   - reduced particles 28 -> 12
   - lantern swing handled by CSS instead of Framer Motion
   - removed expensive blur filters from entrance animation
   - reduced decorative SVG node count
   - preserved existing CSS class names / visual structure
========================================================= */

type P = [number, number];

function bez(
  a: P,
  b: P,
  c: P,
  d: P,
  t: number
): P {
  const u = 1 - t;

  return [
    u * u * u * a[0] +
      3 * u * u * t * b[0] +
      3 * u * t * t * c[0] +
      t * t * t * d[0],

    u * u * u * a[1] +
      3 * u * u * t * b[1] +
      3 * u * t * t * c[1] +
      t * t * t * d[1],
  ];
}

function Leaf({
  x,
  y,
  r,
  s = 1,
}: {
  x: number;
  y: number;
  r: number;
  s?: number;
}) {
  return (
    <path
      d="M0 0C5-8 17-8 24 0C17 8 5 8 0 0ZM2 0H22"
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      fill="url(#hLeaf)"
      stroke="#8a8a58"
      strokeWidth=".45"
      strokeLinejoin="round"
    />
  );
}

function Blossom({
  x,
  y,
  s = 1,
}: {
  x: number;
  y: number;
  s?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
    >
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-4.4"
          rx="2.8"
          ry="4.4"
          transform={`rotate(${a})`}
          fill="#fffaf1"
          stroke="#e6d0a8"
          strokeWidth=".35"
        />
      ))}

      <circle
        r="1.5"
        fill="#dfb262"
      />
    </g>
  );
}

function Rose({
  x,
  y,
  s = 1,
  tone = "blush",
}: {
  x: number;
  y: number;
  s?: number;
  tone?: "blush" | "ivory";
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
    >
      <circle
        r="23"
        fill={
          tone === "blush"
            ? "url(#hRoseB)"
            : "url(#hRoseI)"
        }
        stroke="rgba(188,136,106,.4)"
        strokeWidth=".5"
      />

      {[0, 90, 180, 270].map((a) => (
        <path
          key={a}
          d="M0-6C9-25 23-12 18 3C14 13 2 15-2 8"
          transform={`rotate(${a})`}
          fill="none"
          stroke="rgba(170,114,86,.36)"
          strokeWidth=".7"
          strokeLinecap="round"
        />
      ))}

      <path
        d="M-3 0C-1-6 7-5 6 1C5 8-6 8-8 0C-9-9 4-13 11-6"
        fill="none"
        stroke="rgba(170,114,86,.5)"
        strokeWidth=".8"
        strokeLinecap="round"
      />

      <circle
        r="2.6"
        fill="rgba(222,168,138,.4)"
      />
    </g>
  );
}

function Vine({
  c,
  n,
  k = 1,
}: {
  c: [P, P, P, P];
  n: number;
  k?: number;
}) {
  const items = Array.from(
    { length: n },
    (_, i) => {
      const t =
        (i + 0.6) /
        (n + 0.2);

      const [x, y] =
        bez(
          c[0],
          c[1],
          c[2],
          c[3],
          t
        );

      const [x2, y2] =
        bez(
          c[0],
          c[1],
          c[2],
          c[3],
          Math.min(
            1,
            t + 0.02
          )
        );

      const a =
        (
          Math.atan2(
            y2 - y,
            x2 - x
          ) *
          180
        ) /
        Math.PI;

      return {
        i,

        x:
          Math.round(
            x * 10
          ) / 10,

        y:
          Math.round(
            y * 10
          ) / 10,

        a:
          Math.round(
            a
          ),

        side:
          i % 2
            ? 1
            : -1,
      };
    }
  );

  return (
    <g>
      <path
        d={`M${c[0].join(
          " "
        )}C${c[1].join(
          " "
        )} ${c[2].join(
          " "
        )} ${c[3].join(
          " "
        )}`}
        fill="none"
        stroke="#9a9a6c"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {items.map(
        ({
          i,
          x,
          y,
          a,
          side,
        }) => (
          <g key={i}>
            <Leaf
              x={x}
              y={y}
              r={
                a +
                side * 58
              }
              s={
                k *
                (
                  0.82 +
                  (i % 2) *
                    0.13
                )
              }
            />

            {i % 2 === 0 ? (
              <Blossom
                x={
                  Math.round(
                    (
                      x -
                      side *
                        7 *
                        k
                    ) *
                      10
                  ) /
                  10
                }
                y={
                  Math.round(
                    (
                      y +
                      (
                        i % 2
                          ? 5
                          : -5
                      ) *
                        k
                    ) *
                      10
                  ) /
                  10
                }
                s={
                  k *
                  0.85
                }
              />
            ) : null}
          </g>
        )
      )}
    </g>
  );
}

const HYDRANGEA: P[] = [
  [0, 0],
  [9, -3],
  [-8, -4],
  [3, 9],
  [-6, 8],
];

function Cluster({
  x,
  y,
  s = 1,
}: {
  x: number;
  y: number;
  s?: number;
}) {
  return (
    <g>
      {HYDRANGEA.map(
        (
          [dx, dy],
          i
        ) => (
          <Blossom
            key={i}
            x={
              x +
              dx * s
            }
            y={
              y +
              dy * s
            }
            s={
              s *
              (
                1 +
                (i % 2) *
                  0.08
              )
            }
          />
        )
      )}
    </g>
  );
}


/* =========================================================
   SHARED SVG DEFINITIONS
========================================================= */

function HeroDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{
        position:
          "absolute",
      }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient
          id="hWall"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#f9e9dc"
          />

          <stop
            offset="1"
            stopColor="#f0d6c3"
          />
        </linearGradient>

        <linearGradient
          id="hOpenFill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fffaf0"
            stopOpacity=".92"
          />

          <stop
            offset=".5"
            stopColor="#fff3e0"
            stopOpacity=".3"
          />

          <stop
            offset="1"
            stopColor="#fff3e0"
            stopOpacity="0"
          />
        </linearGradient>

        <linearGradient
          id="hGold"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#f6dfa8"
          />

          <stop
            offset=".5"
            stopColor="#cf9f55"
          />

          <stop
            offset="1"
            stopColor="#a8722f"
          />
        </linearGradient>

        <linearGradient
          id="hLeaf"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0"
            stopColor="#c9c08a"
          />

          <stop
            offset="1"
            stopColor="#8d9760"
          />
        </linearGradient>

        <linearGradient
          id="hMarble"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fffaf0"
          />

          <stop
            offset="1"
            stopColor="#ecd7ba"
          />
        </linearGradient>

        <linearGradient
          id="hGroom"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0"
            stopColor="#f3e6d1"
          />

          <stop
            offset=".45"
            stopColor="#fffaf1"
          />

          <stop
            offset="1"
            stopColor="#e6d1b4"
          />
        </linearGradient>

        <linearGradient
          id="hBride"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#f0cfc4"
          />

          <stop
            offset=".55"
            stopColor="#dca79b"
          />

          <stop
            offset="1"
            stopColor="#c98e7d"
          />
        </linearGradient>

        <linearGradient
          id="hVeil"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0"
            stopColor="#f8e4dd"
            stopOpacity=".9"
          />

          <stop
            offset="1"
            stopColor="#f1d3ca"
            stopOpacity=".35"
          />
        </linearGradient>

        <radialGradient
          id="hLamp"
          cx=".5"
          cy=".5"
          r=".6"
        >
          <stop
            offset="0"
            stopColor="#fffbe0"
          />

          <stop
            offset=".55"
            stopColor="#ffd77f"
          />

          <stop
            offset="1"
            stopColor="#d9953f"
          />
        </radialGradient>

        <radialGradient
          id="hGlow"
          cx=".5"
          cy=".5"
          r=".5"
        >
          <stop
            offset="0"
            stopColor="#ffe3a0"
            stopOpacity=".65"
          />

          <stop
            offset="1"
            stopColor="#ffe3a0"
            stopOpacity="0"
          />
        </radialGradient>

        <radialGradient
          id="hSun"
          cx=".5"
          cy=".5"
          r=".5"
        >
          <stop
            offset="0"
            stopColor="#fff0c4"
            stopOpacity=".9"
          />

          <stop
            offset=".5"
            stopColor="#ffdca0"
            stopOpacity=".45"
          />

          <stop
            offset="1"
            stopColor="#ffdca0"
            stopOpacity="0"
          />
        </radialGradient>

        <radialGradient
          id="hRoseB"
          cx=".4"
          cy=".35"
          r=".7"
        >
          <stop
            offset="0"
            stopColor="#fff0e6"
          />

          <stop
            offset=".6"
            stopColor="#f6cdb8"
          />

          <stop
            offset="1"
            stopColor="#e8aa92"
          />
        </radialGradient>

        <radialGradient
          id="hRoseI"
          cx=".4"
          cy=".35"
          r=".7"
        >
          <stop
            offset="0"
            stopColor="#fffdf6"
          />

          <stop
            offset=".65"
            stopColor="#fbeedb"
          />

          <stop
            offset="1"
            stopColor="#ecd2b0"
          />
        </radialGradient>

        <pattern
          id="hDamask"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M15 4C17 9 21 13 26 15C21 17 17 21 15 26C13 21 9 17 4 15C9 13 13 9 15 4Z"
            fill="none"
            stroke="#d9b887"
            strokeWidth=".5"
            opacity=".32"
          />
        </pattern>
      </defs>
    </svg>
  );
}


/* =========================================================
   MUGHAL ARCH
========================================================= */

const archPath = (
  end: number
) =>
  `M44 ${end}V330C30 318 28 292 48 276C34 262 38 226 66 214C56 196 70 168 98 156C140 140 186 108 215 36C244 108 290 140 332 156C360 168 374 196 364 214C392 226 396 262 382 276C402 292 400 318 386 330V${end}`;

const ARCH_OPEN =
  archPath(
    860
  );

const ARCH_INNER =
  archPath(
    940
  );

const ARCH_WALL =
  `M0 0H430V860H0Z${ARCH_OPEN}Z`;

function HeroArch() {
  const ns = {
    vectorEffect:
      "non-scaling-stroke" as const,
  };

  return (
    <svg
      className="hero-arch-svg"
      viewBox="0 0 430 860"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={ARCH_WALL}
        fillRule="evenodd"
        fill="url(#hWall)"
      />

      <path
        d={ARCH_WALL}
        fillRule="evenodd"
        fill="url(#hDamask)"
      />

      <rect
        x="7"
        y="7"
        width="416"
        height="846"
        fill="none"
        stroke="#d1a35c"
        strokeWidth=".8"
        {...ns}
      />

      <rect
        x="11"
        y="11"
        width="408"
        height="838"
        fill="none"
        stroke="#e6c88c"
        strokeWidth=".55"
        {...ns}
      />

      {/* simplified layered arch:
          same overall look, much fewer expensive paths */}

      <path
        d={ARCH_OPEN}
        fill="none"
        stroke="#f7e8d3"
        strokeWidth="34"
        strokeLinejoin="round"
        {...ns}
      />

      <path
        d={ARCH_OPEN}
        fill="none"
        stroke="#c9984f"
        strokeWidth="3"
        strokeLinejoin="round"
        {...ns}
      />

      <path
        d={ARCH_OPEN}
        fill="none"
        stroke="#e7c78a"
        strokeWidth="16"
        strokeLinejoin="round"
        opacity=".78"
        {...ns}
      />

      <path
        d={ARCH_OPEN}
        fill="none"
        stroke="#fff3df"
        strokeWidth="12"
        strokeLinejoin="round"
        {...ns}
      />

      <path
        d={ARCH_OPEN}
        fill="none"
        stroke="#d2a359"
        strokeWidth="1.3"
        strokeLinejoin="round"
        {...ns}
      />

      <path
        d={`${ARCH_OPEN}Z`}
        fill="url(#hOpenFill)"
      />

      <path
        d={ARCH_INNER}
        fill="none"
        stroke="#e6c587"
        strokeWidth=".75"
        strokeLinejoin="round"
        opacity=".78"
        transform="translate(215 520) scale(.955) translate(-215 -520)"
        {...ns}
      />

      <g
        transform="translate(215 14)"
        fill="none"
        stroke="#b98a45"
        strokeWidth=".8"
      >
        <path
          d="M0 -8C4 -3 4 3 0 8C-4 3-4-3 0-8Z"
          fill="url(#hGold)"
        />

        <path d="M-18 4C-12 -4-6 -2 0 8C6 -2 12 -4 18 4" />

        <circle
          cy="-11"
          r="1.5"
          fill="#d9ab5c"
          stroke="none"
        />
      </g>
    </svg>
  );
}


/* =========================================================
   FLORALS
========================================================= */

function FloralCorner({
  side,
}: {
  side:
    | "left"
    | "right";
}) {
  return (
    <svg
      viewBox="0 0 190 280"
      className={`hero-floral hero-floral-${side}`}
      aria-hidden
    >
      <Vine
        c={[
          [-4, 14],
          [50, 34],
          [112, 18],
          [184, 52],
        ]}
        n={5}
      />

      <Vine
        c={[
          [20, -4],
          [44, 70],
          [6, 150],
          [34, 272],
        ]}
        n={6}
      />

      <Vine
        c={[
          [62, 44],
          [88, 80],
          [104, 126],
          [94, 176],
        ]}
        n={4}
        k={0.9}
      />

      <Cluster
        x={108}
        y={84}
        s={0.9}
      />

      <Cluster
        x={42}
        y={124}
        s={0.9}
      />

      <Rose
        x={60}
        y={30}
        s={0.98}
        tone="ivory"
      />

      <Rose
        x={32}
        y={68}
        s={0.84}
        tone="blush"
      />

      <Rose
        x={100}
        y={58}
        s={0.7}
        tone="ivory"
      />

      <Blossom
        x={130}
        y={30}
        s={1.1}
      />

      <Blossom
        x={20}
        y={102}
        s={1.1}
      />
    </svg>
  );
}


/* =========================================================
   LANTERN
========================================================= */

function HeroLantern({
  len,
  s = 1,
}: {
  len: number;
  s?: number;
}) {
  const w =
    34 * s;

  return (
    <svg
      viewBox={`-20 0 40 ${
        len + 80
      }`}
      width={w}
      height={
        (
          len +
          80
        ) *
        (
          w /
          40
        )
      }
      style={{
        display:
          "block",

        overflow:
          "visible",
      }}
      aria-hidden
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={
          len +
          2
        }
        stroke="#b98a45"
        strokeWidth=".9"
      />

      <g
        transform={`translate(0 ${len})`}
      >
        <circle
          cx="0"
          cy="36"
          r="28"
          fill="url(#hGlow)"
        />

        <circle
          cx="0"
          cy="3"
          r="3"
          fill="none"
          stroke="#b27b35"
          strokeWidth="1"
        />

        <path
          d="M-10 17C-10 9-4 5 0 5C4 5 10 9 10 17Z"
          fill="url(#hGold)"
          stroke="#a9772f"
          strokeWidth=".6"
        />

        <rect
          x="-12.5"
          y="17"
          width="25"
          height="3.5"
          rx="1"
          fill="url(#hGold)"
        />

        <path
          d="M-10 20.5H10L8.5 58H-8.5Z"
          fill="url(#hLamp)"
          stroke="#a9772f"
          strokeWidth=".9"
        />

        <path
          d="M0 30C-3 36-2 42 0 47C2 42 3 36 0 30Z"
          fill="#fff6cf"
          className="hero-flame"
        />

        <path
          d="M-3.5 20.5V58M3.5 20.5V58M-9.6 38H9.6"
          fill="none"
          stroke="#b27d3a"
          strokeWidth=".7"
        />

        <path
          d="M-9 58H9L5 66H-5Z"
          fill="url(#hGold)"
        />
      </g>
    </svg>
  );
}


/* =========================================================
   PALACE
========================================================= */

function HeroMinaret({
  cx,
}: {
  cx: number;
}) {
  return (
    <g
      transform={`translate(${cx} 0)`}
      fill="url(#hMarble)"
      stroke="#d8b57a"
      strokeWidth=".55"
    >
      <path d="M-5.4 800L-4.4 646H4.4L5.4 800Z" />

      <rect
        x="-7.5"
        y="642"
        width="15"
        height="4.5"
        rx="1"
      />

      <path d="M-4 642V606H4V642Z" />

      <rect
        x="-6.5"
        y="602"
        width="13"
        height="4"
        rx="1"
      />

      <path d="M-4.2 602C-4.2 590-1.6 584 0 578C1.6 584 4.2 590 4.2 602Z" />

      <path
        d="M0 662V682M0 706V726M0 748V766"
        stroke="#e0b567"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function Skyline() {
  return (
    <svg
      viewBox="0 0 430 300"
      className="hero-sky"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <g
        transform="translate(0 -504)"
      >
        <ellipse
          cx="215"
          cy="770"
          rx="200"
          ry="120"
          fill="url(#hSun)"
        />

        <circle
          cx="262"
          cy="772"
          r="13"
          fill="#fff6d6"
          opacity=".75"
        />

        <g
          fill="url(#hMarble)"
          stroke="#d8b57a"
          strokeWidth=".55"
          opacity=".92"
        >
          <rect
            x="96"
            y="780"
            width="238"
            height="20"
          />

          <rect
            x="132"
            y="770"
            width="166"
            height="12"
          />

          <rect
            x="192"
            y="752"
            width="46"
            height="48"
          />

          <path d="M188 756C188 722 242 722 242 756Z" />

          <path d="M156 764C156 746 180 746 180 764Z" />

          <path d="M250 764C250 746 274 746 274 764Z" />

          <path d="M130 780C130 768 146 768 146 780Z" />

          <path d="M284 780C284 768 300 768 300 780Z" />
        </g>

        <path
          d="M206 800V782C206 774 224 774 224 782V800Z"
          fill="#ffd88a"
          opacity=".92"
        />

        <HeroMinaret
          cx={80}
        />

        <HeroMinaret
          cx={350}
        />
      </g>
    </svg>
  );
}


/* =========================================================
   COUPLE
========================================================= */

function Couple({
  src,
}: {
  src:
    | string
    | null;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="hero-couple-img"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    );
  }

  return (
    <svg
      viewBox="30 20 200 370"
      className="hero-couple"
      aria-hidden
    >
      <ellipse
        cx="132"
        cy="372"
        rx="88"
        ry="8"
        fill="#a97742"
        opacity=".2"
      />

      {/* Bride */}

      <path
        d="M130 60C120 36 180 28 176 64C190 120 196 250 214 372H100C120 270 124 130 130 60Z"
        fill="url(#hVeil)"
      />

      <path
        d="M128 94C136 84 164 84 172 94L170 152H130Z"
        fill="url(#hBride)"
        stroke="#c99767"
        strokeWidth=".8"
      />

      <path
        d="M130 150L170 150C176 230 214 300 214 372H100C100 300 124 230 130 150Z"
        fill="url(#hBride)"
        stroke="#c99767"
        strokeWidth=".9"
      />

      <ellipse
        cx="150"
        cy="62"
        rx="14"
        ry="15"
        fill="#2f211c"
      />

      <circle
        cx="150"
        cy="49"
        r="6.5"
        fill="#2f211c"
      />

      {/* Groom */}

      <path
        d="M56 104C56 90 68 84 84 84C100 84 112 90 112 104L118 250L116 372H52L50 250Z"
        fill="url(#hGroom)"
        stroke="#cda766"
        strokeWidth=".9"
      />

      <path
        d="M84 90V324"
        stroke="#bd8d4b"
        strokeWidth=".7"
        opacity=".55"
      />

      <circle
        cx="84"
        cy="62"
        r="14"
        fill="#2c1f1a"
      />
    </svg>
  );
}


/* =========================================================
   DIVIDER
========================================================= */

function HeroDivider() {
  return (
    <svg
      className="hero-divider"
      viewBox="0 0 240 14"
      aria-hidden
    >
      <g
        fill="none"
        stroke="#c9984f"
        strokeWidth=".8"
        strokeLinecap="round"
      >
        <path d="M6 7H96" />
        <path d="M144 7H234" />

        <path
          d="M120 2L125.5 7L120 12L114.5 7Z"
          fill="#d9ab5c"
        />
      </g>
    </svg>
  );
}


/* =========================================================
   HERO
========================================================= */

const PARTICLES = [
  ["8%", "0s", "9s", 2],
  ["17%", "1.1s", "11s", 3],
  ["28%", "2.4s", "10s", 2],
  ["38%", ".6s", "12s", 3],
  ["47%", "3.2s", "9s", 2],
  ["56%", "1.8s", "11s", 3],
  ["65%", "4.1s", "10s", 2],
  ["74%", "2.7s", "12s", 3],
  ["82%", ".9s", "9s", 2],
  ["91%", "3.5s", "11s", 3],
  ["33%", "5s", "13s", 2],
  ["69%", "5.7s", "13s", 2],
] as const;

const LANTERNS = [
  {
    left:
      "7%",
    len:
      150,
    s:
      1,
    cls:
      "hero-lantern-a",
  },

  {
    left:
      "93%",
    len:
      150,
    s:
      1,
    cls:
      "hero-lantern-b",
  },

  {
    left:
      "3.2%",
    len:
      262,
    s:
      0.8,
    cls:
      "hero-lantern-c",
  },

  {
    left:
      "96.8%",
    len:
      262,
    s:
      0.8,
    cls:
      "hero-lantern-d",
  },
] as const;

function Hero({
  m,
}: {
  m: Mapped;
}) {
  return (
    <section className="hero">

      <HeroDefs />

      <div className="hero-bg" />

      <div
        className="hero-haze"
        aria-hidden
      />

      <div className="hero-layer">
        <Skyline />
      </div>

      <div className="hero-couple-wrap">
        <Couple
          src={
            m.heroImage
          }
        />
      </div>

      <div className="hero-floor" />

      <HeroArch />

      <FloralCorner side="left" />
      <FloralCorner side="right" />

      {LANTERNS.map(
        (
          lantern
        ) => (
          <div
            key={
              lantern.left
            }
            className={`lantern ${lantern.cls}`}
            style={{
              left:
                lantern.left,

              top:
                "0%",

              transform:
                "translateX(-50%)",
            }}
          >
            <HeroLantern
              len={
                lantern.len
              }
              s={
                lantern.s
              }
            />
          </div>
        )
      )}

      <div
        className="hero-particles"
        aria-hidden
      >
        {PARTICLES.map(
          (
            particle,
            index
          ) => {
            const [
              left,
              delay,
              duration,
              size,
            ] =
              particle;

            return (
              <s
                key={
                  index
                }
                style={{
                  left,

                  width:
                    `${size}px`,

                  height:
                    `${size}px`,

                  animationDelay:
                    delay,

                  animationDuration:
                    duration,
                }}
              />
            );
          }
        )}
      </div>

      <div className="hero-copy">

        <motion.p
          className="label hero-intro"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.75,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          Welcome to the
          <br />
          Wedding Celebrations of
        </motion.p>

        <motion.div
          className="hero-name-block"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.85,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <h1 className="hero-calligraphy">
            {m.c1[0]}
          </h1>

          <span className="hero-amp">
            &amp;
          </span>

          <h1 className="hero-calligraphy">
            {m.c1[1]}
          </h1>
        </motion.div>

        <motion.div
          className="hero-ornament"
          initial={{
            opacity: 0,
            scaleX: 0.8,
          }}
          animate={{
            opacity: 1,
            scaleX: 1,
          }}
          transition={{
            delay: 0.72,
            duration: 0.65,
          }}
        >
          <HeroDivider />
        </motion.div>

        <motion.div
          className="hero-name-block hero-second"
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.82,
            duration: 0.9,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <h2 className="hero-calligraphy">
            {m.c2[0]}
          </h2>

          <span className="hero-amp">
            &amp;
          </span>

          <h2 className="hero-calligraphy">
            {m.c2[1]}
          </h2>
        </motion.div>
      </div>

      <div className="scroll-cue">
        <span>
          Scroll to discover
        </span>

        <i />
      </div>
    </section>
  );
}

export default memo(
  Hero
);