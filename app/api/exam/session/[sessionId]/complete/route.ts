import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * OBJECTIVE: Finalize exam session with strict rule validation (minAttempt, requiredAttempt).
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

    // 1. Fetch Session with Answers and Snapshot
    const session = await db.examSession.findUnique({
      where: { id: sessionId },
      include: {
        answers: true,
        questions: true
      }
    });

    if (!session || session.userId !== userId) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "ACTIVE") {
      return NextResponse.json({ error: "Session already completed" }, { status: 400 });
    }

    const rulesSnapshot = session.rulesSnapshot as Record<string, any>;
    const categoryAnswers: Record<string, number> = {};
    
    session.answers.forEach(ans => {
      categoryAnswers[ans.category] = (categoryAnswers[ans.category] || 0) + 1;
    });

    // 2. Validate Topic Rules
    const violations: string[] = [];
    Object.entries(rulesSnapshot).forEach(([category, rules]) => {
      const attempts = categoryAnswers[category] || 0;
      
      if (rules.requiredAttempt !== null && rules.requiredAttempt !== undefined) {
        if (attempts !== rules.requiredAttempt) {
          violations.push(`Category ${category} requires exactly ${rules.requiredAttempt} attempts (you have ${attempts}).`);
        }
      } else {
        if (attempts < rules.minAttempt) {
          violations.push(`Category ${category} requires minimum ${rules.minAttempt} attempts (you have ${attempts}).`);
        }
      }
    });

    if (violations.length > 0) {
      return NextResponse.json({ 
        error: "Validation failed", 
        violations 
      }, { status: 400 });
    }

    // 3. Calculate Results and Close Session
    const totalCorrect = session.answers.filter(a => a.isCorrect).length;
    const totalQuestions = session.questions.length;
    const score = (totalCorrect / totalQuestions) * 100;

    const result = await db.$transaction(async (tx) => {
      // Create legacy AssessmentResult for backward compatibility if needed
      await tx.assessmentResult.create({
        data: {
          userId,
          process: session.process,
          score: totalCorrect,
          correctAnswers: totalCorrect,
          wrongAnswers: totalQuestions - totalCorrect,
          totalQuestions,
          percentage: score,
          status: score >= 50 ? "PASSED" : "FAILED", // Example threshold
          answers: session.answers.reduce((acc, curr) => ({ ...acc, [curr.mcqId]: curr.answer }), {})
        }
      });

      // Close Session
      return tx.examSession.update({
        where: { id: sessionId },
        data: {
          status: "COMPLETED",
          endTime: new Date()
        }
      });
    });

    return NextResponse.json({ 
      message: "Exam completed successfully", 
      score, 
      correctAnswers: totalCorrect, 
      totalQuestions 
    });

  } catch (error: any) {
    console.error("EXAM_COMPLETE_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
