import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const process = searchParams.get("process");

    if (!process) {
      return NextResponse.json({ error: "Process is required" }, { status: 400 });
    }

    const rules = await db.topicRule.findMany({
      where: { 
        process: {
          equals: process,
          mode: 'insensitive'
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ rules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { process, rules } = body;

    if (!process || !Array.isArray(rules)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Use a transaction to update all rules for this process
    await db.$transaction(async (tx) => {
      for (const rule of rules) {
        // Find if a rule exists case-insensitively first to get the correct unique key
        const existing = await tx.topicRule.findFirst({
          where: {
            process: { equals: process, mode: 'insensitive' },
            category: { equals: rule.category, mode: 'insensitive' }
          }
        });

        if (existing) {
          await tx.topicRule.update({
            where: { id: existing.id },
            data: {
              minAttempt: parseInt(rule.minAttempt) || 0,
              maxDisplay: parseInt(rule.maxDisplay) || 0,
              requiredAttempt: rule.requiredAttempt !== undefined ? parseInt(rule.requiredAttempt) : null,
              order: parseInt(rule.order) || 0
            }
          });
        } else {
          await tx.topicRule.create({
            data: {
              process,
              category: rule.category,
              minAttempt: parseInt(rule.minAttempt) || 0,
              maxDisplay: parseInt(rule.maxDisplay) || 0,
              requiredAttempt: rule.requiredAttempt !== undefined ? parseInt(rule.requiredAttempt) : null,
              order: parseInt(rule.order) || 0
            }
          });
        }
      }
    });

    return NextResponse.json({ message: "Rules updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
