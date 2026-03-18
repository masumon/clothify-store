import { withMonitoredRoute } from "@/lib/monitoring";
import { handleAdminSumonixRequest } from "@/lib/api/sumonix-admin";

export const POST = withMonitoredRoute("api.sumonix.admin", (request) =>
  handleAdminSumonixRequest(request)
);
