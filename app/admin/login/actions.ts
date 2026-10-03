"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Please enter your email and password.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      error: "Invalid email or password.",
    };
  }

  const { data: adminProfile, error: adminError } = await supabase
    .from("admin_profiles")
    .select("id, full_name, role")
    .eq("id", data.user.id)
    .single();

  if (adminError || !adminProfile) {
    await supabase.auth.signOut();

    return {
      error: "This account does not have administrator access.",
    };
  }

  redirect("/admin/dashboard");
}