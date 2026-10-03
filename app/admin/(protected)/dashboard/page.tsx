import { createClient } from "@/lib/supabase/server";
import {
  Users,
  Send,
  Eye,
  MessageSquareHeart,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    guestsResult,
    sentResult,
    openedResult,
    rsvpResult,
    eventsResult,
  ] = await Promise.all([
    supabase
      .from("guests")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .not("invitation_sent_at", "is", null),

    supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .not("first_opened_at", "is", null),

    supabase
      .from("rsvps")
      .select("*", { count: "exact", head: true })
      .eq("attending", true),

    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const stats = [
    {
      label: "Total Guests",
      value: guestsResult.count ?? 0,
      icon: Users,
      note: "Guest records",
    },
    {
      label: "Invitations Sent",
      value: sentResult.count ?? 0,
      icon: Send,
      note: "Shared invitations",
    },
    {
      label: "Invitations Opened",
      value: openedResult.count ?? 0,
      icon: Eye,
      note: "Unique guests",
    },
    {
      label: "RSVP Accepted",
      value: rsvpResult.count ?? 0,
      icon: MessageSquareHeart,
      note: "Event responses",
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <section className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a68548]">
          Overview
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-serif text-3xl text-[#26241f] sm:text-4xl">
              Wedding Dashboard
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage invitations, guests and celebration details.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d7c294]/50 bg-[#f4ecdc] px-4 py-2 text-xs font-medium text-[#8a6b35]">
            <CalendarDays size={15} />
            {eventsResult.count ?? 0} Active Events
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_8px_35px_rgba(40,35,25,0.04)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5efe2] text-[#9b7c43]">
                  <Icon size={19} strokeWidth={1.8} />
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-stone-300"
                />
              </div>

              <p className="mt-6 text-3xl font-semibold tracking-tight text-[#292720]">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-medium text-stone-700">
                {stat.label}
              </p>

              <p className="mt-1 text-xs text-stone-400">
                {stat.note}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <article className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-[0_8px_35px_rgba(40,35,25,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-xl text-[#292720]">
                Recent Invitations
              </p>
              <p className="mt-1 text-xs text-stone-400">
                Guest activity will appear here.
              </p>
            </div>
          </div>

          <div className="mt-8 flex min-h-56 items-center justify-center rounded-xl border border-dashed border-stone-200 bg-[#faf9f6]">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f1eadb] text-[#9d7d43]">
                <Users size={20} />
              </div>

              <p className="mt-4 text-sm font-medium text-stone-700">
                No guests yet
              </p>

              <p className="mt-1 text-xs text-stone-400">
                Guest management comes in Phase 3.
              </p>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl bg-[#1b1a16] p-6 text-white shadow-[0_14px_45px_rgba(40,35,25,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c5a766]">
            Wedding Suite
          </p>

          <h3 className="mt-4 max-w-xs font-serif text-3xl leading-tight">
            Your celebration, beautifully organized.
          </h3>

          <p className="mt-4 text-sm leading-6 text-stone-400">
            Personalized invitations, selective event access and
            RSVP management will all live here.
          </p>

          <div className="mt-10 border-t border-white/10 pt-5">
            <p className="text-xs text-stone-500">
              Private administrative workspace
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}