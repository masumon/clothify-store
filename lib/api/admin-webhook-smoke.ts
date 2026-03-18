import { sendWhatsAppNotification } from "@/lib/whatsapp-notify";

export async function runAdminWebhookSmokeTest(
  notify: typeof sendWhatsAppNotification = sendWhatsAppNotification
) {
  const result = await notify({
    type: "security_alert",
    title: "Clothify Smoke Test",
    message:
      "This is a manual admin monitoring smoke test for WhatsApp delivery. No customer action is required.",
    metadata: {
      smoke_test: true,
      triggered_at: new Date().toISOString(),
    },
  });

  return {
    ok: result.status === "success",
    ...result,
  };
}
