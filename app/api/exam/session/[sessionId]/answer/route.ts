import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * OBJECTIVE: Save an individual answer with backend validation.
 */
export async function POST(
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

    const body = await req.json();
    const { mcqId, answer } = body;

    // 1. Verify session ownership and status
    const session = await db.examSession.findUnique({
      where: { id: sessionId },
      include: { questions: { where: { mcqId } } }
    });

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: "Session not found or unauthorized" }, { status: 404 });
    }

    if (session.status !== "ACTIVE") {
      return NextResponse.json({ error: "Session is no longer active" }, { status: 400 });
    }

    // 2. Verify question belongs to this session
    if (session.questions.length === 0) {
      return NextResponse.json({ error: "Question not assigned to this session" }, { status: 403 });
    }

    const sessionQuestion = session.questions[0];

    // 3. Save/Update Answer
    const mcq = await db.mcq.findUnique({ where: { id: mcqId } });
    const isCorrect = (mcq?.correctAnswer || mcq?.correctOption) === answer;

    const sessionAnswer = await db.sessionAnswer.upsert({
      where: {
        sessionId_mcqId: {
          sessionId,
          mcqId
        }
      },
      update: {
        answer,
        isCorrect
      },
      create: {
        sessionId,
        mcqId,
        answer,
        isCorrect,
        category: sessionQuestion.category
      }
    });

    return NextResponse.json({ success: true, answerId: sessionAnswer.id });

  } catch (error: any) {
    console.error("EXAM_ANSWER_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
