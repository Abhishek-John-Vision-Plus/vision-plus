import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const runtime = "nodejs";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const process = searchParams.get("process");
  

    const where: any = {};
    if (process) where.process = process;
   

    const mcqs = await db.mcq.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ mcqs });
  } catch (error: any) {
    console.error("FETCH_MCQS_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
