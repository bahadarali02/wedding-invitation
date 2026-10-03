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

  const { data: wedding, error: weddingError } = await supabase
    .from("wedding_settings")
    .select("id")
    .limit(1)
    .single();

  if (weddingError || !wedding) {
    throw new Error("Wedding settings not found.");
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
    const { supabase, weddingId } = await getAdminAndWedding();

    const name = String(formData.get("name") ?? "").trim();

    const displayName = String(
      formData.get("display_name") ?? ""
    ).trim();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    const inviteType = String(
      formData.get("invite_type") ?? "individual"
    );

    const customMessage = String(
      formData.get("custom_message") ?? ""
    ).trim();

    const eventIds = formData
      .getAll("event_ids")
      .map((value) => String(value))
      .filter(Boolean);

    if (!name) {
      return {
        error: "Guest name is required.",
      };
    }

    if (!displayName) {
      return {
        error: "Invitation display name is required.",
      };
    }

    if (
      !["individual", "couple", "family"].includes(inviteType)
    ) {
      return {
        error: "Invalid invitation type.",
      };
    }

    if (eventIds.length === 0) {
      return {
        error: "Please select at least one event.",
      };
    }

    const token = crypto.randomBytes(24).toString("hex");

    const { data: guest, error: guestError } = await supabase
      .from("guests")
      .insert({
        wedding_id: weddingId,
        name,
        display_name: displayName,
        phone: phone || null,
        invite_type: inviteType,
        custom_message: customMessage || null,
        token,
        is_active: true,
      })
      .select("id")
      .single();

    if (guestError || !guest) {
      console.error("Guest insert error:", guestError);

      return {
        error:
          guestError?.message ??
          "Unable to create personalized invitation.",
      };
    }

    const eventRows = eventIds.map((eventId) => ({
      guest_id: guest.id,
      event_id: eventId,
    }));

    const { error: eventError } = await supabase
      .from("guest_events")
      .insert(eventRows);

    if (eventError) {
      await supabase
        .from("guests")
        .delete()
        .eq("id", guest.id);

      console.error("Guest event insert error:", eventError);

      return {
        error: "Unable to assign events to this guest.",
      };
    }

    revalidatePath("/admin/guests");
    revalidatePath("/admin/dashboard");

    return {
      success: "Personalized invitation created successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Something went wrong while creating invitation.",
    };
  }
}

export async function toggleGuestAction(
  formData: FormData
) {
  const { supabase } = await getAdminAndWedding();

  const guestId = String(
    formData.get("guest_id") ?? ""
  );

  const nextState =
    String(formData.get("next_state")) === "true";

  if (!guestId) {
    return;
  }

  await supabase
    .from("guests")
    .update({
      is_active: nextState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", guestId);

  revalidatePath("/admin/guests");
  revalidatePath("/admin/dashboard");
}