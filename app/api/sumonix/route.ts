import { withMonitoredRoute } from "@/lib/monitoring";
import { handlePublicSumonixRequest } from "@/lib/api/sumonix-public";

export const POST = withMonitoredRoute("api.sumonix.public", (request) =>
  handlePublicSumonixRequest(request)
);
