export const instant = false;

import { createClient } from "@/lib/supabase/server";
import { updateEventAction } from "./actions";

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
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
    .order("display_order");

  return (
    <div className="mx-auto max-w-[1400px]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a68548]">
        Wedding Schedule
      </p>

      <h1 className="mt-2 font-serif text-4xl text-[#26241f]">
        Events
      </h1>

      <p className="mt-3 text-sm text-stone-500">
        Yahan se dates, timings, venue, map aur descriptions change kar sakte ho.
      </p>

      <div className="mt-8 space-y-6">
        {events?.map((event: any) => (
          <form
            key={event.id}
            action={updateEventAction}
            className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <input type="hidden" name="id" value={event.id} />

            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                {event.slug}
              </p>

              <h2 className="mt-2 font-serif text-2xl text-[#26241f]">
                {event.name}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Event Name
                </label>
                <input
                  name="name"
                  defaultValue={event.name ?? ""}
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  defaultValue={event.event_date ?? ""}
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Time
                </label>
                <input
                  type="time"
                  name="start_time"
                  defaultValue={event.start_time ?? ""}
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Dress Code
                </label>
                <input
                  name="dress_code"
                  defaultValue={event.dress_code ?? ""}
                  placeholder="Optional"
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Venue
                </label>
                <input
                  name="venue_name"
                  defaultValue={event.venue_name ?? ""}
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Google Maps URL
                </label>
                <input
                  name="google_maps_url"
                  defaultValue={event.google_maps_url ?? ""}
                  placeholder="https://maps.google.com/..."
                  className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
                />
              </div>
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

            <label className="mt-5 inline-flex items-center gap-3 text-sm text-stone-700">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={event.is_active}
                className="h-4 w-4 accent-[#9b793d]"
              />
              Event active
            </label>

            <div className="mt-6">
              <button
                type="submit"
                className="rounded-xl bg-[#181713] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2b24]"
              >
                Save Event
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}