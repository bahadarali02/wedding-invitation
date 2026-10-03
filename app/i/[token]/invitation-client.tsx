"use client";

import {
  CalendarDays,
  ChevronDown,
  MapPin,
  Music,
  Music2,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type WeddingEvent = {
  id: string;
  name: string;
  slug: string;
  event_date: string | null;
  start_time: string | null;
  venue_name: string | null;
  venue_address: string | null;
  google_maps_url: string | null;
  dress_code: string | null;
  description: string | null;
  display_order: number | null;
};

type InvitationData = {
  guest: {
    id: string;
    display_name: string;
    invite_type: string;
    custom_message: string | null;
  };

  wedding: {
    bride_name: string;
    groom_name: string;
    bride_short_name: string | null;
    groom_short_name: string | null;
    monogram: string | null;
    invitation_title: string | null;
    welcome_message: string | null;
    quranic_verse: string | null;
    quranic_reference: string | null;
    hero_image_url: string | null;
    background_music_url: string | null;
    wedding_hashtag: string | null;
  };

  events: WeddingEvent[];
};

type Props = {
  invitation: InvitationData;
};

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatTime(value: string | null) {
  if (!value) return "";

  const [hourText, minute] =
    value.split(":");

  let hour = Number(hourText);

  const suffix =
    hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${suffix}`;
}

function Ornament({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 152C42 135 34 94 65 80C87 70 102 82 111 66C119 51 107 35 125 19C134 11 143 8 152 8"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      <path
        d="M25 131C52 124 55 100 69 91"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      <path
        d="M65 80C55 58 61 42 78 29"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      <path
        d="M111 66C135 63 143 50 147 34"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      <ellipse
        cx="40"
        cy="119"
        rx="11"
        ry="4.5"
        transform="rotate(-30 40 119)"
        stroke="currentColor"
      />

      <ellipse
        cx="62"
        cy="95"
        rx="11"
        ry="4.5"
        transform="rotate(-58 62 95)"
        stroke="currentColor"
      />

      <ellipse
        cx="70"
        cy="57"
        rx="11"
        ry="4.5"
        transform="rotate(-72 70 57)"
        stroke="currentColor"
      />

      <ellipse
        cx="125"
        cy="56"
        rx="11"
        ry="4.5"
        transform="rotate(-20 125 56)"
        stroke="currentColor"
      />
    </svg>
  );
}

function Countdown({
  date,
}: {
  date: string | null | undefined;
}) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!date) return;

    const update = () => {
      const target =
        new Date(
          `${date}T18:00:00`
        ).getTime();

      const difference =
        target - Date.now();

      if (difference <= 0) {
        setTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setTime({
        days: Math.floor(
          difference /
            (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
          (difference /
            (1000 * 60 * 60)) %
            24
        ),

        minutes: Math.floor(
          (difference /
            (1000 * 60)) %
            60
        ),

        seconds: Math.floor(
          (difference / 1000) %
            60
        ),
      });
    };

    update();

    const interval =
      window.setInterval(update, 1000);

    return () =>
      window.clearInterval(interval);
  }, [date]);

  if (!date) return null;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {[
        ["Days", time.days],
        ["Hours", time.hours],
        ["Minutes", time.minutes],
        ["Seconds", time.seconds],
      ].map(([label, value]) => (
        <div
          key={String(label)}
          className="relative overflow-hidden rounded-[20px] border border-[#c6a665]/30 bg-[#fffdf7]/55 px-1 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.7)] backdrop-blur-xl"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b99552]/60 to-transparent" />

          <p className="font-serif text-[25px] text-[#765528] sm:text-3xl">
            {String(value).padStart(
              2,
              "0"
            )}
          </p>

          <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.16em] text-[#8b7a64] sm:text-[9px]">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function InvitationClient({
  invitation,
}: Props) {
  const {
    guest,
    wedding,
    events,
  } = invitation;

  const [opened, setOpened] =
    useState(false);

  const [musicPlaying, setMusicPlaying] =
    useState(false);

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null
    );

  const firstEvent = useMemo(() => {
    return [...events]
      .filter(
        (event) =>
          event.event_date
      )
      .sort((a, b) =>
        String(
          a.event_date
        ).localeCompare(
          String(b.event_date)
        )
      )[0];
  }, [events]);

  const groomDisplay =
    wedding.groom_short_name ||
    "Dr. Haider";

  const brideDisplay =
    wedding.bride_short_name ||
    "Sidra";

  const weddingTitle = `${groomDisplay} Weds ${brideDisplay}`;

  async function openInvitation() {
    if (opened) return;

    setOpened(true);

    if (
      audioRef.current &&
      wedding.background_music_url
    ) {
      try {
        audioRef.current.volume =
          0.35;

        await audioRef.current.play();

        setMusicPlaying(true);
      } catch {
        setMusicPlaying(false);
      }
    }

    window.setTimeout(() => {
      document
        .getElementById(
          "invitation-story"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 2200);
  }

  async function toggleMusic() {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);

      return;
    }

    try {
      await audioRef.current.play();
      setMusicPlaying(true);
    } catch {
      setMusicPlaying(false);
    }
  }

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
          background: #efe7d8;
        }

        body {
          overflow-x: hidden;
        }

        @keyframes ambientMove {
          0%, 100% {
            transform: translate3d(0,0,0) scale(1);
          }
          50% {
            transform: translate3d(15px,-20px,0) scale(1.08);
          }
        }

        @keyframes grainMove {
          0%,100% { transform: translate(0,0); }
          25% { transform: translate(-1%,1%); }
          50% { transform: translate(1%,-1%); }
          75% { transform: translate(1%,1%); }
        }

        @keyframes floatSeal {
          0%,100% {
            transform: translate(-50%,-50%) rotate(-2deg);
          }
          50% {
            transform: translate(-50%,-54%) rotate(2deg);
          }
        }

        @keyframes sealPulse {
          0%,100% {
            box-shadow:
              0 8px 30px rgba(64,31,12,.28),
              inset 0 2px 5px rgba(255,225,170,.28);
          }

          50% {
            box-shadow:
              0 14px 40px rgba(90,46,17,.4),
              0 0 0 7px rgba(134,87,45,.07),
              inset 0 2px 5px rgba(255,225,170,.35);
          }
        }

        @keyframes envelopeOpen {
          from {
            transform: rotateX(0deg);
          }

          to {
            transform: rotateX(178deg);
          }
        }

        @keyframes cardLift {
          0% {
            transform:
              translateY(100px)
              scale(.88);
          }

          55% {
            transform:
              translateY(-95px)
              scale(.96);
          }

          100% {
            transform:
              translateY(-145px)
              scale(1);
          }
        }

        @keyframes envelopeSink {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(65px);
          }
        }

        @keyframes sealBreak {
          0% {
            opacity: 1;
            transform:
              translate(-50%,-50%)
              scale(1);
          }

          55% {
            opacity: 1;
            transform:
              translate(-50%,-50%)
              scale(1.08);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%,-50%)
              scale(.55)
              rotate(18deg);
          }
        }

        @keyframes revealSection {
          from {
            opacity: 0;
            transform: translateY(44px);
            filter: blur(7px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes shimmer {
          from {
            transform: translateX(-180%) rotate(16deg);
          }

          to {
            transform: translateX(420%) rotate(16deg);
          }
        }

        @keyframes sparkle {
          0%,100% {
            opacity: .15;
            transform: scale(.5);
          }

          50% {
            opacity: .85;
            transform: scale(1);
          }
        }

        .luxury-envelope.open .luxury-flap {
          animation:
            envelopeOpen
            1.15s
            cubic-bezier(.2,.75,.15,1)
            forwards;
        }

        .luxury-envelope.open .luxury-card {
          animation:
            cardLift
            1.65s
            .65s
            cubic-bezier(.16,1,.3,1)
            forwards;
        }

        .luxury-envelope.open .envelope-body {
          animation:
            envelopeSink
            1.3s
            .65s
            cubic-bezier(.16,1,.3,1)
            forwards;
        }

        .luxury-envelope.open .wax-seal {
          animation:
            sealBreak
            .65s
            cubic-bezier(.16,1,.3,1)
            forwards;
        }

        .story-reveal {
          animation:
            revealSection
            1.2s
            cubic-bezier(.16,1,.3,1)
            both;
        }

        .premium-shimmer::after {
          content: "";
          position: absolute;
          inset: -50%;
          width: 20%;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.48),
              transparent
            );
          animation:
            shimmer 4.5s
            ease-in-out infinite;
        }

        .sparkle {
          animation:
            sparkle 3s
            ease-in-out infinite;
        }
      `}</style>

      {wedding.background_music_url ? (
        <audio
          ref={audioRef}
          src={
            wedding.background_music_url
          }
          preload="auto"
          loop
        />
      ) : null}

      {opened &&
      wedding.background_music_url ? (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed bottom-5 right-5 z-[100] flex h-13 w-13 items-center justify-center rounded-full border border-[#c9aa68]/40 bg-[#1e1913]/95 text-[#ead39c] shadow-[0_12px_45px_rgba(0,0,0,.25)] backdrop-blur-xl"
        >
          {musicPlaying ? (
            <Music2 size={18} />
          ) : (
            <Music size={18} />
          )}
        </button>
      ) : null}

      <main className="overflow-hidden bg-[#f0e8d9] text-[#372d23]">
        {/* ==================================================
            CINEMATIC OPENING
        ================================================== */}

        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#fffdf4_0%,#f3ebdc_35%,#e9ddc7_100%)]" />

          <div className="absolute -left-40 -top-48 h-[420px] w-[420px] rounded-full bg-[#ceb37b]/25 blur-[90px]" />

          <div
            className="absolute -bottom-52 -right-40 h-[480px] w-[480px] rounded-full bg-[#ad8650]/20 blur-[110px]"
            style={{
              animation:
                "ambientMove 10s ease-in-out infinite",
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #8f6d38 0.7px, transparent 0.7px)",
              backgroundSize:
                "19px 19px",
              animation:
                "grainMove 12s linear infinite",
            }}
          />

          <Ornament className="absolute -left-8 -top-4 h-48 w-48 rotate-180 text-[#a98a54]/30 sm:h-64 sm:w-64" />

          <Ornament className="absolute -bottom-6 -right-8 h-52 w-52 text-[#a98a54]/30 sm:h-72 sm:w-72" />

          <span className="sparkle absolute left-[16%] top-[18%] h-1.5 w-1.5 rounded-full bg-[#b99254]" />

          <span
            className="sparkle absolute right-[19%] top-[26%] h-1 w-1 rounded-full bg-[#c9a867]"
            style={{
              animationDelay: "1.2s",
            }}
          />

          <div className="relative z-10 mx-auto w-full max-w-[450px] text-center">
            <div className="mb-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.45em] text-[#92703e]">
                A Private Wedding Invitation
              </p>

              <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#9b7740] to-transparent" />
            </div>

            <p className="font-serif text-[17px] italic text-[#756552]">
              Especially for
            </p>

            <h1 className="mx-auto mt-3 max-w-sm font-serif text-[32px] leading-[1.15] text-[#3b3026]">
              {guest.display_name}
            </h1>

            {/* ENVELOPE */}

            <div
              className={`luxury-envelope relative mx-auto mt-9 h-[380px] w-full max-w-[410px] [perspective:1200px] ${
                opened ? "open" : ""
              }`}
            >
              {/* CARD INSIDE */}

              <div className="luxury-card premium-shimmer absolute left-[7%] top-[105px] z-10 h-[238px] w-[86%] translate-y-[100px] overflow-hidden rounded-[3px] border border-[#cab27c]/60 bg-[#fffaf0] shadow-[0_25px_75px_rgba(67,47,24,.28)]">
                <Ornament className="absolute -left-5 -top-5 h-28 w-28 rotate-180 text-[#b29255]/35" />

                <Ornament className="absolute -bottom-5 -right-5 h-28 w-28 text-[#b29255]/35" />

                <div className="absolute inset-[9px] border border-[#c8a967]/25" />

                <div className="relative flex h-full flex-col items-center justify-center px-5">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.42em] text-[#98713c]">
                    Together Forever
                  </p>

                  <h2 className="mt-5 font-serif text-[30px] text-[#493727]">
                    {groomDisplay}
                  </h2>

                  <p className="my-1 font-serif text-xl italic text-[#ad884a]">
                    Weds
                  </p>

                  <h2 className="font-serif text-[30px] text-[#493727]">
                    {brideDisplay}
                  </h2>

                  <div className="mt-5 h-px w-20 bg-[#bea066]/50" />

                  <p className="mt-3 text-[8px] uppercase tracking-[0.26em] text-[#94816a]">
                    October • November
                    2026
                  </p>
                </div>
              </div>

              {/* ENVELOPE BODY */}

              <div className="envelope-body absolute bottom-0 left-0 z-20 h-[235px] w-full">
                <div className="absolute inset-0 overflow-hidden rounded-[8px] border border-[#bfa673]/50 bg-[#e4d5b8] shadow-[0_30px_80px_rgba(66,45,23,.22)]">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.22),transparent_35%,rgba(113,77,38,.06))]" />

                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #856233 0.7px, transparent 0.7px)",
                      backgroundSize:
                        "14px 14px",
                    }}
                  />

                  <div className="absolute -bottom-[1px] -left-[2px] h-0 w-0 border-b-[235px] border-r-[205px] border-b-[#d9c7a3] border-r-transparent" />

                  <div className="absolute -bottom-[1px] -right-[2px] h-0 w-0 border-b-[235px] border-l-[205px] border-b-[#cfbb93] border-l-transparent" />
                </div>

                <div
                  className="luxury-flap absolute left-0 top-0 z-30 h-0 w-0 origin-top border-l-[205px] border-r-[205px] border-t-[150px] border-l-transparent border-r-transparent border-t-[#d8c5a0]"
                  style={{
                    transformStyle:
                      "preserve-3d",
                    backfaceVisibility:
                      "visible",
                  }}
                />

                {/* WAX SEAL */}

                <button
                  type="button"
                  disabled={opened}
                  onClick={openInvitation}
                  className="wax-seal absolute left-1/2 top-[145px] z-50 flex h-[82px] w-[82px] items-center justify-center rounded-full border-[3px] border-[#8c542d] bg-[radial-gradient(circle_at_35%_28%,#ab7344,#74411f_62%,#573016)] font-serif text-lg tracking-[0.13em] text-[#f0d69b] disabled:pointer-events-none"
                  style={{
                    transform:
                      "translate(-50%,-50%)",
                    animation:
                      opened
                        ? undefined
                        : "floatSeal 4s ease-in-out infinite, sealPulse 3s ease-in-out infinite",
                  }}
                >
                  <span className="absolute inset-[7px] rounded-full border border-[#d1a86b]/45" />

                  <span className="relative">
                    {wedding.monogram ||
                      "H&S"}
                  </span>
                </button>
              </div>
            </div>

            {!opened ? (
              <button
                type="button"
                onClick={openInvitation}
                className="group relative mt-7 inline-flex overflow-hidden rounded-full border border-[#9e7a44]/35 bg-[#fffaf1]/55 px-7 py-3.5 backdrop-blur-xl transition hover:border-[#8f6a34]/60"
              >
                <span className="relative z-10 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#74562e]">
                  <Sparkles size={14} />
                  Open Invitation
                </span>
              </button>
            ) : (
              <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-[#92754b]">
                Scroll to discover
              </p>
            )}

            <ChevronDown className="mx-auto mt-5 animate-bounce text-[#a18454]" />
          </div>
        </section>

        {/* ==================================================
            MAIN INVITATION
        ================================================== */}

        <div
          id="invitation-story"
          className={
            opened
              ? "story-reveal"
              : "pointer-events-none opacity-0"
          }
        >
          {/* HERO */}

          <section className="relative min-h-[95svh] overflow-hidden px-5 py-24 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fffdf7_0%,#f3ead9_62%,#e8dcc6_100%)]" />

            <Ornament className="absolute -left-14 top-0 h-56 w-56 rotate-180 text-[#ad8b51]/25" />

            <Ornament className="absolute -bottom-12 -right-14 h-64 w-64 text-[#ad8b51]/25" />

            <div className="relative z-10 mx-auto max-w-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-[#9a743b]">
                بِسْمِ اللهِ الرَّحْمٰنِ
                الرَّحِيْمِ
              </p>

              <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#ae8d53]/40 font-serif text-sm tracking-[0.12em] text-[#896533]">
                H&S
              </div>

              <p className="mt-10 font-serif text-[17px] italic text-[#81715d]">
                Together with their
                families
              </p>

              <h2 className="mt-7 font-serif text-[46px] leading-[.98] text-[#3b2d22] sm:text-6xl">
                Dr. Haider
              </h2>

              <p className="my-5 font-serif text-[23px] italic text-[#b18a4e]">
                Weds
              </p>

              <h2 className="font-serif text-[46px] leading-[.98] text-[#3b2d22] sm:text-6xl">
                Sidra
              </h2>

              <div className="mx-auto mt-10 flex items-center justify-center gap-3">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#aa8951]" />

                <span className="h-1.5 w-1.5 rotate-45 border border-[#9b7741]" />

                <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#aa8951]" />
              </div>

              <p className="mx-auto mt-9 max-w-md text-[13px] leading-7 text-[#736453]">
                {guest.custom_message ||
                  wedding.welcome_message}
              </p>

              <div className="mt-12 rounded-[28px] border border-[#c4a970]/30 bg-white/35 px-5 py-6 backdrop-blur">
                <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#95703a]">
                  Celebrating
                </p>

                <p className="mt-3 font-serif text-2xl text-[#59432d]">
                  {weddingTitle}
                </p>

                <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#8d7b65]">
                  30 October — 1 November
                  2026
                </p>
              </div>
            </div>
          </section>

          {/* VERSE */}

          {wedding.quranic_verse ? (
            <section className="relative overflow-hidden bg-[#201b16] px-5 py-24 text-center text-white">
              <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#b38c50]/10 blur-[90px]" />

              <div className="relative mx-auto max-w-xl">
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#c5a564]">
                  And among His signs
                </p>

                <p className="mt-8 font-serif text-[21px] leading-9 text-[#eee2c7]">
                  {
                    wedding.quranic_verse
                  }
                </p>

                {wedding.quranic_reference ? (
                  <p className="mt-6 text-[9px] uppercase tracking-[0.25em] text-[#9e875e]">
                    {
                      wedding.quranic_reference
                    }
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* COUNTDOWN */}

          {firstEvent ? (
            <section className="relative overflow-hidden px-5 py-24">
              <div className="absolute inset-0 bg-[#f2eadb]" />

              <div className="relative mx-auto max-w-xl text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#97713b]">
                  Until our celebrations
                  begin
                </p>

                <h2 className="mt-4 font-serif text-4xl text-[#47372a]">
                  Save the Date
                </h2>

                <div className="mt-9">
                  <Countdown
                    date={
                      firstEvent.event_date
                    }
                  />
                </div>
              </div>
            </section>
          ) : null}

          {/* EVENTS */}

          <section className="relative overflow-hidden bg-[#e4d6bb] px-4 py-24">
            <Ornament className="absolute -left-12 top-0 h-56 w-56 rotate-180 text-[#8d6f42]/20" />

            <Ornament className="absolute -bottom-12 -right-12 h-64 w-64 text-[#8d6f42]/20" />

            <div className="relative mx-auto max-w-xl">
              <div className="mb-14 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-[#8f6d39]">
                  Three beautiful chapters
                </p>

                <h2 className="mt-4 font-serif text-[39px] text-[#423328]">
                  Wedding Celebrations
                </h2>

                <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-[#766653]">
                  We would be honoured to
                  celebrate these moments
                  with you.
                </p>
              </div>

              <div className="space-y-8">
                {events.map(
                  (event, index) => (
                    <article
                      key={event.id}
                      className="relative overflow-hidden rounded-[34px] border border-[#bca06a]/35 bg-[#fffaf0]/90 p-7 shadow-[0_28px_80px_rgba(77,53,25,.11)] backdrop-blur-xl"
                    >
                      <div className="absolute inset-[8px] rounded-[27px] border border-[#bfa36c]/15" />

                      <Ornament className="absolute -right-7 -top-7 h-32 w-32 text-[#aa8953]/20" />

                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#95723c]">
                            Celebration{" "}
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </p>

                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b89a62]/30 font-serif text-xs text-[#8d6b39]">
                            H&S
                          </div>
                        </div>

                        <h3 className="mt-5 font-serif text-[38px] leading-none text-[#493728]">
                          {event.name}
                        </h3>

                        <div className="mt-7 h-px w-full bg-gradient-to-r from-[#bea06a]/40 via-[#bea06a]/15 to-transparent" />

                        <div className="mt-7 space-y-6">
                          {event.event_date ? (
                            <div className="flex gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eadcc0] text-[#916d37]">
                                <CalendarDays
                                  size={17}
                                />
                              </div>

                              <div>
                                <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#9a876f]">
                                  Date & Time
                                </p>

                                <p className="mt-1.5 font-serif text-[17px] text-[#554331]">
                                  {formatDate(
                                    event.event_date
                                  )}
                                </p>

                                {event.start_time ? (
                                  <p className="mt-1 text-xs text-[#80705d]">
                                    {formatTime(
                                      event.start_time
                                    )}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ) : null}

                          {event.venue_name ? (
                            <div className="flex gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eadcc0] text-[#916d37]">
                                <MapPin
                                  size={17}
                                />
                              </div>

                              <div>
                                <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#9a876f]">
                                  Venue
                                </p>

                                <p className="mt-1.5 font-serif text-[17px] text-[#554331]">
                                  {
                                    event.venue_name
                                  }
                                </p>

                                {event.venue_address ? (
                                  <p className="mt-1 max-w-sm text-xs leading-5 text-[#80705d]">
                                    {
                                      event.venue_address
                                    }
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </div>

                        {event.dress_code ? (
                          <div className="mt-7 rounded-2xl border border-[#c9ad78]/25 bg-[#f2e7d2]/70 px-4 py-3">
                            <p className="text-[8px] uppercase tracking-[0.22em] text-[#9a7a49]">
                              Dress Code
                            </p>

                            <p className="mt-1 text-xs text-[#695744]">
                              {
                                event.dress_code
                              }
                            </p>
                          </div>
                        ) : null}

                        {event.description ? (
                          <p className="mt-6 text-xs leading-6 text-[#776755]">
                            {
                              event.description
                            }
                          </p>
                        ) : null}

                        {event.google_maps_url ? (
                          <a
                            href={
                              event.google_maps_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#211b15] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ead29c] shadow-[0_12px_32px_rgba(40,28,16,.15)]"
                          >
                            <MapPin
                              size={14}
                            />
                            View Location
                          </a>
                        ) : null}
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>
          </section>

          {/* CLOSING */}

          <section className="relative min-h-[75svh] overflow-hidden bg-[#f6efe2] px-5 py-28 text-center">
            <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b89a61]/10" />

            <div className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b89a61]/10" />

            <div className="relative mx-auto max-w-lg">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-[#ac8b51]/40 shadow-[inset_0_0_0_7px_rgba(178,145,84,.05)]">
                <span className="font-serif text-xl tracking-[0.16em] text-[#856233]">
                  H&S
                </span>
              </div>

              <p className="mt-10 text-[9px] font-semibold uppercase tracking-[0.42em] text-[#98733d]">
                With love
              </p>

              <h2 className="mx-auto mt-6 max-w-sm font-serif text-[38px] leading-[1.08] text-[#413226]">
                Your presence will make
                our celebration complete
              </h2>

              <p className="mx-auto mt-7 max-w-sm text-xs leading-7 text-[#786957]">
                We look forward to sharing
                these cherished moments
                with you.
              </p>

              <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#9b7740] to-transparent" />

              <p className="mt-7 font-serif text-xl text-[#77582f]">
                Dr. Haider Weds Sidra
              </p>

              <p className="mt-3 text-[9px] uppercase tracking-[0.24em] text-[#9a8871]">
                30 October — 1 November
                2026
              </p>

              {wedding.wedding_hashtag ? (
                <p className="mt-6 text-xs text-[#92713e]">
                  {
                    wedding.wedding_hashtag
                  }
                </p>
              ) : null}
            </div>
          </section>

          <footer className="border-t border-[#c3aa78]/25 bg-[#eee4d3] px-5 py-7 text-center">
            <p className="text-[8px] uppercase tracking-[0.3em] text-[#91816d]">
              Dr. Haider Weds Sidra •
              2026
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}