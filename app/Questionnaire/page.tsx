"use client";

import { useProcess } from "@/context/ProcessContext";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, AlertCircle, HelpCircle, Cloud, Clock, ChevronLeft, ChevronRight, Flag, Pause, Play, LucideCheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import Unauthorized from "../unauthorized";
import Loading from "../_components/Loading";
import NotFound from "../not-found";
import ErrorDisplay from "../_components/ErrorDisplay";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
  const [errorDigest, setErrorDigest] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const QUESTION_TIME_LIMIT = 120;
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_LIMIT);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user || !selectedProcess) return;

      setLoading(true);
      setError(null);
      setErrorDigest(null);
      try {
        const response = await fetch(`/api/exam/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ process: selectedProcess.name })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = "Failed to fetch questions";
          let digest = null;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
            digest = errorData.digest || null;
          } catch (e) {
            console.error("Non-JSON error response:", errorText);
            errorMessage = `Server Error: ${response.status} ${response.statusText}`;
          }
          setError(errorMessage);
          setErrorDigest(digest);
          return;
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

  useEffect(() => {
    if (isSubmitted) return;
    if (isPaused) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isSubmitted]);

  useEffect(() => {
    setTimeRemaining(QUESTION_TIME_LIMIT);
  }, [currentIndex]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const totalRequired = useMemo(() => {
    const categories = Object.keys(rules);
    return categories.reduce((sum, cat) => {
      const hasQuestions = questions.some(q => q.category.toLowerCase() === cat.toLowerCase());
      if (!hasQuestions) return sum;
      const rule = rules[cat];
      const needed = rule?.requiredAttempt ?? rule?.minAttempt ?? 0;
      return sum + (typeof needed === "number" ? needed : 0);
    }, 0);
  }, [rules, questions]);

  const allRequirementsMet = useMemo(() => {
    const categories = Object.keys(rules);
    if (categories.length === 0) return answeredCount > 0;
    
    return categories.every(cat => {
      const hasQuestions = questions.some(q => q.category.toLowerCase() === cat.toLowerCase());
      if (!hasQuestions) return true; // No questions for this rule, skip
      
      const progress = getCategoryProgress(cat);
      const target = progress.required ?? progress.min;
      return progress.answered >= target;
    });
  }, [rules, questions, answers, getCategoryProgress, answeredCount]);

  const questionsByCategory = useMemo(() => {
    const groups: Record<string, { q: Question; originalIndex: number }[]> = {};
    questions.forEach((q, index) => {
      const category = q.category || "General";
      if (!groups[category]) groups[category] = [];
      groups[category].push({ q, originalIndex: index });
    });
    return groups;
  }, [questions]);

  const themeStyle = useMemo(() => {
    if (!selectedProcess?.style) return {};
    return {
      "--primary": selectedProcess.style.primary_color,
      "--primary-foreground": "#ffffff",
    } as React.CSSProperties;
  }, [selectedProcess]);

  const togglePause = () => setIsPaused((p) => !p);
  const handlePrevious = () => setCurrentIndex((idx) => Math.max(0, idx - 1));
  const handleNext = () => setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1));
  const handleFlag = () => {
    const q = questions[currentIndex];
    if (!q) return;
    setFlagged((prev) => ({ ...prev, [q.id]: !prev[q.id] }));
  };
  const jumpToQuestion = (index: number) => setCurrentIndex(index);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const timerPercentage = (timeRemaining / QUESTION_TIME_LIMIT) * 100;
  const isTimeLow = timeRemaining <= 30;

  if (!user) return <div className="p-20 text-center">
    <Unauthorized />
    {/* <NotFound/> */}
  </div>;

  if (loading) {
    return <Loading message={isSubmitted ? "Saving Results..." : "Preparing Assessment..."} />;
  }
  
  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        digest={errorDigest || undefined}
      />
    );
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
    <div className="min-h-screen bg-background" style={themeStyle}>
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: selectedProcess?.style.primary_color }}
              >
                <LucideCheckCircle2 className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-foreground">{selectedProcess?.name} Questionnaire</span>
                <p className="text-xs text-muted-foreground">
                  {answeredCount}/{questions.length} answered
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Assigned {questions.length} • Required {totalRequired}
                </p>
              </div>
            </div>

            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full",
              isPaused ? "bg-amber-500/20 text-amber-600" : isTimeLow ? "bg-red-500/20 text-red-600" : "bg-muted"
            )}>
              <Clock className={cn("w-5 h-5", isTimeLow && !isPaused && "animate-pulse")} />
              <span className="font-mono font-bold text-lg">
                {isPaused ? "PAUSED" : formatTime(timeRemaining)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant={isPaused ? "default" : "outline"} 
                size="sm" 
                onClick={togglePause}
                className="gap-1"
                style={isPaused ? { backgroundColor: selectedProcess?.style.primary_color, color: 'white' } : {}}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleSubmit} 
                disabled={loading || !allRequirementsMet}
                className={cn(
                  "font-bold transition-all duration-300",
                  allRequirementsMet ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "opacity-50"
                )}
                title={!allRequirementsMet ? "Complete all topic requirements to submit" : "Submit Assessment"}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
          <Progress 
            value={timerPercentage} 
            className={cn("h-1 mt-2", isTimeLow && "[&>div]:bg-red-500")}
            style={{ "--primary": selectedProcess?.style.primary_color } as any}
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0">
          <Card className="p-4 sticky top-24">
            <div className="mb-6">
              <h3 className="font-bold mb-1 text-sm uppercase tracking-wider text-slate-900">Progress Tracker</h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Complete the requirements for each topic
              </p>
            </div>
            
            <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scrollbar-thin">
              {Object.entries(questionsByCategory).map(([category, items]) => {
                const progress = getCategoryProgress(category);
                const target = progress.required ?? progress.min;
                const isMet = progress.answered >= target;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate mr-2" title={category}>
                          {category}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1",
                            isMet ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {isMet && <LucideCheckCircle2 className="w-2.5 h-2.5" />}
                            {progress.answered}/{target}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">
                            of {progress.total}
                          </span>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-500", isMet ? "bg-emerald-500" : "bg-slate-300")}
                          style={{ width: `${Math.min((progress.answered / target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {items.map(({ q, originalIndex }) => {
                        const answered = !!answers[q.id];
                        const isFlagged = !!flagged[q.id];
                        const isCurrent = originalIndex === currentIndex;
                        
                        return (
                          <button
                            key={q.id}
                            onClick={() => jumpToQuestion(originalIndex)}
                            className={cn(
                              "w-8 h-8 text-[11px] font-bold rounded-lg flex items-center justify-center transition-all relative border-2",
                              isCurrent 
                                ? "border-slate-900 scale-110 z-10 shadow-sm" 
                                : "border-transparent",
                              answered 
                                ? "bg-emerald-500 text-white" 
                                : isFlagged 
                                  ? "bg-amber-500 text-white" 
                                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            )}
                            style={isCurrent && answered ? { borderColor: selectedProcess?.style.primary_color } : {}}
                            aria-label={`Question ${originalIndex + 1}`}
                          >
                            {originalIndex + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500"></div>
                  <span>Answered</span>
                </div>
                <span>{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500"></div>
                  <span>Flagged</span>
                </div>
                <span>{Object.values(flagged).filter(Boolean).length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
                  <span>Unanswered</span>
                </div>
                <span>{questions.length - answeredCount}</span>
              </div>
            </div>
          </Card>
        </aside>

        <main className="flex-1 max-w-3xl relative">
          {isPaused && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl">
              <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm mx-auto">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${selectedProcess?.style.primary_color}20` }}
                >
                  <Pause className="w-8 h-8" style={{ color: selectedProcess?.style.primary_color }} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">Assessment Paused</h3>
                <p className="text-slate-500 text-sm mb-6">Take a breather. Your progress and timer are safe.</p>
                <Button 
                  onClick={togglePause} 
                  className="w-full font-bold h-12 rounded-xl"
                  style={{ backgroundColor: selectedProcess?.style.primary_color, color: 'white' }}
                >
                  Resume Assessment
                </Button>
              </div>
            </div>
          )}
          
          {questions[currentIndex] && (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <div className="h-1.5 w-full" style={{ backgroundColor: selectedProcess?.style.primary_color }}></div>
              <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Question {currentIndex + 1}
                    </span>
                    <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {questions[currentIndex].category || "General"}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleFlag} 
                    className={cn(
                      "gap-2 font-bold rounded-full px-4 transition-colors",
                      flagged[questions[currentIndex].id] ? "bg-amber-50 text-amber-600" : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <Flag className={cn("w-4 h-4", flagged[questions[currentIndex].id] && "fill-current")} />
                    <span className="text-xs">
                      {flagged[questions[currentIndex].id] ? "Flagged" : "Flag"}
                    </span>
                  </Button>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-10">
                  {questions[currentIndex].question_text}
                </h3>

                <div className="space-y-4 mb-10">
                  {(
                    questions[currentIndex].type === "MCQ" || 
                    (!questions[currentIndex].type && (questions[currentIndex].option_a || questions[currentIndex].options))
                  ) ? (
                    <div className="grid grid-cols-1 gap-4">
                      {(questions[currentIndex].options || [
                        questions[currentIndex].option_a, 
                        questions[currentIndex].option_b, 
                        questions[currentIndex].option_c, 
                        questions[currentIndex].option_d
                      ]).map((opt, i) => {
                        if (!opt) return null;
                        const key = String.fromCharCode(65 + i);
                        const isSelected = answers[questions[currentIndex].id] === key;
                        return (
                          <button
                            key={key}
                            className={cn(
                              "w-full flex items-center gap-5 p-5 text-left border-2 rounded-2xl transition-all duration-200 group",
                              isSelected 
                                ? "border-slate-900 bg-slate-50 shadow-md" 
                                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                            )}
                            onClick={() => handleAnswerChange(questions[currentIndex].id, key, true)}
                            style={isSelected ? { borderColor: selectedProcess?.style.primary_color } : {}}
                          >
                            <span className={cn(
                              "w-10 h-10 shrink-0 rounded-xl font-black flex items-center justify-center transition-colors",
                              isSelected 
                                ? "text-white" 
                                : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                            )}
                            style={isSelected ? { backgroundColor: selectedProcess?.style.primary_color } : {}}
                            >
                              {key}
                            </span>
                            <span className={cn(
                              "font-bold text-lg",
                              isSelected ? "text-slate-900" : "text-slate-600"
                            )}>
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : questions[currentIndex].type === "CHECKBOX" ? (
                    <div className="grid grid-cols-1 gap-4">
                      {questions[currentIndex].options?.map((opt, i) => {
                        const key = String.fromCharCode(65 + i);
                        const isChecked = (answers[questions[currentIndex].id] || []).includes(key);
                        return (
                          <button
                            key={key}
                            className={cn(
                              "w-full flex items-center gap-5 p-5 text-left border-2 rounded-2xl transition-all duration-200 group",
                              isChecked 
                                ? "border-slate-900 bg-slate-50 shadow-md" 
                                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                            )}
                            onClick={() => handleCheckboxChange(questions[currentIndex].id, key, !isChecked)}
                            style={isChecked ? { borderColor: selectedProcess?.style.primary_color } : {}}
                          >
                            <div className={cn(
                              "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors",
                              isChecked 
                                ? "text-white" 
                                : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                            )}
                            style={isChecked ? { backgroundColor: selectedProcess?.style.primary_color } : {}}
                            >
                              <Checkbox 
                                checked={isChecked} 
                                onCheckedChange={(checked) => handleCheckboxChange(questions[currentIndex].id, key, !!checked)} 
                                className={cn("border-none", isChecked ? "text-white" : "text-transparent")}
                              />
                            </div>
                            <span className={cn(
                              "font-bold text-lg",
                              isChecked ? "text-slate-900" : "text-slate-600"
                            )}>
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Written Answer</Label>
                      <Input
                        placeholder="Start typing your answer here..."
                        className="h-20 text-xl px-6 rounded-2xl border-2 border-slate-100 focus:border-slate-900 transition-all shadow-sm"
                        value={answers[questions[currentIndex].id] || ""}
                        onChange={(e) => handleAnswerChange(questions[currentIndex].id, e.target.value)}
                        style={{ "--tw-ring-color": selectedProcess?.style.primary_color } as any}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="gap-2 font-bold h-12 rounded-xl text-slate-500"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-3">
                    {currentIndex === questions.length - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={loading || !allRequirementsMet}
                        className={cn(
                          "gap-2 font-bold h-12 px-8 rounded-xl transition-all duration-300",
                          allRequirementsMet 
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        )}
                        style={allRequirementsMet ? {} : { backgroundColor: '#e2e8f0', color: '#94a3b8' }}
                      >
                        Finish Assessment
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="gap-2 font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20"
                        style={{ backgroundColor: selectedProcess?.style.primary_color, color: 'white' }}
                      >
                        Next Question
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
