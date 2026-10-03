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

function formatWeddingDate(
  date: string | null
) {
  if (!date) return "";

  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(`${date}T12:00:00`)
  );
}

function formatTime(
  value: string | null
) {
  if (!value) return "";

  const [hourString, minute] =
    value.split(":");

  let hour = Number(hourString);

  const suffix =
    hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${suffix}`;
}

function Countdown({
  eventDate,
}: {
  eventDate?: string | null;
}) {
  const [remaining, setRemaining] =
    useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  useEffect(() => {
    if (!eventDate) return;

    function updateCountdown() {
      const target = new Date(
        `${eventDate}T18:00:00`
      ).getTime();

      const difference =
        target - Date.now();

      if (difference <= 0) {
        setRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setRemaining({
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
          (difference / 1000) % 60
        ),
      });
    }

    updateCountdown();

    const interval =
      window.setInterval(
        updateCountdown,
        1000
      );

    return () =>
      window.clearInterval(interval);
  }, [eventDate]);

  if (!eventDate) {
    return null;
  }

  const items = [
    ["Days", remaining.days],
    ["Hours", remaining.hours],
    ["Minutes", remaining.minutes],
    ["Seconds", remaining.seconds],
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {items.map(([label, value]) => (
        <div
          key={String(label)}
          className="rounded-2xl border border-[#d6c39d]/60 bg-white/45 px-2 py-4 text-center backdrop-blur"
        >
          <p className="font-serif text-2xl text-[#7a5c31] sm:text-3xl">
            {String(value).padStart(
              2,
              "0"
            )}
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-stone-500 sm:text-[10px]">
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

  const firstEvent =
    useMemo(() => {
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

  async function openInvitation() {
    setOpened(true);

    if (
      audioRef.current &&
      wedding.background_music_url
    ) {
      try {
        audioRef.current.volume = 0.45;

        await audioRef.current.play();

        setMusicPlaying(true);
      } catch {
        setMusicPlaying(false);
      }
    }

    window.setTimeout(() => {
      document
        .getElementById(
          "invitation-content"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 1350);
  }

  async function toggleMusic() {
    if (!audioRef.current) {
      return;
    }

    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setMusicPlaying(true);
      } catch {
        setMusicPlaying(false);
      }
    }
  }

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes inviteFloat {
          0%,100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes inviteGlow {
          0%,100% {
            box-shadow:
              0 18px 55px rgba(93,68,32,.12);
          }

          50% {
            box-shadow:
              0 26px 75px rgba(160,125,67,.23);
          }
        }

        @keyframes inviteReveal {
          from {
            opacity: 0;
            transform:
              translateY(45px)
              scale(.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes envelopeTop {
          0% {
            transform:
              rotateX(0deg);
            z-index: 30;
          }

          100% {
            transform:
              rotateX(180deg);
            z-index: 1;
          }
        }

        @keyframes cardRise {
          0% {
            transform:
              translateY(110px)
              scale(.92);
          }

          100% {
            transform:
              translateY(-155px)
              scale(1);
          }
        }

        @keyframes sealFade {
          0% {
            transform:
              scale(1);
            opacity: 1;
          }

          100% {
            transform:
              scale(.65);
            opacity: 0;
          }
        }

        .invite-reveal {
          animation:
            inviteReveal 1s
            cubic-bezier(.22,1,.36,1)
            both;
        }

        .invite-float {
          animation:
            inviteFloat 4s
            ease-in-out infinite;
        }

        .invite-envelope {
          animation:
            inviteGlow 4s
            ease-in-out infinite;
        }

        .envelope-open .envelope-flap {
          animation:
            envelopeTop .95s
            cubic-bezier(.2,.7,.2,1)
            forwards;
        }

        .envelope-open .inside-card {
          animation:
            cardRise 1.15s
            .58s
            cubic-bezier(.22,1,.36,1)
            forwards;
        }

        .envelope-open .wax-seal {
          animation:
            sealFade .45s
            ease forwards;
        }
      `}</style>

      {wedding.background_music_url ? (
        <audio
          ref={audioRef}
          src={
            wedding.background_music_url
          }
          loop
          preload="auto"
        />
      ) : null}

      {opened &&
      wedding.background_music_url ? (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#c8a968]/50 bg-[#221f18]/95 text-[#e7cf98] shadow-xl backdrop-blur"
          aria-label="Toggle music"
        >
          {musicPlaying ? (
            <Music2 size={18} />
          ) : (
            <Music size={18} />
          )}
        </button>
      ) : null}

      <main className="overflow-hidden bg-[#f3ede2] text-[#332c22]">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(206,180,128,.27),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(185,154,91,.22),transparent_35%)]" />

          <div className="absolute left-[-110px] top-[-80px] h-72 w-72 rounded-full border border-[#bea36e]/20" />

          <div className="absolute bottom-[-120px] right-[-100px] h-80 w-80 rounded-full border border-[#bea36e]/20" />

          <div className="relative z-10 w-full max-w-md text-center">
            <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.36em] text-[#95733d]">
              A private wedding invitation
            </p>

            <p className="mb-3 font-serif text-lg italic text-stone-600">
              Especially for
            </p>

            <h1 className="mb-10 font-serif text-3xl leading-tight text-[#3c3328] sm:text-4xl">
              {guest.display_name}
            </h1>

            <div
              className={`invite-envelope relative mx-auto h-[280px] w-full max-w-[390px] ${
                opened
                  ? "envelope-open"
                  : ""
              }`}
            >
              <div className="inside-card absolute left-[7%] top-[30px] z-10 flex h-[210px] w-[86%] translate-y-[110px] items-center justify-center rounded-sm border border-[#cfbb91] bg-[#fffaf0] shadow-2xl">
                <div className="px-5 text-center">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#9a7740]">
                    The Wedding Of
                  </p>

                  <p className="mt-4 font-serif text-3xl text-[#4a3824]">
                    {wedding.groom_short_name ||
                      wedding.groom_name}
                  </p>

                  <p className="my-1 font-serif text-xl italic text-[#b39258]">
                    &
                  </p>

                  <p className="font-serif text-3xl text-[#4a3824]">
                    {wedding.bride_short_name ||
                      wedding.bride_name}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 z-20 h-[205px] w-full overflow-hidden rounded-md border border-[#cbb98f] bg-[#e8ddc5] shadow-2xl">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at center, rgba(126,95,49,.23) 1px, transparent 1px)",
                    backgroundSize:
                      "18px 18px",
                  }}
                />

                <div className="absolute bottom-0 left-0 h-0 w-0 border-b-[205px] border-r-[195px] border-b-[#ded0b3] border-r-transparent" />

                <div className="absolute bottom-0 right-0 h-0 w-0 border-b-[205px] border-l-[195px] border-b-[#d4c29e] border-l-transparent" />
              </div>

              <div
                className="envelope-flap absolute left-0 top-[75px] z-30 h-0 w-0 origin-top border-l-[195px] border-r-[195px] border-t-[140px] border-l-transparent border-r-transparent border-t-[#d9c8a7]"
                style={{
                  transformStyle:
                    "preserve-3d",
                }}
              />

              <button
                type="button"
                onClick={openInvitation}
                disabled={opened}
                className="wax-seal absolute left-1/2 top-[170px] z-40 flex h-[76px] w-[76px] -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-[#9b6e37] bg-[#7c4d28] font-serif text-lg tracking-[0.12em] text-[#f0d69b] shadow-[0_8px_25px_rgba(70,40,17,.35)] transition hover:scale-105 disabled:pointer-events-none"
              >
                {wedding.monogram ||
                  "H&S"}
              </button>
            </div>

            {!opened ? (
              <button
                type="button"
                onClick={openInvitation}
                className="invite-float mt-10 inline-flex items-center gap-2 rounded-full border border-[#b69962]/40 bg-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#775a2f] backdrop-blur"
              >
                <Sparkles size={15} />
                Tap to open
              </button>
            ) : null}

            <ChevronDown className="mx-auto mt-12 animate-bounce text-[#a88954]" />
          </div>
        </section>

        <div
          id="invitation-content"
          className={
            opened
              ? "invite-reveal"
              : "opacity-0"
          }
        >
          <section className="relative px-5 py-24 text-center">
            <div className="mx-auto max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#99743a]">
                In the name of Allah
              </p>

              <p className="mt-8 font-serif text-xl italic text-stone-500">
                {wedding.invitation_title ||
                  "Together with their families"}
              </p>

              <h2 className="mt-8 font-serif text-[44px] leading-[1.05] text-[#413328] sm:text-6xl">
                {wedding.groom_name}
              </h2>

              <p className="my-5 font-serif text-3xl italic text-[#ae884d]">
                &
              </p>

              <h2 className="font-serif text-[44px] leading-[1.05] text-[#413328] sm:text-6xl">
                {wedding.bride_name}
              </h2>

              <div className="mx-auto mt-10 h-px w-28 bg-[#bea36a]/60" />

              <p className="mx-auto mt-9 max-w-lg text-sm leading-8 text-stone-600">
                {guest.custom_message ||
                  wedding.welcome_message}
              </p>
            </div>
          </section>

          {wedding.quranic_verse ? (
            <section className="px-5 pb-20">
              <div className="mx-auto max-w-xl rounded-[32px] border border-[#d4c19a]/60 bg-white/45 p-8 text-center backdrop-blur sm:p-10">
                <p className="font-serif text-xl leading-9 text-[#554634]">
                  {wedding.quranic_verse}
                </p>

                {wedding.quranic_reference ? (
                  <p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-[#9e7b42]">
                    {
                      wedding.quranic_reference
                    }
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {firstEvent ? (
            <section className="px-5 pb-24">
              <div className="mx-auto max-w-xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#97713a]">
                  The celebration begins in
                </p>

                <div className="mt-8">
                  <Countdown
                    eventDate={
                      firstEvent.event_date
                    }
                  />
                </div>
              </div>
            </section>
          ) : null}

          <section className="relative bg-[#e9dfcb] px-5 py-24">
            <div className="mx-auto max-w-xl">
              <div className="mb-14 text-center">
                <p className="text-[10px] uppercase tracking-[0.38em] text-[#98743d]">
                  Save the dates
                </p>

                <h2 className="mt-4 font-serif text-4xl text-[#403427]">
                  Wedding Celebrations
                </h2>
              </div>

              <div className="space-y-7">
                {events.map(
                  (event, index) => (
                    <article
                      key={event.id}
                      className="relative overflow-hidden rounded-[34px] border border-[#cdb98e]/60 bg-[#fffaf0]/90 p-7 shadow-[0_20px_60px_rgba(70,50,25,.08)] sm:p-9"
                    >
                      <div className="absolute right-[-45px] top-[-45px] h-32 w-32 rounded-full border border-[#c9aa70]/20" />

                      <div className="absolute right-[-20px] top-[-20px] h-20 w-20 rounded-full border border-[#c9aa70]/20" />

                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a753e]">
                        Celebration{" "}
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <h3 className="mt-3 font-serif text-4xl text-[#443629]">
                        {event.name}
                      </h3>

                      <div className="mt-7 space-y-5">
                        {event.event_date ? (
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee2ca] text-[#96713b]">
                              <CalendarDays
                                size={17}
                              />
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                                Date & Time
                              </p>

                              <p className="mt-1 text-sm font-medium text-stone-700">
                                {formatWeddingDate(
                                  event.event_date
                                )}
                              </p>

                              {event.start_time ? (
                                <p className="mt-1 text-xs text-stone-500">
                                  {formatTime(
                                    event.start_time
                                  )}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        {event.venue_name ? (
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee2ca] text-[#96713b]">
                              <MapPin
                                size={17}
                              />
                            </div>

                            <div>
                              <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400">
                                Venue
                              </p>

                              <p className="mt-1 text-sm font-medium text-stone-700">
                                {
                                  event.venue_name
                                }
                              </p>

                              {event.venue_address ? (
                                <p className="mt-1 max-w-sm text-xs leading-5 text-stone-500">
                                  {
                                    event.venue_address
                                  }
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {event.description ? (
                        <p className="mt-6 border-t border-[#ddcfb3] pt-5 text-sm leading-7 text-stone-500">
                          {event.description}
                        </p>
                      ) : null}

                      {event.dress_code ? (
                        <div className="mt-5 inline-flex rounded-full bg-[#f0e4cd] px-4 py-2 text-xs text-[#806136]">
                          Dress Code:{" "}
                          {event.dress_code}
                        </div>
                      ) : null}

                      {event.google_maps_url ? (
                        <div className="mt-7">
                          <a
                            href={
                              event.google_maps_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#201c16] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2ddb0] transition hover:bg-[#342b20]"
                          >
                            <MapPin
                              size={15}
                            />
                            Open Location
                          </a>
                        </div>
                      ) : null}
                    </article>
                  )
                )}
              </div>
            </div>
          </section>

          <section className="relative px-5 py-28 text-center">
            <div className="mx-auto max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.38em] text-[#99753e]">
                With love
              </p>

              <p className="mt-6 font-serif text-4xl leading-tight text-[#423529]">
                We look forward to
                celebrating with you
              </p>

              <div className="mx-auto mt-9 flex h-20 w-20 items-center justify-center rounded-full border border-[#bda16c]/50 font-serif text-xl tracking-[0.12em] text-[#896735]">
                {wedding.monogram ||
                  "H&S"}
              </div>

              {wedding.wedding_hashtag ? (
                <p className="mt-8 text-sm text-[#97743d]">
                  {
                    wedding.wedding_hashtag
                  }
                </p>
              ) : null}
            </div>
          </section>

          <footer className="border-t border-[#cbb78e]/40 px-5 py-8 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400">
              Dr. Haider Ali & Sidra
              • 2026
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}