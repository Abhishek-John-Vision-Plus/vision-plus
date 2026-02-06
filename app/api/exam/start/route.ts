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

    // 2. Fetch current rules for this process
    const currentRules = await db.topicRule.findMany({
      where: { 
        process: { equals: process, mode: 'insensitive' }
      },
      orderBy: { order: 'asc' }
    });

    if (currentRules.length === 0) {
      return NextResponse.json({ error: "No exam configuration found for this process" }, { status: 400 });
    }

    // 1. Check for existing active session
    const activeSession = await db.examSession.findFirst({
      where: {
        userId,
        process: { equals: process, mode: 'insensitive' },
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
      // Check if session rules match current rules (Real-time update)
      const currentRulesSnapshot: Record<string, any> = {};
      currentRules.forEach(r => {
        currentRulesSnapshot[r.category] = {
          minAttempt: r.minAttempt,
          maxDisplay: r.maxDisplay,
          requiredAttempt: r.requiredAttempt || r.minAttempt
        };
      });

      const sessionRules = activeSession.rulesSnapshot as Record<string, any>;
      const isRulesSame = JSON.stringify(currentRulesSnapshot) === JSON.stringify(sessionRules);

      if (isRulesSame) {
        return NextResponse.json({ 
          message: "Resuming active session", 
          sessionId: activeSession.id,
          questions: activeSession.questions.map(sq => ({
            id: sq.mcq.id,
            question_text: sq.mcq.question,
            type: sq.mcq.type,
            options: typeof sq.mcq.options === 'string' 
              ? (() => { try { return JSON.parse(sq.mcq.options) } catch { return null } })() 
              : sq.mcq.options,
            correct_option: sq.mcq.correctAnswer || sq.mcq.correctOption,
            option_a: sq.mcq.option_a,
            option_b: sq.mcq.option_b,
            option_c: sq.mcq.option_c,
            option_d: sq.mcq.option_d,
            category: sq.category || "General",
            module: sq.mcq.module || "General",
            role: sq.mcq.role || "BOTH"
          }))
        });
      } else {
        // Rules changed! Invalidate old session to reflect changes in "real-time"
        await db.examSession.update({
          where: { id: activeSession.id },
          data: { status: "ABANDONED" }
        });
      }
    }

    // 3. Fetch Questions and Randomize
    const allQuestions = await db.mcq.findMany({
      where: { 
        process: { contains: process, mode: 'insensitive' }
      }
    });

    // Group questions by category (topic/module) - Normalize category names for matching
    const questionsByCategory: Record<string, any[]> = {};
    allQuestions.forEach(q => {
      const cat = (q.category || "General").toLowerCase();
      if (!questionsByCategory[cat]) questionsByCategory[cat] = [];
      questionsByCategory[cat].push(q);
    });

    const selectedQuestions: any[] = [];
    const rulesSnapshot: Record<string, any> = {};

    // First, select questions within each category
    currentRules.forEach(rule => {
      const catKey = (rule.category || "General").toLowerCase();
      const categoryQuestions = questionsByCategory[catKey] || [];
      
      // Shuffle category questions (Fisher-Yates)
      for (let i = categoryQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [categoryQuestions[i], categoryQuestions[j]] = [categoryQuestions[j], categoryQuestions[i]];
      }

      // Select up to maxDisplay
      const toDisplay = categoryQuestions.slice(0, rule.maxDisplay);
      
      // Safety: ensure requiredAttempt is not greater than the number of questions we are actually serving
      const effectiveRequiredAttempt = Math.min(
        rule.requiredAttempt || rule.minAttempt,
        toDisplay.length
      );

      // Snapshot rule
      rulesSnapshot[rule.category] = {
        minAttempt: Math.min(rule.minAttempt, toDisplay.length),
        maxDisplay: rule.maxDisplay,
        requiredAttempt: effectiveRequiredAttempt
      };

      // Store these for the next step
      selectedQuestions.push({
        category: rule.category,
        questions: toDisplay.map(q => ({
          id: q.id,
          category: rule.category
        }))
      });
    });

    // Flatten back into a single list while maintaining category groups (sequence is maintained from the rules loop)
    const finalQuestionList: any[] = [];
    selectedQuestions.forEach(module => {
      finalQuestionList.push(...module.questions);
    });

    // 4. Create Session in Transaction
    const sessionData = await db.$transaction(async (tx) => {
      const newSession = await tx.examSession.create({
        data: {
          userId,
          process,
          rulesSnapshot,
          status: "ACTIVE",
        }
      });

      // Create SessionQuestions with fixed order (grouped by category, but categories are randomized)
      await tx.sessionQuestion.createMany({
        data: finalQuestionList.map((q, index) => ({
          sessionId: newSession.id,
          mcqId: q.id,
          category: q.category,
          order: index
        }))
      });

      // Fetch the created questions to return to the UI
      const sessionQuestions = await tx.sessionQuestion.findMany({
        where: { sessionId: newSession.id },
        orderBy: { order: 'asc' },
        include: { mcq: true }
      });

      return {
        sessionId: newSession.id,
        questions: sessionQuestions.map(sq => ({
          id: sq.mcq.id,
          question_text: sq.mcq.question,
          type: sq.mcq.type,
          options: typeof sq.mcq.options === 'string' 
            ? (() => { try { return JSON.parse(sq.mcq.options) } catch { return null } })() 
            : sq.mcq.options,
          correct_option: sq.mcq.correctAnswer || sq.mcq.correctOption,
          option_a: sq.mcq.option_a,
          option_b: sq.mcq.option_b,
          option_c: sq.mcq.option_c,
          option_d: sq.mcq.option_d,
          category: sq.category || "General",
          module: sq.mcq.module || "General",
          role: sq.mcq.role || "BOTH"
        }))
      };
    });

    return NextResponse.json({ 
      message: "Exam session started", 
      sessionId: sessionData.sessionId,
      questions: sessionData.questions,
      rules: rulesSnapshot 
    });

  } catch (error: any) {
    console.error("EXAM_START_ERROR:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
