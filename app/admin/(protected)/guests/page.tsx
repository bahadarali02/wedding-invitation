export const instant = false;

import Link from "next/link";
import {
  Eye,
  ShieldCheck,
  ShieldOff,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import CreateGuestForm from "@/components/admin/create-guest-form";
import CopyInviteLink from "@/components/admin/copy-invite-link";
import WhatsAppShare from "@/components/admin/whatsapp-share";

import { toggleGuestAction } from "./actions";

export default async function GuestsPage() {
  const supabase = await createClient();

  const { data: wedding } = await supabase
    .from("wedding_settings")
    .select("id")
    .limit(1)
    .single();

  if (!wedding) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
        Wedding settings not found.
      </div>
    );
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, name, slug")
    .eq("wedding_id", wedding.id)
    .eq("is_active", true)
    .order("display_order");

  const { data: guests } = await supabase
    .from("guests")
    .select(`
      id,
      name,
      display_name,
      phone,
      invite_type,
      invitation_scope,
      token,
      is_active,
      created_at,
      guest_events (
        event_id,
        events (
          id,
          name
        )
      )
    `)
    .eq("wedding_id", wedding.id)
    .order("created_at", {
      ascending: false,
    });

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a68548]">
          Guest Management
        </p>

        <h1 className="mt-2 font-serif text-4xl text-[#26241f]">
          Personalized Invitations
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
          Guest-wise decide karo ke invitation me sirf Haider side,
          sirf Iqra side ya dono show hon.
        </p>
      </div>

      <CreateGuestForm events={events ?? []} />

      <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-2xl text-[#26241f]">
              Guest Invitations
            </p>

            <p className="mt-1 text-sm text-stone-400">
              {guests?.length ?? 0} invitations created
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5efe2] text-[#97763d]">
            <Users size={19} />
          </div>
        </div>

        {!guests?.length ? (
          <div className="mt-7 rounded-2xl border border-dashed border-stone-200 bg-[#faf9f6] px-6 py-14 text-center">
            <p className="text-sm font-medium text-stone-700">
              No guest invitations yet
            </p>

            <p className="mt-1 text-xs text-stone-400">
              Create your first personalized invitation above.
            </p>
          </div>
        ) : (
          <div className="mt-7 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-stone-200 text-left">
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Guest
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Type
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Card Content
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Events
                  </th>
                  <th className="pb-4 pr-6 text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Status
                  </th>
                  <th className="pb-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {guests.map((guest: any) => {
                  const guestEvents =
                    guest.guest_events
                      ?.map(
                        (item: any) =>
                          item.events?.name
                      )
                      .filter(Boolean) ?? [];

                  return (
                    <tr
                      key={guest.id}
                      className="border-b border-stone-100 last:border-none"
                    >
                      <td className="py-5 pr-6">
                        <p className="text-sm font-semibold text-stone-800">
                          {guest.display_name}
                        </p>

                        <p className="mt-1 text-xs text-stone-400">
                          {guest.phone || "No WhatsApp number"}
                        </p>
                      </td>

                      <td className="py-5 pr-6">
                        <p className="text-sm capitalize text-stone-600">
                          {guest.invite_type}
                        </p>
                      </td>

                      <td className="py-5 pr-6">
                        <p className="text-sm capitalize text-stone-600">
                          {guest.invitation_scope === "both"
                            ? "Both weddings"
                            : guest.invitation_scope === "haider"
                              ? "Only Haider side"
                              : "Only Iqra side"}
                        </p>
                      </td>

                      <td className="py-5 pr-6">
                        <div className="flex max-w-xs flex-wrap gap-1.5">
                          {guestEvents.map(
                            (eventName: string) => (
                              <span
                                key={eventName}
                                className="rounded-full bg-[#f5efe2] px-2.5 py-1 text-[11px] font-medium text-[#8d6e38]"
                              >
                                {eventName}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      <td className="py-5 pr-6">
                        {guest.is_active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            <ShieldCheck size={13} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
                            <ShieldOff size={13} />
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="py-5">
                        <div className="flex justify-end gap-4">
                          <Link
                            href={`/i/${guest.token}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8f7039] hover:text-[#684f27]"
                          >
                            <Eye size={14} />
                            Preview
                          </Link>

                          <CopyInviteLink token={guest.token} />

                          <WhatsAppShare
                            token={guest.token}
                            phone={guest.phone}
                            displayName={guest.display_name}
                          />

                          <form action={toggleGuestAction}>
                            <input
                              type="hidden"
                              name="guest_id"
                              value={guest.id}
                            />

                            <input
                              type="hidden"
                              name="next_state"
                              value={String(!guest.is_active)}
                            />

                            <button
                              type="submit"
                              className="text-xs font-medium text-stone-400 transition hover:text-stone-700"
                            >
                              {guest.is_active
                                ? "Disable"
                                : "Enable"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}