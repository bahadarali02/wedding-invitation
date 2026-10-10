"use client";

import {
  Heart,
  Loader2,
  MessageSquareText,
  Phone,
  User,
  Users,
} from "lucide-react";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import {
  createGuestAction,
  type GuestFormState,
} from "@/app/admin/(protected)/guests/actions";

type EventOption = {
  id: string;
  name: string;
  slug?: string;
};

type Props = {
  events: EventOption[];
};

const initialState: GuestFormState = {};

export default function CreateGuestForm({
  events,
}: Props) {
  const [state, action, pending] = useActionState(
    createGuestAction,
    initialState
  );

  const [inviteType, setInviteType] =
    useState("family");

  const [name, setName] = useState("");

  const [displayName, setDisplayName] =
    useState("");

  useEffect(() => {
    if (!name) {
      setDisplayName("");
      return;
    }

    if (inviteType === "family") {
      setDisplayName(`${name} & Family`);
    } else if (inviteType === "couple") {
      setDisplayName(`Mr. & Mrs. ${name}`);
    } else {
      setDisplayName(name);
    }
  }, [inviteType, name]);

  return (
    <form
      action={action}
      className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a68548]">
          New Invitation
        </p>

        <h2 className="mt-2 font-serif text-2xl text-[#26241f]">
          Create Personalized Invitation
        </h2>

        <p className="mt-2 text-sm leading-6 text-stone-500">
          Har invitation mein dono wedding celebrations
          show hongi. Neeche sirf guest aur unke invited
          events select karo.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Guest Name
          </label>

          <div className="relative">
            <User
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              name="name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              placeholder="Ahmed Khan"
              className="h-12 w-full rounded-xl border border-stone-200 pl-11 pr-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            WhatsApp Number
          </label>

          <div className="relative">
            <Phone
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              name="phone"
              type="tel"
              placeholder="03001234567"
              className="h-12 w-full rounded-xl border border-stone-200 pl-11 pr-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Name shown on invitation
        </label>

        <input
          name="display_name"
          value={displayName}
          onChange={(e) =>
            setDisplayName(e.target.value)
          }
          required
          className="h-12 w-full rounded-xl border border-stone-200 px-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
        />
      </div>

      <div className="mt-7">
        <label className="mb-3 block text-sm font-medium text-stone-700">
          Invitation Type
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              value: "individual",
              title: "Individual",
              icon: User,
            },
            {
              value: "couple",
              title: "Couple",
              icon: Heart,
            },
            {
              value: "family",
              title: "Full Family",
              icon: Users,
            },
          ].map((option) => {
            const Icon = option.icon;

            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  inviteType === option.value
                    ? "border-[#b99a5b] bg-[#f8f2e6]"
                    : "border-stone-200"
                }`}
              >
                <input
                  type="radio"
                  name="invite_type"
                  value={option.value}
                  checked={
                    inviteType === option.value
                  }
                  onChange={() =>
                    setInviteType(option.value)
                  }
                  className="sr-only"
                />

                <Icon
                  size={19}
                  className={
                    inviteType === option.value
                      ? "text-[#9b793d]"
                      : "text-stone-400"
                  }
                />

                <p className="mt-3 text-sm font-semibold text-stone-800">
                  {option.title}
                </p>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <label className="mb-3 block text-sm font-medium text-stone-700">
          Invite to Events
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {events.map((event) => (
            <label
              key={event.id}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-stone-200 p-4 hover:bg-[#faf8f3]"
            >
              <input
                type="checkbox"
                name="event_ids"
                value={event.id}
                className="h-4 w-4 accent-[#9b793d]"
              />

              <span className="text-sm font-medium text-stone-700">
                {event.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Custom Message
        </label>

        <div className="relative">
          <MessageSquareText
            size={17}
            className="absolute left-4 top-4 text-stone-400"
          />

          <textarea
            name="custom_message"
            rows={4}
            placeholder="Optional personal message..."
            className="w-full resize-none rounded-xl border border-stone-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
        </div>
      </div>

      {state.error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#181713] px-7 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />
            Creating...
          </>
        ) : (
          <>
            <Heart size={17} />
            Generate Invitation
          </>
        )}
      </button>
    </form>
  );
}