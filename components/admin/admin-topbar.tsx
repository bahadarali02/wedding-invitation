import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";

type AdminTopbarProps = {
  fullName: string;
  role: string;
};

export default function AdminTopbar({
  fullName,
  role,
}: AdminTopbarProps) {
  const roleLabel =
    role === "super_admin" ? "Super Admin" : "Manager";

  return (
    <header className="flex h-20 items-center justify-between border-b border-stone-200/70 bg-white/80 px-5 backdrop-blur-xl sm:px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
          Wedding Administration
        </p>

        <h2 className="mt-1 text-sm font-semibold text-stone-800">
          {fullName}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-stone-700">
            {fullName}
          </p>
          <p className="text-xs text-stone-400">{roleLabel}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0e6d2] font-serif text-sm font-semibold text-[#836735]">
          {fullName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            title="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
          </button>
        </form>
      </div>
    </header>
  );
}