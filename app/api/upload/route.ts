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
ensurePdfJsPolyfills();

// Dynamic import for pdf-parse
const getPdfParser = async () => {
  const pdfParse = await import("pdf-parse");
  // Handle different module export styles
 //@ts-ignore
  return pdfParse.default || pdfParse;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const textInput = formData.get("text") as string | null;
    const processName = formData.get("process") as string;

    let text = "";

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (file.name.endsWith(".pdf")) {
        const parsePdf = await getPdfParser();
        const data = await parsePdf(buffer);
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
        error: "No MCQs found. Ensure format matches (1. Question, A. Option, Correct Answer: A, Category: ..., Module: ...)" 
      }, { status: 422 });
    }

    // Store in DB
    const created = await db.mcq.createMany({
      data: mcqs.map((m) => ({
        id: randomUUID(),
        question: m.question,
        type: "MCQ",
        options: [m.option_a, m.option_b, m.option_c, m.option_d],
        correctAnswer: m.correctOption || null,
        option_a: m.option_a,
        option_b: m.option_b,
        option_c: m.option_c,
        option_d: m.option_d,
        correctOption: m.correctOption || null,
        process: processName || null,
        category: m.category || null,
        module: m.module || null,
      })),
    });
    return NextResponse.json({ 
      success: true, 
      count: created.count,
      message: `${created.count} questions extracted and saved successfully.`
    });
  } catch (error: any) {
    console.error("UPLOAD_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}