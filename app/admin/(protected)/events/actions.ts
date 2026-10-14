"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase production environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function updateEventAction(formData: FormData) {
  const supabase = getAdminClient();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/admin/events?error=missing-id");
  }

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    event_date: String(formData.get("event_date") ?? "").trim() || null,
    start_time: String(formData.get("start_time") ?? "").trim() || null,
    venue_name: String(formData.get("venue_name") ?? "").trim() || null,
    venue_address: String(formData.get("venue_address") ?? "").trim() || null,
    google_maps_url: String(formData.get("google_maps_url") ?? "").trim() || null,
    dress_code: String(formData.get("dress_code") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    is_active: String(formData.get("is_active")) === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("[events] update error:", error);
    redirect(`/admin/events?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/events");
  revalidatePath("/admin/guests");
  revalidatePath("/admin/dashboard");
  revalidatePath("/i/[token]", "page");

  redirect("/admin/events?saved=1");
}
