"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function getAdmin() {
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

  return supabase;
}

export async function updateEventAction(
  formData: FormData
) {
  const supabase = await getAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) return;

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    event_date:
      String(formData.get("event_date") ?? "").trim() || null,
    start_time:
      String(formData.get("start_time") ?? "").trim() || null,
    venue_name:
      String(formData.get("venue_name") ?? "").trim() || null,
    venue_address:
      String(formData.get("venue_address") ?? "").trim() || null,
    google_maps_url:
      String(formData.get("google_maps_url") ?? "").trim() || null,
    dress_code:
      String(formData.get("dress_code") ?? "").trim() || null,
    description:
      String(formData.get("description") ?? "").trim() || null,
    is_active:
      String(formData.get("is_active")) === "on",
    updated_at: new Date().toISOString(),
  };

  await supabase.from("events").update(payload).eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/admin/guests");
}