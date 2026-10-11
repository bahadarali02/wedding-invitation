"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export type GuestFormState = {
  error?: string;
  success?: string;
};

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase production environment variables are missing."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

async function getWedding() {
  const supabase = getAdminClient();

  const {
    data: wedding,
    error,
  } = await supabase
    .from("wedding_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (error || !wedding) {
    console.error(
      "[wedding-settings]",
      error
    );

    throw new Error(
      "Wedding settings not found."
    );
  }

  return {
    supabase,
    weddingId: wedding.id,
  };
}

async function generateShortToken(
  supabase: ReturnType<typeof getAdminClient>
) {
  for (
    let attempt = 0;
    attempt < 10;
    attempt++
  ) {
    const token = crypto
      .randomBytes(6)
      .toString("base64url")
      .slice(0, 8);

    const {
      data: existing,
      error,
    } = await supabase
      .from("guests")
      .select("id")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      console.error(
        "[token-check]",
        error
      );
    }

    if (!existing) {
      return token;
    }
  }

  return crypto
    .randomBytes(8)
    .toString("base64url");
}

export async function createGuestAction(
  _previousState: GuestFormState,
  formData: FormData
): Promise<GuestFormState> {
  try {
    const {
      supabase,
      weddingId,
    } = await getWedding();

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const displayName = String(
      formData.get("display_name") ?? ""
    ).trim();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    const inviteType = String(
      formData.get("invite_type") ??
        "individual"
    );

    const customMessage = String(
      formData.get("custom_message") ??
        ""
    ).trim();

    const eventIds = formData
      .getAll("event_ids")
      .map(String)
      .filter(Boolean);

    if (!name || !displayName) {
      return {
        error:
          "Guest name and invitation name are required.",
      };
    }

    if (
      eventIds.length === 0
    ) {
      return {
        error:
          "Please select at least one event.",
      };
    }

    const token =
      await generateShortToken(
        supabase
      );

    const {
      data: guest,
      error: guestError,
    } = await supabase
      .from("guests")
      .insert({
        wedding_id:
          weddingId,

        name,

        display_name:
          displayName,

        phone:
          phone || null,

        invite_type:
          inviteType,

        custom_message:
          customMessage ||
          null,

        invitation_scope:
          "both",

        token,

        is_active:
          true,
      })
      .select(
        "id, token"
      )
      .single();

    if (
      guestError ||
      !guest
    ) {
      console.error(
        "[guest-create]",
        guestError
      );

      return {
        error:
          guestError?.message ??
          "Unable to create invitation.",
      };
    }

    const {
      error:
        eventError,
    } =
      await supabase
        .from(
          "guest_events"
        )
        .insert(
          eventIds.map(
            (
              eventId
            ) => ({
              guest_id:
                guest.id,

              event_id:
                eventId,
            })
          )
        );

    if (eventError) {
      console.error(
        "[guest-events]",
        eventError
      );

      await supabase
        .from("guests")
        .delete()
        .eq(
          "id",
          guest.id
        );

      return {
        error:
          "Unable to assign selected events.",
      };
    }

    revalidatePath(
      "/admin/guests"
    );

    revalidatePath(
      "/admin/dashboard"
    );

    return {
      success:
        "Invitation created successfully.",
    };
  } catch (error) {
    console.error(
      "[createGuestAction]",
      error
    );

    return {
      error:
        "Something went wrong while creating invitation.",
    };
  }
}

export async function toggleGuestAction(
  formData: FormData
) {
  try {
    const {
      supabase,
    } =
      await getWedding();

    const guestId =
      String(
        formData.get(
          "guest_id"
        ) ?? ""
      );

    const nextState =
      String(
        formData.get(
          "next_state"
        )
      ) === "true";

    if (!guestId) {
      return;
    }

    const {
      error,
    } =
      await supabase
        .from(
          "guests"
        )
        .update({
          is_active:
            nextState,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          guestId
        );

    if (error) {
      console.error(
        "[guest-toggle]",
        error
      );
    }

    revalidatePath(
      "/admin/guests"
    );
  } catch (error) {
    console.error(
      "[toggleGuestAction]",
      error
    );
  }
}