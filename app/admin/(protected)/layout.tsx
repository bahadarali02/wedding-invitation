export const instant = false;
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminProfile, error } = await supabase
    .from("admin_profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (error || !adminProfile) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <AdminSidebar />

      <div className="lg:pl-64">
        <AdminTopbar
          fullName={adminProfile.full_name ?? "Administrator"}
          role={adminProfile.role}
        />

        <main className="min-h-[calc(100vh-5rem)] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}