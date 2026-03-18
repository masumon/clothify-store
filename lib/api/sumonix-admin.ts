import { NextResponse } from "next/server";
import { getAdminSumonixReply } from "@/lib/sumonix";
import { consumeFixedWindowRateLimit, getClientIp, type RateLimitResult } from "@/lib/rate-limit";

type Payload = {
  question?: string;
  contextPath?: string;
  uiLanguage?: string;
};

export type AdminSumonixDeps = {
  getReply?: typeof getAdminSumonixReply;
  consumeRateLimit?: (request: Request) => Promise<RateLimitResult>;
};

const fallbackMessage =
  "SUMONIX Admin AI temporary fallback mode-এ আছে। প্রশ্নটি ছোট করে দিন: আজ sales, pending, stock alert, top selling, visitor source বা full report.";

async function defaultAdminRateLimit(request: Request) {
  return consumeFixedWindowRateLimit(
    {
      namespace: "sumonix-admin",
      limit: 40,
      windowMs: 60 * 1000,
    },
    getClientIp(request)
  );
}

export async function handleAdminSumonixRequest(
  request: Request,
  deps: AdminSumonixDeps = {}
) {
  const getReply = deps.getReply || getAdminSumonixReply;
  const consumeRateLimit = deps.consumeRateLimit || defaultAdminRateLimit;

  try {
    const rateLimit = await consumeRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many admin SUMONIX requests. Please wait and try again.",
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
    console.error("Admin SUMONIX API error:", error);
    return NextResponse.json({
      message: fallbackMessage,
      actions: [
        "Try: আজকের sales + pending report দিন",
        "Try: restock alert দিন",
        "Try: গত ৫ দিনের intent gap বলুন",
      ],
      products: [],
    });
  }
}
