"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type GuestFormState = {
  error?: string;
  success?: string;
};

async function getAdminAndWedding() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/admin/login");
  }

  const { data: wedding } = await supabase
    .from("wedding_settings")
    .select("id")
    .limit(1)
    .single();

  if (!wedding) {
    throw new Error(
      "Wedding settings not found."
    );
  }

  return {
    supabase,
    weddingId: wedding.id,
  };
}

export async function createGuestAction(
  _previousState: GuestFormState,
  formData: FormData
): Promise<GuestFormState> {
  try {
    const {
      supabase,
      weddingId,
    } = await getAdminAndWedding();

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
      formData.get("custom_message") ?? ""
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

    if (eventIds.length === 0) {
      return {
        error:
          "Please select at least one event.",
      };
    }

    const token =
      crypto.randomBytes(24).toString("hex");

    const {
      data: guest,
      error: guestError,
    } = await supabase
      .from("guests")
      .insert({
        wedding_id: weddingId,
        name,
        display_name: displayName,
        phone: phone || null,
        invite_type: inviteType,
        custom_message:
          customMessage || null,
        invitation_scope: "both",
        token,
        is_active: true,
      })
      .select("id")
      .single();

    if (guestError || !guest) {
      return {
        error:
          guestError?.message ??
          "Unable to create invitation.",
      };
    }

    const { error: eventError } =
      await supabase
        .from("guest_events")
        .insert(
          eventIds.map((eventId) => ({
            guest_id: guest.id,
            event_id: eventId,
          }))
        );

    if (eventError) {
      await supabase
        .from("guests")
        .delete()
        .eq("id", guest.id);

      return {
        error:
          "Unable to assign selected events.",
      };
    }

    revalidatePath("/admin/guests");
    revalidatePath("/admin/dashboard");

    return {
      success:
        "Invitation created successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      error:
        "Something went wrong while creating invitation.",
    };
  }
}

export async function toggleGuestAction(
  formData: FormData
) {
  const { supabase } =
    await getAdminAndWedding();

  const guestId = String(
    formData.get("guest_id") ?? ""
  );

  const nextState =
    String(
      formData.get("next_state")
    ) === "true";

  if (!guestId) return;

  await supabase
    .from("guests")
    .update({
      is_active: nextState,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", guestId);

  revalidatePath("/admin/guests");
}