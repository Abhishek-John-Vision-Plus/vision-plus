'use client'
import { useProcess } from '@/context/ProcessContext'
import { useAuth } from '@/context/AuthContext'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Webdata } from '@/data/data'

interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  category: string;
  module: string;
  role: string;
}

function Test() {
  const { selectedProcess } = useProcess();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user || !selectedProcess) return;

      setLoading(true);
      setError(null);
      try {
        // Find the process key from Webdata based on the selectedProcess name
        const processKey = Object.keys(Webdata.processes).find(
          (key) => (Webdata.processes as any)[key].name === selectedProcess.name
        );

        if (!processKey) {
          throw new Error('Process key not found');
        }

        const response = await fetch(`/api/process/${processKey}?userId=${user.id}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, selectedProcess]);

  const handleOptionSelect = (questionId: number, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async () => {
    if (!user || !selectedProcess || questions.length === 0) return;

    setLoading(true);
    try {
      let correct = 0;
      let wrong = 0;

      questions.forEach(q => {
        const selected = selectedAnswers[q.id];
        if (selected) {
          if (selected === q.correct_option) {
            correct++;
          } else {
            wrong++;
          }
        }
      });

      // Minus marking: 1/4 (0.25) deduction for each wrong answer
      const score = correct - (wrong * 0.25);
      const percentage = (score / questions.length) * 100;
      const status = percentage >= 50 ? "PASSED" : "FAILED";

      const payload = {
        userId: user.id,
        process: selectedProcess.name,
        score,
        correctAnswers: correct,
        wrongAnswers: wrong,
        totalQuestions: questions.length,
        answers: selectedAnswers,
        percentage,
        status
      };

      const response = await fetch('/api/test-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to save assessment result');
      }

      const data = await response.json();
      setResult(data);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error submitting test:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Login Required</h2>
            <p className="text-slate-500 mb-4">Please log in to access the assessment.</p>
            <Button onClick={() => window.location.href = '/login'} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Error</h2>
            <p className="text-slate-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
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
              <CardTitle className="text-3xl font-black tracking-tight">Assessment {result.status}</CardTitle>
              <p className="text-slate-500 font-medium mt-2">Here is your performance summary for {result.process}</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Final Score</p>
                  <p className="text-4xl font-black text-slate-900">{result.score.toFixed(2)}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Percentage</p>
                  <p className="text-4xl font-black text-slate-900">{result.percentage.toFixed(1)}%</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl text-center border border-emerald-100">
                  <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-1">Correct</p>
                  <p className="text-4xl font-black text-emerald-700">{result.correctAnswers}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
                  <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-1">Wrong</p>
                  <p className="text-4xl font-black text-red-700">{result.wrongAnswers}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-600 font-medium">Total Questions</span>
                  <span className="font-bold text-slate-900">{result.totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-600 font-medium">Negative Marking</span>
                  <span className="font-bold text-red-600">-0.25 per wrong</span>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = '/'} 
                className="w-full mt-10 h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-lg shadow-lg"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic">{selectedProcess?.name} Assessment</h1>
            <p className="text-slate-500 mt-1 font-medium">Please answer all questions carefully. 1/4 marks will be deducted for each wrong answer.</p>
          </div>
          <div className="bg-white border border-slate-200 shadow-sm px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Total Items</p>
              <p className="text-xl font-black text-slate-900 leading-none">{questions.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <Card key={q.id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardHeader className="pb-4 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      Question {index + 1}
                    </span>
                    <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {q.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 leading-tight">
                    {q.question_text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'A', text: q.option_a },
                      { key: 'B', text: q.option_b },
                      { key: 'C', text: q.option_c },
                      { key: 'D', text: q.option_d },
                    ].map((opt) => (
                      <div
                        key={opt.key}
                        onClick={() => handleOptionSelect(q.id, opt.key)}
                        className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4 group/opt ${
                          selectedAnswers[q.id] === opt.key
                            ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                            : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
                        }`}
                      >
                        <span className={`w-10 h-10 rounded-xl font-black flex items-center justify-center transition-all duration-200 ${
                          selectedAnswers[q.id] === opt.key
                            ? 'bg-emerald-500 text-white scale-110'
                            : 'bg-white text-slate-400 group-hover/opt:bg-slate-200 group-hover/opt:text-slate-600'
                        }`}>
                          {opt.key}
                        </span>
                        <span className={`font-bold transition-colors ${
                          selectedAnswers[q.id] === opt.key ? 'text-emerald-700' : 'text-slate-600'
                        }`}>
                          {opt.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-2 border-slate-200 bg-transparent">
              <CardContent className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 text-xl font-bold">No questions found for this process.</p>
                <p className="text-slate-400 mt-2">Please check back later or contact support.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-slate-400 text-sm font-medium">
              {Object.keys(selectedAnswers).length} of {questions.length} questions answered
            </p>
            <Button 
              onClick={handleSubmit}
              disabled={loading || Object.keys(selectedAnswers).length === 0}
              className="w-full md:w-auto min-w-[300px] h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                'SUBMIT ASSESSMENT'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Test