"use client";

import { useEffect, useMemo, useState } from "react";

import { motion, useScroll, useSpring } from "framer-motion";

import { MapPin } from "lucide-react";

import type { Mapped } from "@/app/i/[token]/invitation-client";

const rise = {
  initial: {
    opacity: 0,
    y: 24,
    filter: "blur(7px)",
  },

  whileInView: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },

  viewport: {
    once: true,
    margin: "-10% 0px",
  },

  transition: {
    duration: 1.15,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

function stagger(index: number) {
  return {
    ...rise,

    transition: {
      ...rise.transition,
      delay: index * 0.12,
    },
  };
}

function useCountdown(iso: string) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);

  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      setRemaining(Math.max(0, target - Date.now()));
    };

    update();

    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [target]);

  if (remaining === null) {
    return ["--", "--", "--", "--"];
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return [
    String(Math.floor(remaining / 86400000)),
    pad(Math.floor(remaining / 3600000) % 24),
    pad(Math.floor(remaining / 60000) % 60),
    pad(Math.floor(remaining / 1000) % 60),
  ];
}

/* =====================================================================
   FORMAL INVITATION — ARTWORK
   (carved Mughal arch, florals, lanterns, mosque courtyard)
===================================================================== */

type P = [number, number];

/* Scalloped Mughal arch opening (open path, 430 x 900 canvas) */
const OPEN =
  "M72 900V330C54 318 52 282 78 262C58 248 62 200 92 184C78 160 94 128 130 112C162 100 190 80 215 40C240 80 268 100 300 112C336 128 352 160 338 184C368 200 372 248 352 262C378 282 376 318 358 330V900";

function bez(a: P, b: P, c: P, d: P, t: number): P {
  const u = 1 - t;

  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}

function Leaf({ x, y, r, s = 1 }: { x: number; y: number; r: number; s?: number }) {
  return (
    <path
      d="M0 0C5-8 17-8 24 0C17 8 5 8 0 0ZM2 0H22"
      transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
      fill="url(#fLeaf)"
      stroke="#7d8355"
      strokeWidth=".45"
      strokeLinejoin="round"
    />
  );
}

function Blossom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
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

      <circle r="1.5" fill="#dfb262" />
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
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle
        r="23"
        fill={tone === "blush" ? "url(#fRoseB)" : "url(#fRoseI)"}
        stroke="rgba(188,136,106,.4)"
        strokeWidth=".5"
      />

      {[0, 60, 120, 180, 240, 300].map((a) => (
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

      <circle r="2.6" fill="rgba(222,168,138,.4)" />
    </g>
  );
}

function Vine({ c, n, k = 1 }: { c: [P, P, P, P]; n: number; k?: number }) {
  const items = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.6) / (n + 0.2);
    const [x, y] = bez(c[0], c[1], c[2], c[3], t);
    const [x2, y2] = bez(c[0], c[1], c[2], c[3], Math.min(1, t + 0.02));
    const a = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;

    return {
      i,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      a: Math.round(a),
      side: i % 2 ? 1 : -1,
    };
  });

  return (
    <g>
      <path
        d={`M${c[0].join(" ")}C${c[1].join(" ")} ${c[2].join(" ")} ${c[3].join(" ")}`}
        fill="none"
        stroke="#8f9468"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {items.map(({ i, x, y, a, side }) => (
        <g key={i}>
          <Leaf x={x} y={y} r={a + side * 58} s={k * (0.8 + (i % 3) * 0.12)} />

          <Blossom
            x={Math.round((x - side * 7 * k) * 10) / 10}
            y={Math.round((y + (i % 2 ? 5 : -5) * k) * 10) / 10}
            s={k * (0.75 + (i % 2) * 0.2)}
          />
        </g>
      ))}
    </g>
  );
}

const HYDRANGEA: P[] = [
  [0, 0],
  [9, -3],
  [-8, -4],
  [3, 9],
  [-6, 8],
  [11, 7],
  [-13, 4],
  [4, -11],
  [-2, -9],
  [14, -8],
  [-12, -11],
];

function Cluster({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      {HYDRANGEA.map(([dx, dy], i) => (
        <Blossom key={i} x={x + dx * s} y={y + dy * s} s={s * (1 + (i % 3) * 0.1)} />
      ))}
    </g>
  );
}

function Lantern({
  x,
  y,
  s = 1,
  len = 120,
  delay = 0,
}: {
  x: number;
  y: number;
  s?: number;
  len?: number;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="f-lantern" style={{ animationDelay: `${delay}s` }}>
        <line x1="0" y1={-len} x2="0" y2="2" stroke="#b98a45" strokeWidth=".9" />

        <circle cx="0" cy="36" r="32" fill="url(#fGlow)" />

        <circle cx="0" cy="3" r="3" fill="none" stroke="#b27b35" strokeWidth="1" />

        <path d="M-10 17C-10 9-4 5 0 5C4 5 10 9 10 17Z" fill="url(#fGold)" stroke="#a9772f" strokeWidth=".6" />

        <rect x="-12.5" y="17" width="25" height="3.5" rx="1" fill="url(#fGold)" stroke="#a9772f" strokeWidth=".5" />

        <path d="M-10 20.5H10L8.5 58H-8.5Z" fill="url(#fLamp)" stroke="#a9772f" strokeWidth=".9" />

        <path
          d="M-3.5 20.5V58M3.5 20.5V58M-9.6 38H9.6"
          fill="none"
          stroke="#b27d3a"
          strokeWidth=".7"
        />

        <path d="M-9 58H9L5 66H-5Z" fill="url(#fGold)" stroke="#a9772f" strokeWidth=".6" />

        <path d="M0 66V72" stroke="#a9772f" strokeWidth=".9" />

        <circle cx="0" cy="73" r="1.7" fill="url(#fGold)" />
      </g>
    </g>
  );
}

function Palm({ x, h = 58 }: { x: number; h?: number }) {
  const top = 800 - h;

  return (
    <g fill="none" stroke="#a9a26c" strokeLinecap="round" opacity=".85">
      <path d={`M${x} 800C${x + 1} ${800 - h * 0.45} ${x - 1} ${800 - h * 0.8} ${x + 2} ${top}`} strokeWidth="1.8" />

      {[
        [-22, 6],
        [-18, -8],
        [-8, -14],
        [16, -14],
        [22, -6],
        [24, 8],
        [-24, 10],
      ].map(([dx, dy], i) => (
        <path
          key={i}
          d={`M${x + 2} ${top}C${x + 2 + dx * 0.4} ${top + dy - 6} ${x + 2 + dx * 0.8} ${top + dy - 4} ${x + 2 + dx} ${top + dy + 6}`}
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
}

function Minaret({ cx }: { cx: number }) {
  return (
    <g
      transform={`translate(${cx} 0)`}
      fill="url(#fMarble)"
      stroke="#d8b57a"
      strokeWidth=".55"
    >
      <path d="M-5.4 800L-4.4 646H4.4L5.4 800Z" />

      <rect x="-7.5" y="642" width="15" height="4.5" rx="1" />

      <path d="M-4 642V606H4V642Z" />

      <rect x="-6.5" y="602" width="13" height="4" rx="1" />

      <path d="M-4.2 602C-4.2 590 -1.6 584 0 578C1.6 584 4.2 590 4.2 602Z" />

      <path d="M0 578V566" fill="none" />

      <circle cx="0" cy="565" r="1.4" fill="#d9ab5c" stroke="none" />

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

function FormalArtwork() {
  return (
    <svg
      className="formal-art"
      viewBox="0 0 430 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="fWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbefdd" />
          <stop offset="1" stopColor="#f2dec5" />
        </linearGradient>

        <linearGradient id="fSky" gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="900">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset=".3" stopColor="#fff2de" />
          <stop offset=".62" stopColor="#fde1ba" />
          <stop offset=".86" stopColor="#f9d09a" />
          <stop offset="1" stopColor="#f6c88c" />
        </linearGradient>

        <linearGradient id="fGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6dfa8" />
          <stop offset=".5" stopColor="#cf9f55" />
          <stop offset="1" stopColor="#a8722f" />
        </linearGradient>

        <linearGradient id="fGold2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e2b6" />
          <stop offset="1" stopColor="#cfa05a" />
        </linearGradient>

        <linearGradient id="fPillarG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e8d3b2" />
          <stop offset=".35" stopColor="#fff8ea" />
          <stop offset=".65" stopColor="#f8ead2" />
          <stop offset="1" stopColor="#dcc09a" />
        </linearGradient>

        <linearGradient id="fMarble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#efdcc0" />
        </linearGradient>

        <linearGradient id="fFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe6c6" />
          <stop offset="1" stopColor="#f6dcb8" />
        </linearGradient>

        <linearGradient id="fLeaf" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#aab07a" />
          <stop offset="1" stopColor="#7f8a58" />
        </linearGradient>

        <radialGradient id="fLamp" cx=".5" cy=".5" r=".6">
          <stop offset="0" stopColor="#fffbe0" />
          <stop offset=".55" stopColor="#ffdc8a" />
          <stop offset="1" stopColor="#e0a24a" />
        </radialGradient>

        <radialGradient id="fGlow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe7a8" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffe7a8" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="fSun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff0c4" stopOpacity=".95" />
          <stop offset=".5" stopColor="#ffdca0" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffdca0" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="fRoseB" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#fff0e6" />
          <stop offset=".6" stopColor="#f6cdb8" />
          <stop offset="1" stopColor="#e8aa92" />
        </radialGradient>

        <radialGradient id="fRoseI" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset=".65" stopColor="#fbeedb" />
          <stop offset="1" stopColor="#ecd2b0" />
        </radialGradient>

        <pattern id="fDamask" width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M15 4C17 9 21 13 26 15C21 17 17 21 15 26C13 21 9 17 4 15C9 13 13 9 15 4Z"
            fill="none"
            stroke="#d9b887"
            strokeWidth=".5"
            opacity=".42"
          />

          <circle cx="15" cy="15" r="1.3" fill="#d9b887" opacity=".35" />
        </pattern>

        <pattern id="fLattice" width="11" height="11" patternUnits="userSpaceOnUse">
          <rect width="11" height="11" fill="#fbf0dd" />

          <path d="M5.5 0L11 5.5L5.5 11L0 5.5Z" fill="none" stroke="#caa163" strokeWidth=".6" />

          <circle cx="5.5" cy="5.5" r="1" fill="#e2c28a" />
        </pattern>

        <filter id="fBlur6" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        <filter id="fBlur1" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>

        <clipPath id="fOpenClip">
          <path d={`${OPEN}Z`} />
        </clipPath>

        {/* ---------- pillar ---------- */}
        <g id="fPillar">
          <rect
            x="43"
            y="352"
            width="29"
            height="548"
            fill="url(#fPillarG)"
            stroke="#d6b176"
            strokeWidth=".8"
          />

          <path
            d="M50 356V900M57.5 356V900M65 356V900"
            stroke="#e3cba0"
            strokeWidth=".6"
            opacity=".75"
          />

          <path
            d="M38 352H77L74 337C72 330 66 328 60 328H55C49 328 43 330 41 337Z"
            fill="url(#fGold2)"
            stroke="#b98a45"
            strokeWidth=".7"
          />

          <path
            d="M44 350C44 341 52 338 56 346M56 346C58 338 67 338 68 350M50 343C52 339 55 339 57 343"
            fill="none"
            stroke="#a9772f"
            strokeWidth=".6"
          />

          <rect x="41" y="352" width="33" height="4.5" rx="1" fill="url(#fGold)" stroke="#a9772f" strokeWidth=".5" />

          <rect x="40" y="846" width="35" height="7" rx="1" fill="url(#fGold2)" stroke="#a9772f" strokeWidth=".5" />
        </g>

        {/* ---------- jali panel ---------- */}
        <g id="fJali">
          <path
            d="M6 650V462C6 448 14 440 20 436C26 440 34 448 34 462V650Z"
            fill="url(#fLattice)"
            stroke="#c9984f"
            strokeWidth="1"
          />

          <path
            d="M3 654V460C3 444 12 435 20 430C28 435 37 444 37 460V654"
            fill="none"
            stroke="#e1bd76"
            strokeWidth=".6"
          />
        </g>

        {/* ---------- floral corners ---------- */}
        <g id="fClT">
          <Vine c={[[-4, 14], [50, 34], [112, 18], [184, 52]]} n={7} />

          <Vine c={[[20, -4], [44, 70], [6, 150], [34, 272]]} n={9} />

          <Vine c={[[62, 44], [88, 80], [104, 126], [94, 176]]} n={5} k={0.9} />

          <Cluster x={108} y={84} s={0.9} />

          <Cluster x={42} y={124} s={0.9} />

          <Rose x={60} y={30} s={0.98} tone="ivory" />

          <Rose x={32} y={68} s={0.84} tone="blush" />

          <Rose x={100} y={58} s={0.7} tone="ivory" />

          <Rose x={74} y={96} s={0.54} tone="blush" />

          <Blossom x={130} y={30} s={1.1} />

          <Blossom x={20} y={102} s={1.1} />

          <Blossom x={84} y={14} s={0.9} />
        </g>

        <g id="fClB">
          <Vine c={[[-4, 22], [60, 44], [130, 30], [196, 74]]} n={8} k={1.05} />

          <Vine c={[[16, 0], [40, 82], [6, 176], [42, 300]]} n={10} k={1.05} />

          <Vine c={[[70, 50], [96, 100], [112, 150], [100, 210]]} n={6} />

          <Cluster x={128} y={40} s={1.15} />

          <Cluster x={26} y={150} s={1} />

          <Cluster x={118} y={116} s={0.9} />

          <Rose x={34} y={36} s={1.1} tone="ivory" />

          <Rose x={78} y={58} s={1.5} tone="blush" />

          <Rose x={14} y={88} s={0.9} tone="blush" />

          <Rose x={118} y={80} s={0.82} tone="ivory" />

          <Blossom x={150} y={64} s={1.1} />

          <Blossom x={50} y={112} s={1.1} />
        </g>
      </defs>

      {/* ---------- carved wall ---------- */}
      <rect width="430" height="900" fill="url(#fWall)" />

      <rect width="430" height="900" fill="url(#fDamask)" />

      <rect x="5" y="5" width="420" height="890" fill="none" stroke="#d1a35c" strokeWidth=".9" />

      <rect x="9" y="9" width="412" height="882" fill="none" stroke="#e6c88c" strokeWidth=".5" />

      {/* ---------- layered arch bands ---------- */}
      <g fill="none" strokeLinejoin="round">
        <path d={OPEN} stroke="#c9984f" strokeWidth="60" />

        <path d={OPEN} stroke="#f8ecd8" strokeWidth="58" />

        <path d={OPEN} stroke="#d8b57a" strokeWidth="34" strokeLinecap="round" strokeDasharray="0.1 7.4" opacity=".75" />

        <path d={OPEN} stroke="#caa163" strokeWidth="38" />

        <path d={OPEN} stroke="#f1dcbf" strokeWidth="36" />

        <path d={OPEN} stroke="#c28d45" strokeWidth="20" strokeLinecap="round" strokeDasharray="0.1 5.2" opacity=".7" />

        <path d={OPEN} stroke="#d9b06a" strokeWidth="24" />

        <path d={OPEN} stroke="#fbf1df" strokeWidth="22" />

        <path d={OPEN} stroke="#e8cc92" strokeWidth="9" />

        <path d={OPEN} stroke="#fff6e4" strokeWidth="7" />
      </g>

      {/* ---------- apex ornament ---------- */}
      <g transform="translate(215 14)" fill="none" stroke="#b98a45" strokeWidth=".8">
        <path d="M0 -8C4 -3 4 3 0 8C-4 3-4-3 0-8Z" fill="url(#fGold)" />

        <path d="M-18 4C-12 -4-6 -2 0 8C6 -2 12 -4 18 4" />

        <circle cy="-11" r="1.5" fill="#d9ab5c" stroke="none" />
      </g>

      {/* ---------- opening: sky + courtyard ---------- */}
      <path d={`${OPEN}Z`} fill="url(#fSky)" />

      <g clipPath="url(#fOpenClip)">
        <g filter="url(#fBlur6)">
          <ellipse cx="110" cy="190" rx="70" ry="14" fill="#fff" opacity=".6" />

          <ellipse cx="330" cy="260" rx="64" ry="14" fill="#fff" opacity=".55" />

          <ellipse cx="86" cy="520" rx="84" ry="24" fill="#fbdcc0" opacity=".7" />

          <ellipse cx="350" cy="470" rx="70" ry="22" fill="#fbdcc0" opacity=".7" />

          <ellipse cx="320" cy="640" rx="76" ry="20" fill="#f7cda6" opacity=".65" />

          <ellipse cx="96" cy="660" rx="70" ry="18" fill="#f7cda6" opacity=".6" />

          <ellipse cx="215" cy="430" rx="120" ry="40" fill="#fff6e6" opacity=".4" />
        </g>

        <ellipse cx="215" cy="780" rx="190" ry="120" fill="url(#fSun)" />

        <circle cx="262" cy="772" r="13" fill="#fff6d6" opacity=".8" />

        {/* floor */}
        <rect x="0" y="800" width="430" height="100" fill="url(#fFloor)" />

        <g stroke="#dfbd86" strokeWidth=".5" opacity=".34" fill="none">
          {[-220, -110, 0, 100, 160, 215, 270, 330, 430, 540, 650].map((x) => (
            <path key={x} d={`M215 800L${x} 900`} />
          ))}

          {[809, 820, 835, 856, 884].map((y) => (
            <path key={y} d={`M0 ${y}H430`} />
          ))}
        </g>

        <ellipse cx="215" cy="806" rx="120" ry="13" fill="#fff0cd" opacity=".7" filter="url(#fBlur6)" />

        {/* reflection */}
        <g opacity=".16" filter="url(#fBlur1)" transform="translate(0 1600) scale(1 -1)">
          <use href="#fMosqueScene" />
        </g>

        {/* scene */}
        <g id="fMosqueScene">
          <Palm x={106} h={58} />

          <Palm x={324} h={58} />

          <Palm x={136} h={40} />

          <Palm x={294} h={40} />

          <g fill="url(#fMarble)" stroke="#d8b57a" strokeWidth=".55">
            <rect x="96" y="780" width="238" height="20" />

            <rect x="132" y="770" width="166" height="12" />

            <rect x="192" y="752" width="46" height="48" />

            <path d="M188 756C188 722 242 722 242 756Z" />

            <rect x="192" y="754" width="46" height="5" />

            <path d="M156 764C156 746 180 746 180 764Z" />

            <path d="M250 764C250 746 274 746 274 764Z" />

            <path d="M130 780C130 768 146 768 146 780Z" />

            <path d="M284 780C284 768 300 768 300 780Z" />

            <path d="M127 800L128 744H133L134 800Z" />

            <path d="M296 800L297 744H302L303 800Z" />

            <path d="M126 744C126 738 130 734 130.5 732C131 734 135 738 135 744Z" />

            <path d="M295 744C295 738 299 734 299.5 732C300 734 304 738 304 744Z" />
          </g>

          <path d="M215 724V712" stroke="#c9984f" strokeWidth=".9" />

          <circle cx="215" cy="711" r="1.6" fill="#d9ab5c" />

          <path d="M206 800V782C206 774 224 774 224 782V800Z" fill="#ffd88a" opacity=".92" />

          <g fill="#ffd78a" opacity=".85">
            {Array.from({ length: 19 }, (_, i) => 100 + i * 12).map((x) =>
              x > 190 && x < 232 ? null : (
                <rect key={x} x={x} y="784" width="5" height="12" rx="2.5" />
              )
            )}
          </g>

          <Minaret cx={80} />

          <Minaret cx={350} />

          {[150, 176, 254, 280].map((x) => (
            <g key={x}>
              <circle cx={x} cy="806" r="6" fill="url(#fGlow)" />

              <circle cx={x} cy="805" r="1.8" fill="#ffe2a0" />
            </g>
          ))}
        </g>
      </g>

      {/* ---------- opening edge ---------- */}
      <path d={OPEN} fill="none" stroke="#c58c3f" strokeWidth="2.4" strokeLinejoin="round" />

      <path d={OPEN} fill="none" stroke="#f6dfa8" strokeWidth=".8" strokeLinejoin="round" opacity=".9" transform="translate(0 0)" />

      {/* ---------- jali + pillars ---------- */}
      <use href="#fJali" />

      <use href="#fJali" transform="translate(430 0) scale(-1 1)" />

      <use href="#fPillar" />

      <use href="#fPillar" transform="translate(430 0) scale(-1 1)" />

      {/* ---------- lanterns ---------- */}
      <Lantern x={36} y={262} len={150} delay={0} />

      <Lantern x={394} y={262} len={150} delay={1.4} />

      <Lantern x={15} y={356} s={0.86} len={64} delay={0.7} />

      <Lantern x={415} y={356} s={0.86} len={64} delay={2.1} />

      {/* ---------- florals ---------- */}
      <use href="#fClT" transform="translate(-6 -6)" />

      <use href="#fClT" transform="translate(436 -6) scale(-1 1)" />

      <use href="#fClB" transform="translate(-6 906) scale(1.08 -1.08)" />

      <use href="#fClB" transform="translate(436 906) scale(-1.08 -1.08)" />
    </svg>
  );
}

function Divider() {
  return (
    <svg className="formal-divider" viewBox="0 0 240 14" aria-hidden>
      <g fill="none" stroke="#c9984f" strokeWidth=".8" strokeLinecap="round">
        <path d="M6 7H96" opacity=".85" />

        <path d="M144 7H234" opacity=".85" />

        <path d="M96 7C100 3 104 3 107 7" />

        <path d="M144 7C140 3 136 3 133 7" />

        <path d="M120 2L125.5 7L120 12L114.5 7Z" fill="#d9ab5c" />

        <path d="M108 7L111 4.6L114 7L111 9.4Z" fill="#e6c27e" stroke="none" />

        <path d="M126 7L129 4.6L132 7L129 9.4Z" fill="#e6c27e" stroke="none" />
      </g>
    </svg>
  );
}

function GuestPlaque() {
  return (
    <svg viewBox="0 0 280 64" preserveAspectRatio="none" aria-hidden>
      <path
        d="M22 1.5H258C267 1.5 271 7 278.5 32C271 57 267 62.5 258 62.5H22C13 62.5 9 57 1.5 32C9 7 13 1.5 22 1.5Z"
        fill="rgba(255,249,238,.8)"
        stroke="#d6ab66"
        strokeWidth="1"
      />

      <path
        d="M24 5.5H256C264 5.5 267 10 273 32C267 54 264 58.5 256 58.5H24C16 58.5 13 54 7 32C13 10 16 5.5 24 5.5Z"
        fill="none"
        stroke="rgba(214,171,102,.6)"
        strokeWidth=".6"
      />

      {[16, 264].map((x) => (
        <g key={x} transform={`translate(${x} 32)`}>
          <path
            d="M0-6C3-3 3 3 0 6C-3 3-3-3 0-6ZM-6 0C-3 3 3 3 6 0C3-3-3-3-6 0Z"
            fill="#cf9f55"
          />

          <circle r="1.6" fill="#fff4dc" />
        </g>
      ))}

      <path d="M140 60.6L146 64L140 67.4L134 64Z" fill="#d9ab5c" />

      <path d="M120 64H132M148 64H160" stroke="#d1a35c" strokeWidth=".8" />
    </svg>
  );
}

export default function Sections({
  m,
  onClose,
  closing,
}: {
  m: Mapped;

  onClose: () => void;

  closing: boolean;
}) {
  const [days, hours, minutes, seconds] = useCountdown("2026-10-30T20:00:00+05:00");

  const { scrollYProgress } = useScroll();

  const line = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
  });

  return (
    <>
      {/* ============================
          FORMAL INVITATION
      ============================ */}

      <section className="formal-section">
        <div className="formal-card">
          <FormalArtwork />

          <div className="formal-content">
            <motion.p
              {...rise}
              className="arabic formal-bismillah"
              lang="ar"
              dir="rtl"
            >
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </motion.p>

            <motion.p {...stagger(1)} className="formal-bismillah-en">
              In the name of Allah, the Most Gracious,
              <br />
              the Most Merciful
            </motion.p>

            <motion.div {...stagger(2)}>
              <Divider />
            </motion.div>

            <motion.p {...stagger(3)} className="formal-host">
              MR &amp; MRS. DR ASGHAR ALI
            </motion.p>

            <motion.p {...stagger(4)} className="formal-request">
              <span>request the pleasure of your company</span>
              <span>at the wedding celebrations of their beloved</span>
              <span>son and daughter</span>
            </motion.p>

            <motion.div {...stagger(5)} className="formal-couple">
              <h2 className="formal-script-name">{m.c1[0]}</h2>

              <div className="formal-weds">
                <i />
                <span>WEDS</span>
                <i />
              </div>

              <h2 className="formal-script-name">{m.c1[1]}</h2>
            </motion.div>

            <motion.div {...stagger(6)}>
              <Divider />
            </motion.div>

            <motion.div {...stagger(7)} className="formal-couple">
              <h2 className="formal-script-name">{m.c2[0]}</h2>

              <div className="formal-weds">
                <i />
                <span>WEDS</span>
                <i />
              </div>

              <h2 className="formal-script-name">{m.c2[1]}</h2>
            </motion.div>

            <motion.p {...stagger(8)} className="formal-dear">
              Dear Friends &amp; Family
            </motion.p>

            <motion.div {...stagger(9)}>
              <Divider />
            </motion.div>

            <motion.p {...stagger(10)} className="formal-message">
              <span>Join us as we celebrate love, family and the</span>
              <span>beginning of two beautiful journeys.</span>
              <span>Your presence will make these moments</span>
              <span>even more special.</span>
            </motion.p>
          </div>

          <div className="formal-guest-wrap">
            <motion.div {...stagger(11)} className="formal-guest">
              <GuestPlaque />

              <span>Especially for</span>

              <strong>{m.guest}</strong>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================
          QURAN SECTION
      ============================ */}

      <section className="sec verse">
        <div className="verse-arch" />

        <motion.p {...rise} className="arabic" lang="ar" dir="rtl">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ
          مِنْ أَنْفُسِكُمْ أَزْوَاجًا
          لِتَسْكُنُوا إِلَيْهَا
          وَجَعَلَ بَيْنَكُمْ مَوَدَّةً
          وَرَحْمَةً
        </motion.p>

        <motion.i {...stagger(1)} className="gdiv" />

        <motion.p {...stagger(2)} className="quote">
          {m.verse}
        </motion.p>

        <motion.p {...stagger(3)} className="small-it">
          ({m.ref})
        </motion.p>
      </section>

      {/* ============================
          COUNTDOWN
      ============================ */}

      <section className="sec countdown-section">
        <motion.p {...rise} className="countdown-intro">
          Countdown to Our
          <br />
          Wedding Celebrations
        </motion.p>

        <motion.div {...stagger(1)} className="medal">
          <div className="medal-flower medal-flower-left">✦</div>

          <div className="medal-flower medal-flower-right">✦</div>

          <svg className="medal-frame" viewBox="0 0 340 340" aria-hidden>
            <defs>
              <linearGradient id="goldRing" x1="0" x2="1">
                <stop offset="0%" stopColor="#bb7d34" />

                <stop offset="50%" stopColor="#f1d495" />

                <stop offset="100%" stopColor="#b77a33" />
              </linearGradient>
            </defs>

            <circle
              cx="170"
              cy="170"
              r="143"
              fill="#fff6eb"
              fillOpacity="0.74"
              stroke="url(#goldRing)"
              strokeWidth="3"
            />

            <circle cx="170" cy="170" r="131" fill="none" stroke="#dfb86d" strokeWidth="1.3" />

            <circle cx="170" cy="170" r="120" fill="none" stroke="#efd69f" strokeWidth="1" />

            {Array.from({ length: 24 }).map((_, index) => {
              const angle = (Math.PI * 2 * index) / 24;

              const x = 170 + Math.cos(angle) * 151;

              const y = 170 + Math.sin(angle) * 151;

              return (
                <ellipse
                  key={index}
                  cx={x}
                  cy={y}
                  rx="4"
                  ry="8"
                  fill="#edd4c7"
                  stroke="#d7aa7d"
                  strokeWidth="0.8"
                  transform={`rotate(${(angle * 180) / Math.PI + 90} ${x} ${y})`}
                />
              );
            })}
          </svg>

          <div className="medal-in">
            <span className="big">30</span>

            <span className="medal-month">OCTOBER</span>

            <span className="year">2026</span>
          </div>
        </motion.div>

        <motion.div {...stagger(2)} className="count">
          <div>
            <b>{days}</b>

            <span>DAYS</span>
          </div>

          <div>
            <b>{hours}</b>

            <span>HOURS</span>
          </div>

          <div>
            <b>{minutes}</b>

            <span>MINUTES</span>
          </div>

          <div>
            <b>{seconds}</b>

            <span>SECONDS</span>
          </div>
        </motion.div>
      </section>

      {/* ============================
          EVENTS
      ============================ */}

      <section className="sec journey">
        <motion.p {...rise} className="journey-heading">
          Our Wedding
          <br />
          Journey
        </motion.p>

        <div className="rail">
          <motion.i style={{ scaleY: line }} />
        </div>

        {m.events.map((event, index) => (
          <motion.article key={event.key} {...stagger(index + 1)} className="chapter">
            <div className="orb">✦</div>

            <h3 className="event-name">{event.name}</h3>

            {event.sub ? <p className="small-it">{event.sub}</p> : null}

            <p className="date">{event.date}</p>

            <p className="label">{event.time}</p>

            <p className="body sm">
              {event.venue}

              <br />

              {event.address}
            </p>

            <a href={event.maps} target="_blank" rel="noreferrer" className="gbtn">
              <MapPin size={14} />
              View Venue
            </a>
          </motion.article>
        ))}
      </section>

      {/* ============================
          CLOSING
      ============================ */}

      <section className={`sec closing ${closing ? "is-closing" : ""}`}>
        <div className="closing-sky" />

        <motion.p {...rise} className="mono">
          H ✦ I
        </motion.p>

        <motion.p {...stagger(1)} className="closing-duas">
          With Love &amp; Duas
        </motion.p>

        <motion.h3 {...stagger(2)} className="closing-title">
          {m.thankTitle}
        </motion.h3>

        <motion.p {...stagger(3)} className="body closing-copy">
          {m.thankMsg}
        </motion.p>

        <motion.p {...stagger(4)} className="closing-names">
          {m.c1[0]}
          {" & "}
          {m.c1[1]}

          <br />

          {m.c2[0]}
          {" & "}
          {m.c2[1]}
        </motion.p>

        <motion.button
          {...stagger(5)}
          type="button"
          className="gbtn solid"
          onClick={onClose}
        >
          Close Invitation
        </motion.button>
      </section>
    </>
  );
}