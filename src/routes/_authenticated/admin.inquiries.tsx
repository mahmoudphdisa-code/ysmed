import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/inquiries")({
  beforeLoad: () => {
    throw redirect({
      to: "/admin",
    });
  },
  component: () => null,
});

