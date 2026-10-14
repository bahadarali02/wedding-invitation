export const instant = false;

import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, CalendarDays, Clock3, MapPin } from "lucide-react";
import { updateEventAction } from "./actions";

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

type PageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = getAdminClient();

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select(`
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
    `)
    .order("display_order", { ascending: true });

  if (eventsError) {
    console.error("[events-page] load error:", eventsError);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a68548]">
        Wedding Schedule
      </p>

      <h1 className="mt-2 font-serif text-4xl text-[#26241f]">
        Events
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
        Dates, timings, venue, Google Maps link aur descriptions yahan se update karein.
      </p>

      {params.saved === "1" && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={17} />
          Event successfully updated. Invitation par new details live hain.
        </div>
      )}

      {params.error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Event save nahi hua. {params.error}
        </div>
      )}

      {eventsError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Events load nahi ho sake: {eventsError.message}
        </div>
      )}

      {!eventsError && !events?.length && (
        <div className="mt-8 rounded-3xl border border-dashed border-stone-200 bg-white p-8 text-sm text-stone-500">
          Koi event record nahi mila.
        </div>
      )}

      <div className="mt-8 space-y-6">
        {(events ?? []).map((event: any) => (
          <form
            key={event.id}
            action={updateEventAction}
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
          >
            <input type="hidden" name="id" value={event.id} />

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                  {event.slug}
                </p>
                <h2 className="mt-2 font-serif text-2xl text-[#26241f]">
                  {event.name}
                </h2>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={event.is_active}
                  className="h-4 w-4 accent-[#9b793d]"
                />
                Event active
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Event Name">
                <input
                  name="name"
                  defaultValue={event.name ?? ""}
                  required
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </Field>

              <Field label="Date" icon={<CalendarDays size={15} />}>
                <input
                  type="date"
                  name="event_date"
                  defaultValue={event.event_date ?? ""}
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </Field>

              <Field label="Time" icon={<Clock3 size={15} />}>
                <input
                  type="time"
                  name="start_time"
                  defaultValue={event.start_time ? String(event.start_time).slice(0, 5) : ""}
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </Field>

              <Field label="Dress Code">
                <input
                  name="dress_code"
                  defaultValue={event.dress_code ?? ""}
                  placeholder="Optional"
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </Field>

              <Field label="Venue" icon={<MapPin size={15} />}>
                <input
                  name="venue_name"
                  defaultValue={event.venue_name ?? ""}
                  placeholder="Venue name"
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </Field>

              <Field label="Google Maps URL">
                <input
                  type="url"
                  name="google_maps_url"
                  defaultValue={event.google_maps_url ?? ""}
                  placeholder="https://maps.google.com/..."
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </Field>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Venue Address
              </label>
              <textarea
                name="venue_address"
                defaultValue={event.venue_address ?? ""}
                rows={2}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-stone-700">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={event.description ?? ""}
                rows={3}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-[#181713] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2d2b24]"
              >
                Save Event
              </button>
              <span className="text-xs text-stone-400">
                Save ke baad invitation ki details automatically update ho jayengi.
              </span>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-700">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
