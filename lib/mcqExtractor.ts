/**
 * Basic MCQ Extractor Logic
 * 
 * This assumes MCQs follow a pattern like:
 * 1. Question text?
 * A. Option 1
 * B. Option 2
 * C. Option 3
 * D. Option 4
 * Answer: A
 */

export interface ExtractedMCQ {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correctOption: string;
  category?: string;
  module?: string;
}

export function extractMCQs(text: string): ExtractedMCQ[] {
  const mcqs: ExtractedMCQ[] = [];
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\u00A0/g, " ");
  const lines = normalized.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  const isQuestion = (l: string) => /^\d+\s*[.)]?\s+/.test(l) || /^[Qq]uestion[:\s]/.test(l);
  const cleanQuestion = (l: string) => l.replace(/^\d+\s*[.)]?\s+/, "").replace(/^[Qq]uestion[:\s]*/, "");

  const optionRegex = /^[A-Da-d][\.\)\:\-\s]+(.*)$/;
  const inlineOptionsRegex = /([A-Da-d])[.\)\:\-\s]+([\s\S]*?)(?=\s+[A-Da-d][.\)\:\-\s]+|$)/g;
  const answerRegex = /(?:^|\s)(?:answer|ans|correct[\s-]*answer|correct[\s-]*option|answer[\s-]*is)[:\-\s]*([A-Da-d])/i;
  const categoryModuleRegex = /Category:\s*(.*?)\s*\|\s*Module:\s*(.*)/i;

  let i = 0;
  while (i < lines.length) {
    if (!isQuestion(lines[i])) {
      i++;
      continue;
    }
    const question = cleanQuestion(lines[i]);
    i++;

    let optionA = "";
    let optionB = "";
    let optionC = "";
    let optionD = "";
    let correctOption = "";
    let category = "";
    let module = "";

    let block = "";
    while (i < lines.length && !isQuestion(lines[i])) {
      const line = lines[i];
      
      // Check for Category and Module
      const catModMatch = line.match(categoryModuleRegex);
      if (catModMatch) {
        category = catModMatch[1].trim();
        module = catModMatch[2].trim();
      }

      const optMatch = line.match(optionRegex);
      if (optMatch) {
        const key = line[0].toUpperCase();
        const val = optMatch[1].trim();
        if (key === "A") optionA = val;
        else if (key === "B") optionB = val;
        else if (key === "C") optionC = val;
        else if (key === "D") optionD = val;
      }
      const ansMatch = line.match(answerRegex);
      if (ansMatch) {
        correctOption = (ansMatch[1] || "").toUpperCase();
      }
      block += (line + " ");
      i++;
    }
    if (!(optionA && optionB && optionC && optionD) && block) {
      const matches = Array.from(block.matchAll(inlineOptionsRegex));
      for (const m of matches) {
        const key = (m[1] || "").toUpperCase();
        const val = (m[2] || "").trim();
        if (!val) continue;
        if (key === "A" && !optionA) optionA = val;
        else if (key === "B" && !optionB) optionB = val;
        else if (key === "C" && !optionC) optionC = val;
        else if (key === "D" && !optionD) optionD = val;
      }
    }
    if (!correctOption && block) {
      const m = block.match(answerRegex);
      if (m) correctOption = (m[1] || "").toUpperCase();
    }

    if (question && (optionA || optionB || optionC || optionD)) {
      mcqs.push({
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correctOption,
        category: category || undefined,
        module: module || undefined,
      });
    }
  }

  return mcqs;
}
