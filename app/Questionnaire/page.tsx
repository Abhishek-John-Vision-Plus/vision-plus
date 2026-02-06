"use client";

import { useProcess } from "@/context/ProcessContext";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import Unauthorized from "../unauthorized";
import Loading from "../_components/Loading";
import NotFound from "../not-found";

interface Question {
  id: string;
  question_text: string;
  type: "MCQ" | "CHECKBOX" | "TEXT";
  options: string[] | null;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_option: string;
  category: string;
  module: string;
  role: string;
}

export default function QuestionnairePage() {
  const { selectedProcess } = useProcess();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [rules, setRules] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user || !selectedProcess) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/exam/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ process: selectedProcess.name })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = "Failed to fetch questions";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            console.error("Non-JSON error response:", errorText);
            errorMessage = `Server Error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setQuestions(data.questions || []);
        setRules(data.rules || {});
      } catch (err: any) {
        console.error("Error fetching questions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, selectedProcess]);

  const handleAnswerChange = (questionId: string, value: any, toggle: boolean = false) => {
    if (isSubmitted) return;
    setAnswers((prev) => {
      if (toggle && prev[questionId] === value) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return {
        ...prev,
        [questionId]: value,
      };
    });
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    if (isSubmitted) return;
    const currentAnswers = answers[questionId] || [];
    let newAnswers;
    if (checked) {
      newAnswers = [...currentAnswers, option];
    } else {
      newAnswers = currentAnswers.filter((a: string) => a !== option);
    }
    handleAnswerChange(questionId, newAnswers);
  };

  const getCategoryProgress = (category: string) => {
    // Case-insensitive matching for safety
    const categoryQuestions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    const answeredCount = categoryQuestions.filter(q => !!answers[q.id]).length;
    
    // Find the rule key that matches (case-insensitive)
    const ruleKey = Object.keys(rules).find(k => k.toLowerCase() === category.toLowerCase());
    const rule = ruleKey ? rules[ruleKey] : null;

    return {
      answered: answeredCount,
      total: categoryQuestions.length,
      min: rule?.minAttempt || 0,
      required: rule?.requiredAttempt
    };
  };

  const handleSubmit = async () => {
    if (!user || !selectedProcess || questions.length === 0) return;

    const categories = Object.keys(rules);
    for (const cat of categories) {
      const progress = getCategoryProgress(cat);
      if (progress.required !== null && progress.required !== undefined) {
        if (progress.answered < progress.required) {
          toast.error(`You must answer exactly ${progress.required} questions in the "${cat}" topic. You have only answered ${progress.answered}.`);
          return;
        }
      } else if (progress.answered < progress.min) {
        toast.error(`You must answer at least ${progress.min} questions in the "${cat}" topic. You have only answered ${progress.answered}.`);
        return;
      }
    }

    setLoading(true);
    try {
      let correct = 0;
      let wrong = 0;

      questions.forEach((q) => {
        const userAns = answers[q.id];
        if (!userAns) {
          wrong++;
          return;
        }

        let isCorrect = false;
        if (q.type === "MCQ") {
          isCorrect = userAns === q.correct_option;
        } else if (q.type === "CHECKBOX") {
          const correctOpts = q.correct_option.split(",").map(s => s.trim().toUpperCase());
          isCorrect = Array.isArray(userAns) && 
                      userAns.length === correctOpts.length && 
                      userAns.every(a => correctOpts.includes(a.toUpperCase()));
        } else if (q.type === "TEXT") {
          isCorrect = userAns.trim().toLowerCase() === q.correct_option.trim().toLowerCase();
        } else {
          isCorrect = userAns === q.correct_option;
        }

        if (isCorrect) correct++;
        else wrong++;
      });

      const score = correct;
      const percentage = (correct / questions.length) * 100;
      const status = percentage >= 50 ? "PASSED" : "FAILED";

      const payload = {
        userId: user.id,
        process: selectedProcess.name,
        score,
        correctAnswers: correct,
        wrongAnswers: wrong,
        totalQuestions: questions.length,
        answers: answers,
        percentage,
        status,
      };

      const response = await fetch("/api/test-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save result");
      }

      const data = await response.json();
      setResult(data);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Questionnaire submitted successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-20 text-center">
    <Unauthorized />
    {/* <NotFound/> */}
  </div>;

  if (loading && !questions.length) {
    return <Loading message="Preparing Assessment..." />;
  }
  
  if (error) {
    if (error.includes("No questions added")) {
      return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-8 shadow-xl">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Questions Available</h2>
            <p className="text-slate-500 mb-8">
              There are currently no questions added for the <span className="font-bold text-slate-700">{selectedProcess?.name}</span> process.
            </p>
            <Button onClick={() => window.location.href = "/"} className="w-full">
              Return to Dashboard
            </Button>
          </Card>
        </div>
      );
    }
    return <div className="p-20 text-center text-red-500">Error: {error}</div>;
  }

  if (isSubmitted && result) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-none shadow-xl overflow-hidden">
            <div className={`h-2 ${result.status === 'PASSED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <CardHeader className="text-center pt-8">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${result.status === 'PASSED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {result.status === 'PASSED' ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">Questionnaire Submitted</CardTitle>
              <p className="text-slate-500 font-medium mt-2">Thank you for completing the {result.process} questionnaire.</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Score</p>
                  <p className="text-4xl font-black text-slate-900">{result.correctAnswers}/{result.totalQuestions}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Percentage</p>
                  <p className="text-4xl font-black text-slate-900">{result.percentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="mt-10 flex flex-col gap-4">
                <Button onClick={() => window.location.href = "/"} className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-lg shadow-lg">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
              {selectedProcess?.name} Questionnaire
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Assessment in progress
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-xs">
              {Object.keys(answers).length} / {questions.length} answered
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {questions.map((q, index) => (
              <Card key={q.id} id={`q-${index}`} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl overflow-hidden">
                <CardHeader className="pb-4 bg-white border-b border-slate-50">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Question {index + 1}
                    </span>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {q.category || "General"}
                    </span>
                    {rules[q.category] && (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {getCategoryProgress(q.category).answered} / {
                          rules[q.category].requiredAttempt !== null 
                            ? `Exactly ${rules[q.category].requiredAttempt}` 
                            : `Min ${rules[q.category].minAttempt}`
                        } Answered
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 leading-tight">
                    {q.question_text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 bg-white">
                  {q.type === "MCQ" || (!q.type && (q.option_a || q.options)) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(q.options || [q.option_a, q.option_b, q.option_c, q.option_d]).map((opt, i) => {
                        if (!opt) return null;
                        const key = String.fromCharCode(65 + i);
                        const isSelected = answers[q.id] === key;
                        return (
                          <div
                            key={key}
                            onClick={() => handleAnswerChange(q.id, key, true)}
                            className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                                : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                            }`}
                          >
                            <span className={`w-10 h-10 rounded-xl font-black flex items-center justify-center ${
                              isSelected ? "bg-emerald-500 text-white" : "bg-white text-slate-400"
                            }`}>
                              {key}
                            </span>
                            <span className={`font-bold ${isSelected ? "text-emerald-700" : "text-slate-600"}`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : q.type === "CHECKBOX" ? (
                    <div className="space-y-4">
                      {q.options?.map((opt, i) => {
                        const key = String.fromCharCode(65 + i);
                        const isChecked = (answers[q.id] || []).includes(key);
                        return (
                          <div
                            key={key}
                            onClick={() => handleCheckboxChange(q.id, key, !isChecked)}
                            className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                              isChecked
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-100 bg-slate-50 hover:border-slate-200"
                            }`}
                          >
                            <Checkbox checked={isChecked} onCheckedChange={(checked) => handleCheckboxChange(q.id, key, !!checked)} />
                            <span className={`font-bold ${isChecked ? "text-emerald-700" : "text-slate-600"}`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Label className="text-slate-500 mb-2 block">Your Answer</Label>
                      <Input
                        placeholder="Type your answer here..."
                        className="h-16 text-lg rounded-2xl border-2 border-slate-100 focus:border-emerald-500 transition-all"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-6">
            <Button
              onClick={handleSubmit}
              disabled={loading || Object.keys(answers).length === 0}
              className="w-full md:w-auto min-w-[350px] h-20 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-3xl text-2xl shadow-2xl shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : "SUBMIT QUESTIONNAIRE"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
