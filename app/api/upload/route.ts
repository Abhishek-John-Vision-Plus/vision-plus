import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { extractMCQs } from "@/lib/mcqExtractor";
import mammoth from "mammoth";
export const runtime = "nodejs";
import { randomUUID } from "node:crypto";

// Minimal polyfills for pdfjs in Node runtime to avoid DOM-related errors
const ensurePdfJsPolyfills = () => {
  const g: any = globalThis as any;
  if (typeof g.DOMMatrix === "undefined") {
    g.DOMMatrix = class {
      multiplySelf() { return this; }
      translateSelf() { return this; }
      scaleSelf() { return this; }
      rotateSelf() { return this; }
    };
  }
  if (typeof g.ImageData === "undefined") {
    g.ImageData = class {};
  }
  if (typeof g.Path2D === "undefined") {
    g.Path2D = class {};
  }
};

export async function POST(req: Request) {
  ensurePdfJsPolyfills();
  const pdfModule = await import("pdf-parse");
  const pdf = (pdfModule as any).default || (pdfModule as any);
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const textInput = formData.get("text") as string | null;
    const processName = formData.get("process") as string;

    let text = "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.name.endsWith(".pdf")) {
        const data = await pdf(buffer);
        text = data.text;
      } else if (file.name.endsWith(".docx")) {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else {
        return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
      }
    } else if (textInput && textInput.length > 0) {
      text = textInput.replace(/\u00A0/g, " ");
    } else {
      return NextResponse.json({ error: "No file or text provided" }, { status: 400 });
    }

    const mcqs = extractMCQs(text);

    if (mcqs.length === 0) {
      return NextResponse.json({ 
        error: "No MCQs found in file. Ensure the format matches (1. Question, A. Option, Answer: A)" 
      }, { status: 422 });
    }

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS mcqs (
        id uuid PRIMARY KEY,
        question text NOT NULL,
        option_a text,
        option_b text,
        option_c text,
        option_d text,
        "correctOption" text,
        
        process text,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await db.$executeRawUnsafe(`
      ALTER TABLE mcqs
        ADD COLUMN IF NOT EXISTS "correctOption" text,
       
        ADD COLUMN IF NOT EXISTS "createdAt" timestamptz NOT NULL DEFAULT now()
    `);

    // Store in DB
    const created = await db.mcq.createMany({
      data: mcqs.map((m) => ({
        id: randomUUID(),
        question: m.question,
        option_a: m.option_a,
        option_b: m.option_b,
        option_c: m.option_c,
        option_d: m.option_d,
        correctOption: m.correctOption || null,
       
        process: processName || null,
      })),
    });
    return NextResponse.json({ 
      success: true, 
      count: created.count,
      message: `${created.count} MCQs extracted and saved successfully.`
    });
  } catch (error: any) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
