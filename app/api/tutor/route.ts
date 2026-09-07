import type { NextRequest } from "next/server";
import { handleTutor } from "../../../api/tutor";

export async function POST(req: NextRequest) {
  return handleTutor(req);
}