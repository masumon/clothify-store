import { withMonitoredRoute } from "@/lib/monitoring";
import { handleCreateOrder } from "@/lib/api/orders";

export const POST = withMonitoredRoute("api.orders.create", (request) =>
  handleCreateOrder(request)
);
