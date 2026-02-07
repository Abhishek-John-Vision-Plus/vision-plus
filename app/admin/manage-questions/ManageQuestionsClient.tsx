"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/app/_components/Loading";

interface Question {
  id: string;
  type: string;
  question: string;
  options: string[] | null;
  correctAnswer: string | null;
  process: string | null;
  category: string | null;
  module: string | null;
  role: string | null;
}

interface ManageQuestionsClientProps {
  initialQuestions: Question[];
  isSuperAdmin: boolean;
  allowedProcess: string;
  userRole: string;
  userProcess: string;
}

export default function ManageQuestionsClient({ 
  initialQuestions, 
  isSuperAdmin, 
  allowedProcess,
  userRole,
  userProcess
}: ManageQuestionsClientProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProcess, setFilterProcess] = useState(isSuperAdmin ? "all" : allowedProcess);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterModule, setFilterModule] = useState("all");

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: "MCQ",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    process: isSuperAdmin ? "" : allowedProcess,
    category: "",
    module: "",
    role: "BOTH",
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const url = isSuperAdmin ? "/api/mcqs" : `/api/mcqs?process=${allowedProcess}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.mcqs) {
        setQuestions(data.mcqs.map((q: any) => ({
          ...q,
          options: q.options ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)) : null
        })));
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Get unique processes, categories, and modules for filters
  const processes = Array.from(new Set(questions.map(q => q.process).filter(Boolean)));
  const categories = Array.from(new Set(questions.filter(q => filterProcess === 'all' || q.process === filterProcess).map(q => q.category).filter(Boolean)));
  const modules = Array.from(new Set(questions.filter(q => (filterProcess === 'all' || q.process === filterProcess) && (filterCategory === 'all' || q.category === filterCategory)).map(q => q.module).filter(Boolean)));

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.module?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProcess = filterProcess === "all" || q.process === filterProcess;
    const matchesCategory = filterCategory === "all" || q.category === filterCategory;
    const matchesModule = filterModule === "all" || q.module === filterModule;
    return matchesSearch && matchesProcess && matchesCategory && matchesModule;
  });

  const handleAddQuestion = async () => {
    if (!newQuestion.question) {
      toast.error("Question text is required");
      return;
    }

    try {
      const res = await fetch("/api/mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...newQuestion, 
          userRole: userRole, 
          userProcess: userProcess 
        }),
      });

      if (res.ok) {
        toast.success("Question added successfully");
        fetchQuestions();
        setNewQuestion({
          type: "MCQ",
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          process: isSuperAdmin ? "" : allowedProcess,
          category: "",
          module: "",
          role: "BOTH",
        });
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to add question");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch(`/api/mcqs?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Question deleted");
        fetchQuestions();
      }
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<Question>) => {
    try {
      const res = await fetch("/api/mcqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          ...updatedData,
          userRole: userRole,
          userProcess: userProcess
        }),
      });

      if (res.ok) {
        toast.success("Question updated");
        setEditingId(null);
        fetchQuestions();
      }
    } catch (error) {
      toast.error("Failed to update question");
    }
  };

  // Assignment state
  const [targetEmail, setTargetEmail] = useState("");
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  const fetchAssigned = async (email: string) => {
    if (!email) return setAssignedIds([]);
    try {
      const res = await fetch(`/api/assignments?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setAssignedIds((data.assigned || []).map((a: any) => a.mcqId));
    } catch {
      setAssignedIds([]);
    }
  };

  const handleAssign = async (mcqId: string, assign: boolean) => {
    if (!targetEmail) {
      toast.error("Enter target user's email to assign");
      return;
    }
    try {
      if (assign) {
        const res = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mcqId, userEmail: targetEmail }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to assign");
        }
        toast.success("Assigned to user");
      } else {
        const res = await fetch(`/api/assignments?email=${encodeURIComponent(targetEmail)}&mcqId=${mcqId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to unassign");
        }
        toast.success("Unassigned from user");
      }
      fetchAssigned(targetEmail);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Questionnaire</h1>
        <Button onClick={() => window.location.href = '/admin/upload-mcq'}>
          Bulk Upload (PDF/DOCX)
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assignment Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Target User Email</Label>
              <Input
                placeholder="Enter user email to assign questions"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                onBlur={() => fetchAssigned(targetEmail)}
              />
              <p className="text-xs text-slate-500">Tip: After entering email, you can assign/unassign per question below.</p>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => fetchAssigned(targetEmail)}>Load Assigned</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Filter Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="Search questions..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Process</Label>
              <Select value={filterProcess} onValueChange={setFilterProcess} disabled={!isSuperAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="All Processes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  {isSuperAdmin ? processes.map(p => (
                    <SelectItem key={p} value={p || "none"}>{p}</SelectItem>
                  )) : (
                    <SelectItem value={allowedProcess}>{allowedProcess}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category (Topic)</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c} value={c || "none"}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Module</Label>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger>
                  <SelectValue placeholder="All Modules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {modules.map(m => (
                    <SelectItem key={m} value={m || "none"}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select 
                value={newQuestion.type} 
                onValueChange={(val) => setNewQuestion({...newQuestion, type: val, options: val === "TEXT" ? null : ["", "", "", ""]})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MCQ">Multiple Choice</SelectItem>
                  <SelectItem value="CHECKBOX">Checkboxes</SelectItem>
                  <SelectItem value="TEXT">Text Input</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Process</Label>
              <Input 
                placeholder="e.g. BSNL, Aadhar" 
                value={newQuestion.process || ""} 
                onChange={(e) => setNewQuestion({...newQuestion, process: e.target.value})}
                disabled={!isSuperAdmin}
              />
              {!isSuperAdmin && <p className="text-xs text-slate-500">Restricted to your allocated process: {allowedProcess}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question Text</Label>
            <Input 
              placeholder="Enter question here" 
              value={newQuestion.question} 
              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            />
          </div>

          {(newQuestion.type === "MCQ" || newQuestion.type === "CHECKBOX") && (
            <div className="space-y-3">
              <Label>Options</Label>
              {newQuestion.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded">{String.fromCharCode(65 + idx)}</span>
                  <Input 
                    value={opt} 
                    onChange={(e) => {
                      const newOpts = [...(newQuestion.options || [])];
                      newOpts[idx] = e.target.value;
                      setNewQuestion({...newQuestion, options: newOpts});
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  />
                  {newQuestion.options && newQuestion.options.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => {
                      const newOpts = newQuestion.options?.filter((_, i) => i !== idx);
                      setNewQuestion({...newQuestion, options: newOpts});
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setNewQuestion({...newQuestion, options: [...(newQuestion.options || []), ""]})}>
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label>Correct Answer {newQuestion.type === "CHECKBOX" ? "(Separate with commas for multiple)" : ""}</Label>
            <Input 
              placeholder={newQuestion.type === "TEXT" ? "Expected answer" : "e.g. A or A,B"} 
              value={newQuestion.correctAnswer || ""} 
              onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={newQuestion.category || ""} onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Module</Label>
              <Input value={newQuestion.module || ""} onChange={(e) => setNewQuestion({...newQuestion, module: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newQuestion.role || "BOTH"} onValueChange={(val) => setNewQuestion({...newQuestion, role: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CO">CO</SelectItem>
                  <SelectItem value="FRO">FRO</SelectItem>
                  <SelectItem value="BOTH">BOTH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAddQuestion} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Question to Database
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Existing Questions</h2>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loading message="Loading questions..." />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <p className="text-slate-500">No questions found matching your filters.</p>
        ) : (
          filteredQuestions.map((q) => (
            <Card key={q.id}>
              <CardContent className="p-6">
                {editingId === q.id ? (
                  <div className="space-y-4">
                    <Input value={q.question} onChange={(e) => setQuestions(questions.map(item => item.id === q.id ? {...item, question: e.target.value} : item))} />
                    {/* Add more edit fields if needed, for now just basic edit */}
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdate(q.id, q)}><Save className="w-4 h-4 mr-2" /> Save</Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{q.type}</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{q.process}</span>
                        {targetEmail && (
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${assignedIds.includes(q.id) ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {assignedIds.includes(q.id) ? 'Assigned' : 'Not Assigned'}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-lg">{q.question}</p>
                      {q.options && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`text-sm p-2 rounded border ${q.correctAnswer?.includes(String.fromCharCode(65 + i)) ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
                              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-slate-500 mt-2">Correct Answer: <span className="font-bold text-green-600">{q.correctAnswer}</span></p>
                    </div>
                    <div className="flex gap-2">
                      {targetEmail && (
                        assignedIds.includes(q.id) ? (
                          <Button variant="outline" size="sm" onClick={() => handleAssign(q.id, false)}>Unassign</Button>
                        ) : (
                          <Button variant="default" size="sm" onClick={() => handleAssign(q.id, true)}>Assign</Button>
                        )
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setEditingId(q.id)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(q.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
