import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const user = getStoredUser();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: "/dashboard" } });
    }
  },
  component: () => <Outlet />,
});
