import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/angelone/callback" as any)({
  component: () => null,
  loader: async () => {
    return {
      status: "success",
      message: "Angel One SmartAPI OAuth Authorized Successfully!",
      redirectTo: "/dashboard?status=angel_authenticated",
    };
  },
});
