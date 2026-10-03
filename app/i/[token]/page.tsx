export const instant = false;

import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import InvitationClient from "./invitation-client";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitationPage({
  params,
}: PageProps) {
  const { token } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_public_invitation",
    {
      invite_token: token,
    }
  );

  if (error) {
    console.error(
      "Invitation RPC error:",
      error
    );

    notFound();
  }

  if (!data) {
    notFound();
  }

  return (
    <InvitationClient
      invitation={data}
    />
  );
}