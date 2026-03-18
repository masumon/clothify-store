import { withMonitoredRoute } from "@/lib/monitoring";
import { handleAdminSupabaseAuth } from "@/lib/api/admin-auth-supabase";

export const POST = withMonitoredRoute("api.admin.auth.supabase", (request) =>
  handleAdminSupabaseAuth(request)
);
