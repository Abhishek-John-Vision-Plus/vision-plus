import React from "react";

function FormatGuidelinesContent() {
  return (
    <div className="max-w-5xl mx-auto p-10 bg-white text-gray-900">
      <h1 className="text-3xl font-bold text-center mb-8">
        MCQ Upload Format Guidelines
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Follow this structure for reliable extraction
      </p>

      <section className="mb-8">
        <h2 className="font-semibold">Example</h2>
        <div className="mt-3 space-y-1">
          <p>1. Which authority issues Aadhaar in India?</p>
          <p>A. Ministry of Home Affairs</p>
          <p>B. UIDAI</p>
          <p>C. NITI Aayog</p>
          <p>D. Election Commission of India</p>
          <p>Correct Answer: B</p>
          <p>Category: Basics | Module: aadhaar-module1</p>
        </div>
<br />
         <div className="mt-3 space-y-1">
          <p>2. What is the first step in the employee onboarding process?</p>
          <p>A. System access allocation</p>
          <p>B. Offer letter acceptance</p>
          <p>C. Performance review</p>
          <p>D. Exit interview</p>
          <p>Correct Answer: B</p>
          <p>Category:  Onboarding Basics | Module: onboarding-module1</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold">Notes</h2>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>Questions must be numbered</li>
          <li>Options must be labeled A., B., C., D.</li>
          <li>Correct answer line must include "Correct Answer: X"</li>
          <li>Optional metadata: "Category: ... | Module: ..."</li>
          <li>Separate question blocks with a blank line</li>
        </ul>
      </section>
    </div>
  );
}

export default function PdfViewer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[90%] rounded-lg shadow-lg p-6 overflow-auto">
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Close
        </button>
        <FormatGuidelinesContent />
      </div>
    </div>
  );
}
