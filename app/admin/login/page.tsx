export const instant = false;
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: admin } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (admin) {
      redirect("/admin/dashboard");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f0e7]">
      <div className="absolute inset-0 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #000 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#d5bd8b]/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#b99a5b]/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-10 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_30px_100px_rgba(73,57,31,0.15)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden overflow-hidden bg-[#171713] p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,181,118,0.25),transparent_35%)]" />

            <div className="relative">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#d7bd84]/50 font-serif text-xl tracking-[0.18em] text-[#e5cb92]">
                B &amp; B
              </div>

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.34em] text-[#c9aa68]">
                Private Wedding Suite
              </p>

              <h1 className="max-w-md font-serif text-5xl leading-[1.08]">
                Every invitation,
                <br />
                personally yours.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-stone-400">
                Create personalized wedding invitations, manage guests,
                control event access and keep every RSVP in one elegant
                place.
              </p>
            </div>

            <div className="relative border-t border-white/10 pt-7">
              <p className="font-serif text-lg text-[#d5bd8b]">
                Wedding Invitation Administration
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Secure private access
              </p>
            </div>
          </section>

          <section className="p-7 sm:p-12 lg:p-14">
            <div className="mx-auto max-w-md">
              <div className="mb-9 lg:hidden">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#b99a5b]/40 font-serif text-lg tracking-[0.15em] text-[#8e713e]">
                  B &amp; B
                </div>
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a48348]">
                Admin portal
              </p>

              <h2 className="mt-3 font-serif text-4xl text-[#22211c]">
                Welcome back
              </h2>

              <p className="mb-8 mt-3 text-sm leading-6 text-stone-500">
                Sign in to manage guests, events and personalized
                invitations.
              </p>

              <LoginForm />

              <p className="mt-7 text-center text-xs text-stone-400">
                Authorized administrators only
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}