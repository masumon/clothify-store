import { NextResponse } from "next/server";
import { getPublicSumonixReply } from "@/lib/sumonix";

type Payload = {
  question?: string;
  contextPath?: string;
  uiLanguage?: string;
};

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
    }

    const body = (await req.json()) as Payload;
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

    const reply = await getPublicSumonixReply(question, { contextPath, uiLanguage });
    return NextResponse.json(reply);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
