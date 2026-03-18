type NotificationType = "order_created" | "security_alert";

type NotificationPayload = {
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

function toWebhookUrl() {
  return process.env.WHATSAPP_NOTIFY_WEBHOOK_URL?.trim() || "";
}

function isEnabledFor(type: NotificationType) {
  const allEnabled = (process.env.WHATSAPP_NOTIFY_ENABLED || "true").toLowerCase() !== "false";
  if (!allEnabled) return false;

  if (type === "order_created") {
    return (process.env.WHATSAPP_NOTIFY_ORDER_EVENTS || "true").toLowerCase() !== "false";
  }

  if (type === "security_alert") {
    return (process.env.WHATSAPP_NOTIFY_SECURITY_EVENTS || "true").toLowerCase() !== "false";
  }

  return true;
}

function redact(message: string) {
  return message.replace(/\b(\+?880|0)?1[3-9]\d{8}\b/g, "[phone]");
}

export async function sendWhatsAppNotification(payload: NotificationPayload) {
  const webhookUrl = toWebhookUrl();
  if (!webhookUrl || !isEnabledFor(payload.type)) {
    return;
  }

  const secret = process.env.WHATSAPP_NOTIFY_WEBHOOK_SECRET?.trim();

  const body = {
    channel: "whatsapp",
    type: payload.type,
    title: payload.title,
    message: payload.message,
    text: `${payload.title}\n${payload.message}`,
    metadata: payload.metadata || {},
    created_at: new Date().toISOString(),
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-webhook-secret": secret } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const base = error instanceof Error ? error.message : "unknown";
    console.error("WhatsApp notification failed:", redact(base));
  }
}
