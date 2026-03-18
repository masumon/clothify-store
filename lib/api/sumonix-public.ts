import { NextResponse } from "next/server";
import { getPublicSumonixReply } from "@/lib/sumonix";
import { consumeFixedWindowRateLimit, getClientIp, type RateLimitResult } from "@/lib/rate-limit";

type Payload = {
  question?: string;
  contextPath?: string;
  uiLanguage?: string;
};

export type PublicSumonixDeps = {
  getReply?: typeof getPublicSumonixReply;
  consumeRateLimit?: (request: Request) => Promise<RateLimitResult>;
};

const fallbackMessage =
  "SUMONIX AI সাময়িকভাবে limited mode-এ আছে। আপনি product name, price range, category, payment, delivery বা checkout help লিখে আবার জিজ্ঞেস করুন।";

async function defaultPublicRateLimit(request: Request) {
  return consumeFixedWindowRateLimit(
    {
      namespace: "sumonix-public",
      limit: 18,
      windowMs: 60 * 1000,
    },
    getClientIp(request)
  );
}

export async function handlePublicSumonixRequest(
  request: Request,
  deps: PublicSumonixDeps = {}
) {
  const getReply = deps.getReply || getPublicSumonixReply;
  const consumeRateLimit = deps.consumeRateLimit || defaultPublicRateLimit;

  try {
    const rateLimit = await consumeRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many SUMONIX requests. Please wait and try again.",
          retry_after_seconds: Math.ceil(rateLimit.retryAfterMs / 1000),
        },
        { status: 429 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
    }

    const body = (await request.json()) as Payload;
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const contextPath =
      typeof body.contextPath === "string" ? body.contextPath.trim().slice(0, 120) : "";
    const uiLanguage =
      typeof body.uiLanguage === "string" ? body.uiLanguage.trim().slice(0, 20) : "";

    if (question.length > 600) {
      return NextResponse.json(
        { error: "Question is too long. Please keep it within 600 characters." },
        { status: 400 }
      );
    }

    const reply = await getReply(question, { contextPath, uiLanguage });
    return NextResponse.json(reply);
  } catch (error) {
    console.error("Public SUMONIX API error:", error);
    return NextResponse.json({
      message: fallbackMessage,
      actions: [
        "Tip: product name + size/budget একসাথে লিখুন",
        "Tip: payment issue হলে TRX ID format (6-20 alphanumeric) যাচাই করুন",
        "Tip: delivery/courier জানার জন্য 'delivery options' লিখুন",
      ],
      products: [],
    });
  }
}
