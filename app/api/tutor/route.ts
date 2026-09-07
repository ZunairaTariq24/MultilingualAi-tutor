import type { NextRequest } from "next/server";
import { handleTutor } from "@/lib/tutor";

export async function POST(req: NextRequest) {
  return handleTutor(req);
}
