import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export async function getInvitation(token: string) {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "[invite] Missing Supabase URL or service role key"
    );

    notFound();
  }

  const supabase = createClient(
    url,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  console.log("[invite] token:", token);
  console.log(
    "[invite] using service key:",
    true,
    "| url set:",
    true
  );

  /*
   * ==========================================
   * 1. FIND GUEST
   * ==========================================
   */

  const {
    data: guest,
    error: guestError,
  } = await supabase
    .from("guests")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  console.log(
    "[invite] guest found:",
    !!guest,
    "| error:",
    guestError?.message
  );

  if (guestError || !guest) {
    notFound();
  }

  /*
   * NOTE:
   * Development/testing ke liye is_active=false
   * ko abhi block nahi kar rahe.
   *
   * Final deployment par:
   *
   * if (!guest.is_active) {
   *   notFound();
   * }
   */

  /*
   * ==========================================
   * 2. FIND WEDDING SETTINGS
   *
   * IMPORTANT:
   * There is NO "weddings" table.
   * Project uses "wedding_settings".
   * ==========================================
   */

  let wedding: any = null;

  /*
   * First attempt:
   * wedding_settings.id may match guests.wedding_id
   */

  const {
    data: weddingById,
    error: weddingByIdError,
  } = await supabase
    .from("wedding_settings")
    .select("*")
    .eq("id", guest.wedding_id)
    .maybeSingle();

  if (weddingByIdError) {
    console.log(
      "[invite] wedding_settings by id:",
      weddingByIdError.message
    );
  }

  if (weddingById) {
    wedding = weddingById;
  }

  /*
   * Fallback:
   * This project currently represents one main
   * wedding invitation, so if IDs don't match,
   * safely use the settings row.
   */

  if (!wedding) {
    const {
      data: fallbackWedding,
      error: fallbackWeddingError,
    } = await supabase
      .from("wedding_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (fallbackWeddingError) {
      console.error(
        "[invite] wedding_settings fallback error:",
        fallbackWeddingError.message
      );
    }

    wedding = fallbackWedding;
  }

  console.log(
    "[invite] wedding settings found:",
    !!wedding
  );

  if (!wedding) {
    notFound();
  }

  /*
   * ==========================================
   * 3. LOAD EVENTS
   * ==========================================
   */

  const {
    data: events,
    error: eventsError,
  } = await supabase
    .from("events")
    .select("*")
    .eq(
      "wedding_id",
      guest.wedding_id
    )
    .order(
      "display_order",
      {
        ascending: true,
      }
    );

  if (eventsError) {
    console.error(
      "[invite] events error:",
      eventsError.message
    );
  }

  /*
   * ==========================================
   * 4. PUBLIC EVENT FILTER
   *
   * Iqra's separate Baraat/Walima are not
   * displayed in the public invitation.
   * ==========================================
   */

  const publicEvents = (
    events ?? []
  ).filter((event: any) => {
    const slug = String(
      event.slug ?? ""
    ).toLowerCase();

    const name = String(
      event.name ?? ""
    ).toLowerCase();

    if (
      slug.includes("iqra") &&
      (
        slug.includes("baraat") ||
        slug.includes("barat") ||
        slug.includes("walima")
      )
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
  });

  /*
   * ==========================================
   * 5. RETURN NORMALIZED INVITATION DATA
   * ==========================================
   */

  return {
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
      ...wedding,

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

    events: publicEvents,
  };
}