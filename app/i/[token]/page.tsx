import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import InvitationClient from "./invitation-client";

export const instant = false;

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitationPage({
  params,
}: PageProps) {
  const { token } = await params;

  if (!token) {
    notFound();
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "[invite] Supabase URL or service role key missing"
    );

    notFound();
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  /*
   * ----------------------------------------
   * Guest
   * ----------------------------------------
   */

  const {
    data: guest,
    error: guestError,
  } = await supabase
    .from("guests")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (guestError) {
    console.error(
      "[invite] guest error:",
      guestError
    );

    notFound();
  }

  if (!guest) {
    console.error(
      "[invite] guest not found:",
      token
    );

    notFound();
  }

  console.log(
    "[invite] guest:",
    guest.display_name
  );

  /*
   * IMPORTANT:
   *
   * DO NOT query "weddings".
   *
   * Your project uses:
   * wedding_settings
   */

  let wedding: any = null;

  /*
   * First try matching guest.wedding_id.
   */

  const {
    data: matchedWedding,
    error: matchedWeddingError,
  } = await supabase
    .from("wedding_settings")
    .select("*")
    .eq("id", guest.wedding_id)
    .maybeSingle();

  if (matchedWeddingError) {
    console.error(
      "[invite] wedding_settings matched lookup:",
      matchedWeddingError
    );
  }

  wedding = matchedWedding;

  /*
   * Fallback:
   * your project currently has one wedding,
   * so get the first settings row if IDs
   * are not aligned.
   */

  if (!wedding) {
    const {
      data: fallbackWedding,
      error: fallbackError,
    } = await supabase
      .from("wedding_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (fallbackError) {
      console.error(
        "[invite] wedding_settings fallback:",
        fallbackError
      );
    }

    wedding = fallbackWedding;
  }

  if (!wedding) {
    console.error(
      "[invite] wedding_settings row not found"
    );

    notFound();
  }

  console.log(
    "[invite] wedding settings found"
  );

  /*
   * ----------------------------------------
   * Selected guest events
   * ----------------------------------------
   */

  const {
    data: guestEventRows,
    error: guestEventError,
  } = await supabase
    .from("guest_events")
    .select(`
      event_id,
      events (
        id,
        name,
        slug,
        event_date,
        start_time,
        venue_name,
        venue_address,
        google_maps_url,
        dress_code,
        description,
        display_order,
        is_active
      )
    `)
    .eq("guest_id", guest.id);

  if (guestEventError) {
    console.error(
      "[invite] guest events error:",
      guestEventError
    );
  }

  const allSelectedEvents = (
    guestEventRows ?? []
  )
    .flatMap((row: any) => {
      if (!row.events) {
        return [];
      }

      return Array.isArray(row.events)
        ? row.events
        : [row.events];
    })
    .filter(
      (event: any) =>
        event &&
        event.is_active !== false
    )
    .sort(
      (a: any, b: any) =>
        Number(
          a.display_order ?? 999
        ) -
        Number(
          b.display_order ?? 999
        )
    );

  /*
   * PUBLIC TIMELINE:
   *
   * only Mehndi,
   * Haider Baraat,
   * Haider Walima.
   *
   * No separate Iqra Baraat / Walima.
   */

  const events =
    allSelectedEvents.filter(
      (event: any) => {
        const slug = String(
          event.slug ?? ""
        ).toLowerCase();

        const name = String(
          event.name ?? ""
        ).toLowerCase();

        if (
          slug === "iqra-baraat" ||
          slug === "iqra-walima"
        ) {
          return false;
        }

        if (
          name.includes("iqra") &&
          (
            name.includes("baraat") ||
            name.includes("barat") ||
            name.includes("walima")
          )
        ) {
          return false;
        }

        return true;
      }
    );

  /*
   * ----------------------------------------
   * Client payload
   * ----------------------------------------
   */

  const invitation = {
    guest: {
      id: guest.id,

      display_name:
        guest.display_name ||
        guest.name ||
        "Dear Guest",

      invite_type:
        guest.invite_type ||
        "family",

      custom_message:
        guest.custom_message ??
        null,
    },

    wedding: {
      groom_name:
        wedding.groom_name ||
        "Dr Haider Ali",

      bride_name:
        wedding.bride_name ||
        "Sidra Noureen",

      secondary_bride_name:
        wedding.secondary_bride_name ||
        "Iqra Asghar",

      secondary_groom_name:
        wedding.secondary_groom_name ||
        "M Zunair",

      host_line:
        wedding.host_line ||
        "MR & MRS. Dr Asghar Ali request the pleasure of your company at the wedding ceremony of their beloved son and daughter",

      welcome_message:
        wedding.welcome_message ||
        "Join us as we celebrate love, family, and the beginning of two beautiful new journeys. Your presence will make these cherished moments even more special.",

      quranic_verse:
        wedding.quranic_verse ||
        "And among His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.",

      quranic_reference:
        wedding.quranic_reference ||
        "Surah Ar-Rum 30:21",

      hero_image_url:
        wedding.hero_image_url ??
        null,

      background_music_url:
        wedding.background_music_url ??
        null,

      music_mode:
        wedding.music_mode ??
        null,

      venue_name_default:
        wedding.venue_name_default ||
        "Royal Garden Marquee",

      venue_address_default:
        wedding.venue_address_default ||
        "Near Grid Station, Chowk Azam Road, Layyah",

      thank_you_title:
        wedding.thank_you_title ||
        "Thank you for being part of our celebrations",

      thank_you_message:
        wedding.thank_you_message ||
        "Your presence will make these beautiful moments even more memorable.",
    },

    events,
  };

 return (
  <InvitationClient
    data={invitation}
  />
);
}