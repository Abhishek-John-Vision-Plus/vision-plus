import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * OBJECTIVE: Start a new exam session with server-side randomization and rule snapshots.
 */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { process } = body;

    if (!process) {
      return NextResponse.json({ error: "Process name is required" }, { status: 400 });
    }

    // 1. Check for existing active session
    const activeSession = await db.examSession.findFirst({
      where: {
        userId,
        process,
        status: "ACTIVE",
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { mcq: true }
        }
      }
    });

    if (activeSession) {
      return NextResponse.json({ 
        message: "Resuming active session", 
        sessionId: activeSession.id,
        questions: activeSession.questions.map(sq => ({
          ...sq.mcq,
          category: sq.category
        }))
      });
    }

    // 2. Fetch Topic Rules for this process
    const rules = await db.topicRule.findMany({
      where: { process }
    });

    if (rules.length === 0) {
      return NextResponse.json({ error: "No exam configuration found for this process" }, { status: 400 });
    }

    // 3. Fetch Questions and Randomize
    const allQuestions = await db.mcq.findMany({
      where: { 
        process: { contains: process, mode: 'insensitive' }
      }
    });

    const questionsByCategory: Record<string, any[]> = {};
    allQuestions.forEach(q => {
      const cat = q.category || "General";
      if (!questionsByCategory[cat]) questionsByCategory[cat] = [];
      questionsByCategory[cat].push(q);
    });

    const selectedQuestions: any[] = [];
    const rulesSnapshot: Record<string, any> = {};

    rules.forEach(rule => {
      const categoryQuestions = questionsByCategory[rule.category] || [];
      
      // Shuffle category questions (Fisher-Yates)
      for (let i = categoryQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categoryQuestions[i], categoryQuestions[j]] = [categoryQuestions[j], categoryQuestions[i]];
      }

      // Select up to maxDisplay
      const toDisplay = categoryQuestions.slice(0, rule.maxDisplay);
      selectedQuestions.push(...toDisplay.map(q => ({
        id: q.id,
        category: rule.category
      })));

      // Snapshot rule
      rulesSnapshot[rule.category] = {
        minAttempt: rule.minAttempt,
        maxDisplay: rule.maxDisplay,
        requiredAttempt: rule.requiredAttempt
      };
    });

    // 4. Create Session in Transaction
    const session = await db.$transaction(async (tx) => {
      const newSession = await tx.examSession.create({
        data: {
          userId,
          process,
          rulesSnapshot,
          status: "ACTIVE",
        }
      });

      // Create SessionQuestions with fixed order
      await tx.sessionQuestion.createMany({
        data: selectedQuestions.map((q, index) => ({
          sessionId: newSession.id,
          mcqId: q.id,
          category: q.category,
          order: index
        }))
      });

      return newSession;
    });

    return NextResponse.json({ 
      message: "Exam session started", 
      sessionId: session.id,
      rules: rulesSnapshot 
    });

  } catch (error: any) {
    console.error("EXAM_START_ERROR:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
