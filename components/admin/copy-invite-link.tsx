"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  token: string;
};

export default function CopyInviteLink({ token }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/i/${token}`;

    await navigator.clipboard.writeText(url);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 transition hover:text-[#93733d]"
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy Link
        </>
      )}
    </button>
  );
}