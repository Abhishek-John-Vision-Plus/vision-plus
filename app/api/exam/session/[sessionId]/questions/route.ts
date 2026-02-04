import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * OBJECTIVE: Retrieve the fixed question set for an active session.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await db.examSession.findUnique({
      where: { id: sessionId },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: { mcq: true }
        },
        answers: true
      }
    });

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Map to frontend format
    const questions = session.questions.map(sq => ({
      id: sq.mcqId,
      question_text: sq.mcq.question,
      type: sq.mcq.type,
      options: typeof sq.mcq.options === 'string' 
        ? JSON.parse(sq.mcq.options) 
        : sq.mcq.options,
      option_a: sq.mcq.option_a,
      option_b: sq.mcq.option_b,
      option_c: sq.mcq.option_c,
      option_d: sq.mcq.option_d,
      category: sq.category,
      userAnswer: session.answers.find(a => a.mcqId === sq.mcqId)?.answer || null
    }));

    return NextResponse.json({
      sessionId: session.id,
      process: session.process,
      status: session.status,
      rules: session.rulesSnapshot,
      questions
    });

  } catch (error: any) {
    console.error("EXAM_QUESTIONS_FETCH_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
