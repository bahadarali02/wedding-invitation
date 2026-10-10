"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Volume2,
  VolumeX,
} from "lucide-react";

import Envelope from "@/components/invitation/Envelope";
import Hero from "@/components/invitation/Hero";

import "./invitation.css";

const Sections = dynamic(
  () =>
    import(
      "@/components/invitation/Sections"
    ),
  {
    ssr: false,
  }
);

export type InvitationData = {
  guest: {
    id: string;
    display_name: string;
    invite_type: string;
    custom_message: string | null;
  };

  wedding: {
    groom_name: string | null;
    bride_name: string | null;

    secondary_bride_name:
      | string
      | null;

    secondary_groom_name:
      | string
      | null;

    host_line: string | null;
    welcome_message:
      | string
      | null;

    quranic_verse:
      | string
      | null;

    quranic_reference:
      | string
      | null;

    hero_image_url:
      | string
      | null;

    background_music_url:
      | string
      | null;

    venue_name_default:
      | string
      | null;

    venue_address_default:
      | string
      | null;

    thank_you_title:
      | string
      | null;

    thank_you_message:
      | string
      | null;

    music_mode:
      | string
      | null;
  };

  events: Array<{
    id: string;
    name: string;
    slug: string;

    event_date:
      | string
      | null;

    start_time:
      | string
      | null;

    venue_name:
      | string
      | null;

    venue_address:
      | string
      | null;

    google_maps_url:
      | string
      | null;

    dress_code:
      | string
      | null;

    description:
      | string
      | null;

    display_order:
      | number
      | null;
  }>;
};

type Phase =
  | "closed"
  | "opening"
  | "open"
  | "closing";

/* =========================================
   DATA MAPPING
========================================= */

export function mapData(
  d: InvitationData
) {
  const w = d.wedding;

  const venue =
    w.venue_name_default ||
    "Royal Garden Marquee";

  const address =
    w.venue_address_default ||
    "Near Grid Station, Chowk Azam Road, Layyah";

  const defaults = [
    {
      slug: "mehndi",
      name: "Mehndi",
      date:
        "30 October 2026",
      time:
        "8:00 PM",
      sub: "",
    },

    {
      slug: "baraat",
      name: "Baraat",
      date:
        "31 October 2026",
      time:
        "11:00 AM",
      sub:
        "Dr Haider Ali & Sidra Noureen",
    },

    {
      slug: "walima",
      name: "Walima",
      date:
        "1 November 2026",
      time:
        "1:00 PM – 4:00 PM",
      sub: "",
    },
  ];

  function fmtDate(
    value:
      | string
      | null
  ) {
    if (!value) {
      return "";
    }

    const date =
      new Date(
        `${value}T00:00:00`
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function fmtTime(
    value:
      | string
      | null
  ) {
    if (!value) {
      return "";
    }

    const [
      hourRaw,
      minuteRaw,
    ] = value
      .split(":")
      .map(Number);

    if (
      Number.isNaN(
        hourRaw
      )
    ) {
      return "";
    }

    const hour =
      hourRaw;

    const minute =
      Number.isNaN(
        minuteRaw
      )
        ? 0
        : minuteRaw;

    const displayHour =
      hour % 12 ||
      12;

    return `${displayHour}:${String(
      minute
    ).padStart(
      2,
      "0"
    )} ${
      hour >= 12
        ? "PM"
        : "AM"
    }`;
  }

  const allowed = [
    "mehndi",
    "baraat",
    "barat",
    "walima",
  ];

  const fromDb = [
    ...(d.events ?? []),
  ]
    .filter(
      (
        event
      ) => {
        const slug =
          String(
            event.slug ??
              ""
          ).toLowerCase();

        const name =
          String(
            event.name ??
              ""
          ).toLowerCase();

        return allowed.some(
          (
            key
          ) =>
            slug.includes(
              key
            ) ||
            name.includes(
              key
            )
        );
      }
    )
    .filter(
      (
        event
      ) => {
        const searchable =
          `${event.name ?? ""} ${event.slug ?? ""}`;

        return !/iqra/i.test(
          searchable
        );
      }
    )
    .sort(
      (
        a,
        b
      ) =>
        (
          a.display_order ??
          99
        ) -
        (
          b.display_order ??
          99
        )
    );

  const events =
    defaults.map(
      (
        fallback
      ) => {
        const event =
          fromDb.find(
            (
              item
            ) => {
              const searchable =
                `${item.slug ?? ""} ${item.name ?? ""}`.toLowerCase();

              if (
                fallback.slug ===
                "baraat"
              ) {
                return (
                  searchable.includes(
                    "baraat"
                  ) ||
                  searchable.includes(
                    "barat"
                  )
                );
              }

              return searchable.includes(
                fallback.slug
              );
            }
          );

        const mappedDate =
          fmtDate(
            event?.event_date ??
              null
          );

        let mappedTime =
          fmtTime(
            event?.start_time ??
              null
          );

        /*
         * Walima approved display
         * remains 1 PM - 4 PM because
         * current DB structure has
         * only start_time.
         */
        if (
          fallback.slug ===
          "walima"
        ) {
          mappedTime =
            fallback.time;
        }

        return {
          key:
            fallback.slug,

          name:
            fallback.name,

          sub:
            fallback.sub,

          date:
            mappedDate ||
            fallback.date,

          time:
            mappedTime ||
            fallback.time,

          venue:
            event?.venue_name ||
            venue,

          address:
            event?.venue_address ||
            address,

          maps:
            event?.google_maps_url ||
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${venue} ${address}`
            )}`,
        };
      }
    );

  return {
    guest:
      d.guest
        .display_name ||
      "Dear Guest",

    message:
      d.guest
        .custom_message
        ?.trim() ||
      w.welcome_message
        ?.trim() ||
      "Join us as we celebrate love, family, and the beginning of two beautiful new journeys. Your presence will make these cherished moments even more special.",

    host:
      "MR & MRS. DR ASGHAR ALI",

    hostLine:
      w.host_line ||
      "MR & MRS. Dr Asghar Ali request the pleasure of your company at the wedding ceremony of their beloved son and daughter",

    c1: [
      w.groom_name ||
        "Dr Haider Ali",

      w.bride_name ||
        "Sidra Noureen",
    ] as [
      string,
      string
    ],

    c2: [
      w.secondary_bride_name ||
        "Iqra Asghar",

      w.secondary_groom_name ||
        "M Zunair",
    ] as [
      string,
      string
    ],

    verse:
      w.quranic_verse ||
      "And among His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.",

    ref:
      w.quranic_reference ||
      "Surah Ar-Rum 30:21",

    thankTitle:
      w.thank_you_title ||
      "Thank you for being part of our celebrations",

    thankMsg:
      w.thank_you_message ||
      "Your presence will make these beautiful moments even more memorable.",

    heroImage:
      w.hero_image_url,

    music:
      w.background_music_url,

    events,
  };
}

export type Mapped =
  ReturnType<
    typeof mapData
  >;

/* =========================================
   MUSIC
========================================= */

function useMusic(
  url:
    | string
    | null
) {
  const [
    on,
    setOn,
  ] =
    useState(
      false
    );

  const audio =
    useRef<HTMLAudioElement | null>(
      null
    );

  const ctx =
    useRef<AudioContext | null>(
      null
    );

  const timer =
    useRef<
      number | undefined
    >(
      undefined
    );

  const fade =
    useRef<
      number | undefined
    >(
      undefined
    );

  const ramp =
    useCallback(
      (
        to: number,
        ms: number,
        done?: () => void
      ) => {
        window.clearInterval(
          fade.current
        );

        const a =
          audio.current;

        const g =
          (
            ctx.current as
              | (
                  AudioContext & {
                    __g?: GainNode;
                  }
                )
              | null
          )?.__g;

        const from =
          a
            ? a.volume
            : g
              ? g.gain.value
              : 0;

        const start =
          performance.now();

        fade.current =
          window.setInterval(
            () => {
              const progress =
                Math.min(
                  1,
                  (
                    performance.now() -
                    start
                  ) /
                    ms
                );

              const value =
                from +
                (
                  to -
                  from
                ) *
                  progress;

              if (a) {
                a.volume =
                  Math.max(
                    0,
                    Math.min(
                      1,
                      value
                    )
                  );
              }

              if (g) {
                g.gain.value =
                  Math.max(
                    0,
                    value
                  );
              }

              if (
                progress >=
                1
              ) {
                window.clearInterval(
                  fade.current
                );

                done?.();
              }
            },
            40
          );
      },
      []
    );

  const play =
    useCallback(
      () => {
        setOn(true);

        /*
         * Actual uploaded music
         */

        if (url) {
          if (
            !audio.current
          ) {
            const created =
              new Audio(
                url
              );

            created.loop =
              true;

            created.volume =
              0;

            audio.current =
              created;
          }

          const current =
            audio.current;

          current
            .play()
            .catch(
              () => {}
            );

          ramp(
            0.55,
            3000
          );

          return;
        }

        /*
         * Elegant fallback chime
         */

        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          )
            .webkitAudioContext;

        if (
          !AudioContextClass
        ) {
          return;
        }

        let context =
          ctx.current;

        if (!context) {
          context =
            new AudioContextClass();

          ctx.current =
            context;
        }

        void context.resume();

        const extendedContext =
          context as AudioContext & {
            __g?: GainNode;
          };

        let masterGain =
          extendedContext.__g;

        if (
          !masterGain
        ) {
          masterGain =
            context.createGain();

          masterGain.gain.value =
            0;

          masterGain.connect(
            context.destination
          );

          extendedContext.__g =
            masterGain;
        }

        ramp(
          0.45,
          2800
        );

        const notes = [
          523.25,
          659.25,
          783.99,
          987.77,
          783.99,
          659.25,
        ];

        let index =
          0;

        const chime =
          () => {
            if (
              !ctx.current
            ) {
              return;
            }

            const c =
              ctx.current;

            const gain =
              (
                c as AudioContext & {
                  __g?: GainNode;
                }
              ).__g;

            if (!gain) {
              return;
            }

            const oscillator =
              c.createOscillator();

            const envelope =
              c.createGain();

            oscillator.type =
              "sine";

            const currentNote =
              notes[
                index %
                  notes.length
              ];

            index += 1;

            oscillator.frequency.value =
              currentNote;

            envelope.gain.setValueAtTime(
              0.0001,
              c.currentTime
            );

            envelope.gain.exponentialRampToValueAtTime(
              0.1,
              c.currentTime +
                0.05
            );

            envelope.gain.exponentialRampToValueAtTime(
              0.0001,
              c.currentTime +
                2.5
            );

            oscillator.connect(
              envelope
            );

            envelope.connect(
              gain
            );

            oscillator.start();

            oscillator.stop(
              c.currentTime +
                2.6
            );
          };

        chime();

        window.clearInterval(
          timer.current
        );

        timer.current =
          window.setInterval(
            chime,
            2100
          );
      },
      [
        url,
        ramp,
      ]
    );

  const stop =
    useCallback(
      (
        ms = 1800
      ) => {
        setOn(false);

        ramp(
          0,
          ms,
          () => {
            audio.current?.pause();

            window.clearInterval(
              timer.current
            );

            if (
              ctx.current?.state ===
              "running"
            ) {
              void ctx.current.suspend();
            }
          }
        );
      },
      [
        ramp,
      ]
    );

  useEffect(
    () => {
      return () => {
        window.clearInterval(
          timer.current
        );

        window.clearInterval(
          fade.current
        );

        audio.current?.pause();

        if (
          ctx.current &&
          ctx.current.state !==
            "closed"
        ) {
          void ctx.current.close();
        }
      };
    },
    []
  );

  return {
    on,
    play,
    stop,
  };
}

/* =========================================
   INVITATION CLIENT
========================================= */

export default function InvitationClient({
  data,
}: {
  data: InvitationData;
}) {
  const mapped =
    useMemo(
      () =>
        mapData(
          data
        ),
      [
        data,
      ]
    );

  const [
    phase,
    setPhase,
  ] =
    useState<Phase>(
      "closed"
    );

  const music =
    useMusic(
      mapped.music
    );

  const open =
    useCallback(
      () => {
        if (
          phase !==
          "closed"
        ) {
          return;
        }

        setPhase(
          "opening"
        );

        music.play();

        window.setTimeout(
          () => {
            setPhase(
              "open"
            );
          },
          5200
        );
      },
      [
        phase,
        music,
      ]
    );

  const close =
    useCallback(
      () => {
        if (
          phase ===
          "closing"
        ) {
          return;
        }

        setPhase(
          "closing"
        );

        music.stop();

        window.setTimeout(
          () => {
            window.scrollTo({
              top: 0,
              behavior:
                "instant",
            });

            setPhase(
              "closed"
            );
          },
          7500
        );
      },
      [
        phase,
        music,
      ]
    );

  /*
   * Lock page scroll while
   * envelope is closed/opening
   */

  useEffect(
    () => {
      const oldOverflow =
        document.body
          .style
          .overflow;

      document.body.style.overflow =
        phase ===
        "open"
          ? ""
          : "hidden";

      return () => {
        document.body.style.overflow =
          oldOverflow;
      };
    },
    [
      phase,
    ]
  );

  return (
    <main className="inv-root">

      <div
        className="inv-ambient"
        aria-hidden="true"
      />

      <div className="inv-canvas">

        {/* ============================
            ENVELOPE
        ============================ */}

        <AnimatePresence>
          {(
            phase ===
              "closed" ||
            phase ===
              "opening"
          ) && (
            <motion.div
              key="envelope"
              className="inv-layer"
              initial={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.025,
                filter:
                  "blur(4px)",
              }}
              transition={{
                duration: 1,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            >
              <Envelope
                opening={
                  phase ===
                  "opening"
                }
                onOpen={
                  open
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================
            INVITATION CONTENT
        ============================ */}

        {(
          phase ===
            "opening" ||
          phase ===
            "open" ||
          phase ===
            "closing"
        ) && (
          <motion.div
            className={
              phase ===
              "open"
                ? "inv-scroll"
                : "inv-layer inv-pre"
            }
            initial={{
              opacity: 0,
              scale: 1.06,
              filter:
                "blur(10px)",
            }}
            animate={
              phase ===
              "opening"
                ? {
                    opacity:
                      0,
                    scale:
                      1.04,
                    filter:
                      "blur(8px)",
                  }
                : {
                    opacity:
                      1,
                    scale:
                      1,
                    filter:
                      "blur(0px)",
                  }
            }
            transition={{
              duration: 1.8,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <Hero
              m={
                mapped
              }
            />

            <Sections
              m={
                mapped
              }
              onClose={
                close
              }
              closing={
                phase ===
                "closing"
              }
            />
          </motion.div>
        )}

        {/* ============================
            FINAL CLOSE SCREEN
        ============================ */}

        <AnimatePresence>
          {phase ===
            "closing" && (
            <motion.div
              className="inv-final"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                delay: 3,
                duration: 2.2,
              }}
            >
              <motion.p
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 4.6,
                  duration: 1.6,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                With love,
                we’ll see you
                there.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ============================
          MUSIC BUTTON
      ============================ */}

      {(
        phase ===
          "open" ||
        phase ===
          "opening"
      ) && (
        <button
          type="button"
          className="inv-music"
          aria-label={
            music.on
              ? "Pause music"
              : "Play music"
          }
          onClick={() => {
            if (
              music.on
            ) {
              music.stop(
                600
              );
            } else {
              music.play();
            }
          }}
        >
          {music.on ? (
            <Volume2
              size={
                16
              }
            />
          ) : (
            <VolumeX
              size={
                16
              }
            />
          )}
        </button>
      )}

    </main>
  );
}