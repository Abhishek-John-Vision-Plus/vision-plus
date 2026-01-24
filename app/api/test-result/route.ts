import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      userId, 
      process, 
      score, 
      correctAnswers, 
      wrongAnswers, 
      totalQuestions, 
      answers, 
      percentage, 
      status 
    } = body;

    if (!userId) {
      console.error("Missing userId in request body");
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Verify user exists first
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.error(`User with ID ${userId} not found in database`);
      return NextResponse.json({ message: "User not found. Please log in again." }, { status: 404 });
    }

    // Save assessment result
    const result = await db.assessmentResult.create({
      data: {
        userId,
        process,
        score: parseFloat(score.toString()),
        correctAnswers: parseInt(correctAnswers.toString()),
        wrongAnswers: parseInt(wrongAnswers.toString()),
        totalQuestions: parseInt(totalQuestions.toString()),
        answers,
        percentage: parseFloat(percentage.toString()),
        status
      }
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error saving assessment result:", error);
    
    // Check if it's a Prisma error for foreign key constraint
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        message: "Failed to save result. User reference is invalid. Please ensure you are logged in correctly.",
        error: error.message 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: "Failed to save assessment result", 
      error: error.message 
    }, { status: 500 });
  }
}
