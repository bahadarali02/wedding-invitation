"use client";

import { MessageCircle } from "lucide-react";

type Props = {
  token: string;
  phone?: string | null;
  displayName: string;
};

function normalizePhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("92")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return `92${cleaned.slice(1)}`;
  }

  return cleaned;
}

export default function WhatsAppShare({
  token,
  phone,
  displayName,
}: Props) {
  function share() {
    const invitationUrl = `${window.location.origin}/i/${token}`;

    const message =
      `Assalam-o-Alaikum ${displayName},\n\n` +
      `With great pleasure, we invite you to our family wedding celebrations.\n\n` +
      `Your personalized digital invitation is ready:\n${invitationUrl}\n\n` +
      `Please open the invitation to view all event details.\n\n` +
      `Warm regards`;

    const encoded = encodeURIComponent(message);

    const normalizedPhone = phone
      ? normalizePhone(phone)
      : "";

    const url = normalizedPhone
      ? `https://wa.me/${normalizedPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 transition hover:text-green-800"
    >
      <MessageCircle size={14} />
      WhatsApp
    </button>
  );
}