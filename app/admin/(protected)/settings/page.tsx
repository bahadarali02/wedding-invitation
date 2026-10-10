export const instant = false;

import { createClient } from "@/lib/supabase/server";
import { updateWeddingSettingsAction } from "./actions";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("wedding_settings")
    .select("*")
    .limit(1)
    .single();

  return (
    <div className="mx-auto max-w-[1200px]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a68548]">
        Configuration
      </p>

      <h1 className="mt-2 font-serif text-4xl text-[#26241f]">
        Wedding Settings
      </h1>

      <p className="mt-3 text-sm text-stone-500">
        Yahan se names, privacy, Quranic verse, thank-you text aur music control kar sakte ho.
      </p>

      <form
        action={updateWeddingSettingsAction}
        className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Host Line
            </label>
            <textarea
              name="host_line"
              rows={3}
              defaultValue={settings?.host_line ?? ""}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Groom Name (Primary)
            </label>
            <input
              name="groom_name"
              defaultValue={settings?.groom_name ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Bride Name (Primary)
            </label>
            <input
              name="bride_name"
              defaultValue={settings?.bride_name ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Bride Name (Secondary)
            </label>
            <input
              name="secondary_bride_name"
              defaultValue={settings?.secondary_bride_name ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Groom Name (Secondary)
            </label>
            <input
              name="secondary_groom_name"
              defaultValue={settings?.secondary_groom_name ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Hidden text for Sidra
            </label>
            <input
              name="bride_placeholder_text"
              defaultValue={settings?.bride_placeholder_text ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Hidden text for Iqra
            </label>
            <input
              name="secondary_bride_placeholder_text"
              defaultValue={settings?.secondary_bride_placeholder_text ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Default Venue Name
            </label>
            <input
              name="venue_name_default"
              defaultValue={settings?.venue_name_default ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Default Venue Address
            </label>
            <input
              name="venue_address_default"
              defaultValue={settings?.venue_address_default ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="inline-flex items-center gap-3 rounded-xl border border-stone-200 p-4">
            <input
              type="checkbox"
              name="show_sidra_name_default"
              defaultChecked={settings?.show_sidra_name_default ?? true}
              className="h-4 w-4 accent-[#9b793d]"
            />
            <span className="text-sm text-stone-700">
              Show Sidra name by default
            </span>
          </label>

          <label className="inline-flex items-center gap-3 rounded-xl border border-stone-200 p-4">
            <input
              type="checkbox"
              name="show_iqra_name_default"
              defaultChecked={settings?.show_iqra_name_default ?? true}
              className="h-4 w-4 accent-[#9b793d]"
            />
            <span className="text-sm text-stone-700">
              Show Iqra name by default
            </span>
          </label>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Quranic Verse
          </label>
          <textarea
            name="quranic_verse"
            rows={4}
            defaultValue={settings?.quranic_verse ?? ""}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Quranic Reference
          </label>
          <input
            name="quranic_reference"
            defaultValue={settings?.quranic_reference ?? ""}
            className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Welcome Message
          </label>
          <textarea
            name="welcome_message"
            rows={4}
            defaultValue={settings?.welcome_message ?? ""}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Thank You Title
            </label>
            <input
              name="thank_you_title"
              defaultValue={settings?.thank_you_title ?? ""}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Music Mode
            </label>
            <select
              name="music_mode"
              defaultValue={settings?.music_mode ?? "procedural"}
              className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            >
              <option value="procedural">Soft procedural chime</option>
              <option value="external">Use external music URL</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Thank You Message
          </label>
          <textarea
            name="thank_you_message"
            rows={3}
            defaultValue={settings?.thank_you_message ?? ""}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Background Music URL
          </label>
          <input
            name="background_music_url"
            defaultValue={settings?.background_music_url ?? ""}
            placeholder="Paste audio file URL here"
            className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
          <p className="mt-2 text-xs text-stone-400">
            Agar URL empty ho to system soft procedural chime play karega.
          </p>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="rounded-xl bg-[#181713] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2d2b24]"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}