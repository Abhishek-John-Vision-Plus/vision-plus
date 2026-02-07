"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import PdfViewer from "./_components/pdfViewer";
import Loading from "@/app/_components/Loading";

interface UploadMCQClientProps {
  userRole: string;
  userProcess: string;
}

export default function UploadMCQClient({ userRole, userProcess }: UploadMCQClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [process, setProcess] = useState(userProcess);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number; message?: string } | null>(null);
  const [openPdf, setOpenPdf] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("process", process);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response from upload:", text);
        throw new Error(`Server Error: ${res.status} ${res.statusText}. Please check the server logs.`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResult({ success: true, count: data.count, message: data.message });
      toast.success(data.message || "MCQs extracted successfully");
      setFile(null);
      setProcess(userProcess);
      // Reset input
      const fileInput = document.getElementById("mcq-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setResult({ success: false, message: error.message });
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      {loading && <Loading message="Processing document with AI..." fullScreen={true} />}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Upload size={24} />
            </div>
            <CardTitle className="text-2xl">Upload MCQs</CardTitle>
          </div>
          <CardDescription>
            Upload a PDF or DOCX file to automatically extract multiple-choice questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="process">Process Name (Optional)</Label>
              <Input
                id="process"
                placeholder="e.g. BSNL, GST, Aadhar"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                disabled={userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mcq-file">Select File (.pdf, .docx)</Label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  file ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  id="mcq-file"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="mcq-file"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  {file ? (
                    <>
                      <FileText size={48} className="text-blue-500" />
                      <div className="text-sm font-medium text-blue-700">{file.name}</div>
                      <div className="text-xs text-blue-500">Click to change file</div>
                    </>
                  ) : (
                    <>
                      <Upload size={48} className="text-gray-400" />
                      <div className="text-sm font-medium text-gray-600">Click to browse or drag and drop</div>
                      <div className="text-xs text-gray-400">PDF or DOCX up to 10MB</div>
                    </>
                  )}
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Extracting MCQs...
                </>
              ) : (
                "Start Extraction"
              )}
            </Button>
          </form>
        </CardContent>
        {result && (
          <CardFooter className="flex flex-col items-start bg-gray-50 rounded-b-xl border-t p-6">
            <div className="flex items-center gap-2 mb-2 font-semibold">
              {result.success ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <AlertCircle className="text-red-500" />
              )}
              {result.success ? "Extraction Successful" : "Extraction Failed"}
            </div>
            <p className="text-sm text-gray-600">
              {result.message}
            </p>
          </CardFooter>
        )}
      </Card>

      <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-100">
        <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          <FileText size={18} /> Format Guidelines
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-5">
          <li>Questions must be numbered (e.g., 1. Which authority issues Aadhaar in India?)</li>
          <li>Options must be labeled A., B., C., D. on separate lines or inline</li>
          <li>The correct answer must be marked as "Correct Answer: B"</li>
          <li>Include "Category: Basics | Module: aadhaar-module1" after the answer line</li>
          <li>Separate each question block with a blank line</li>
        </ul>
        <Button 
          className="mt-4 w-full h-12 text-lg font-semibold"
          onClick={() => setOpenPdf(true)}
        >
          View Full Format Guidelines
        </Button>
        {openPdf && <PdfViewer onClose={() => setOpenPdf(false)} />}
      </div>
    </div>
  );
}
