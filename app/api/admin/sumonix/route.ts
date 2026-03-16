import { NextResponse } from "next/server";
import { getAdminSumonixReply } from "@/lib/sumonix";

type Payload = {
  question?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const question = typeof body.question === "string" ? body.question : "";
    const reply = await getAdminSumonixReply(question);
    return NextResponse.json(reply);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
