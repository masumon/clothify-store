import { recordWebhookDelivery } from "@/lib/monitoring";
import { captureServerException } from "@/lib/sentry";

type NotificationType = "order_created" | "security_alert";

type NotificationPayload = {
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export type NotificationDeliveryResult = {
  status: "success" | "failed" | "skipped";
  durationMs: number;
  statusCode?: number;
  error?: string;
};

function toWebhookUrl() {
  return process.env.WHATSAPP_NOTIFY_WEBHOOK_URL?.trim() || "";
}

function isEnabledFor(type: NotificationType) {
  const allEnabled = (process.env.WHATSAPP_NOTIFY_ENABLED || "false").toLowerCase() !== "false";
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

function getTimeoutMs() {
  const value = Number(process.env.WHATSAPP_NOTIFY_TIMEOUT_MS || 10000);
  return Number.isFinite(value) && value > 0 ? value : 10000;
}

export async function sendWhatsAppNotification(payload: NotificationPayload) {
  const webhookUrl = toWebhookUrl();
  const enabled = webhookUrl && isEnabledFor(payload.type);
  if (!enabled) {
    await recordWebhookDelivery({
      channel: "whatsapp",
      eventType: payload.type,
      title: payload.title,
      status: "skipped",
      durationMs: 0,
    });
    return {
      status: "skipped",
      durationMs: 0,
    } satisfies NotificationDeliveryResult;
  }

  const secret = process.env.WHATSAPP_NOTIFY_WEBHOOK_SECRET?.trim();
  const startedAt = Date.now();
  const timeoutMs = getTimeoutMs();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

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
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-webhook-secret": secret } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const durationMs = Date.now() - startedAt;
    if (!response.ok) {
      const error = new Error(`Webhook delivery failed with status ${response.status}`);
      captureServerException(error, {
        tags: {
          notification_type: payload.type,
          notification_channel: "whatsapp",
        },
        extras: {
          statusCode: response.status,
          durationMs,
        },
      });
      await recordWebhookDelivery({
        channel: "whatsapp",
        eventType: payload.type,
        title: payload.title,
        status: "failed",
        durationMs,
        statusCode: response.status,
        error: error.message,
      });
      return {
        status: "failed",
        durationMs,
        statusCode: response.status,
        error: error.message,
      } satisfies NotificationDeliveryResult;
    }

    await recordWebhookDelivery({
      channel: "whatsapp",
      eventType: payload.type,
      title: payload.title,
      status: "success",
      durationMs,
      statusCode: response.status,
    });
    return {
      status: "success",
      durationMs,
      statusCode: response.status,
    } satisfies NotificationDeliveryResult;
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const base = error instanceof Error ? error.message : "unknown";
    captureServerException(error, {
      tags: {
        notification_type: payload.type,
        notification_channel: "whatsapp",
      },
      extras: {
        durationMs,
      },
    });
    await recordWebhookDelivery({
      channel: "whatsapp",
      eventType: payload.type,
      title: payload.title,
      status: "failed",
      durationMs,
      error: base,
    });
    console.error("WhatsApp notification failed:", redact(base));
    return {
      status: "failed",
      durationMs,
      error: base,
    } satisfies NotificationDeliveryResult;
  } finally {
    clearTimeout(timeout);
  }
}
