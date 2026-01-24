export const gstModules = [
  {
    id: 'gst-module1',
    name: 'GST Basics & Structure',
    description: 'Introduction to GST, types, and governing authority',
    role: 'BOTH',
    questionCount: 10
  },
  {
    id: 'gst-module2',
    name: 'GST Registration & Returns',
    description: 'GST registration, returns filing, and compliance',
    role: 'BOTH',
    questionCount: 10
  },
  {
    id: 'gst-module3',
    name: 'GST Assessment & Appeals',
    description: 'GST notices, assessment, and appellate process',
    role: 'BOTH',
    questionCount: 10
  }
];

export const gstQuestions = [
  {
    id: 3001,
    question_text: "What does GST stand for?",
    option_a: "General Sales Tax",
    option_b: "Goods and Services Tax",
    option_c: "Government Sales Tax",
    option_d: "Global Service Tax",
    correct_option: "B",
    category: "Basics",
    module: "gst-module1",
    role: "BOTH"
  },
  {
    id: 3002,
    question_text: "GST was implemented in India from which date?",
    option_a: "1 April 2016",
    option_b: "1 July 2017",
    option_c: "1 January 2018",
    option_d: "1 April 2018",
    correct_option: "B",
    category: "Basics",
    module: "gst-module1",
    role: "BOTH"
  },
  {
    id: 3003,
    question_text: "Which authority administers GST in India?",
    option_a: "Reserve Bank of India",
    option_b: "GST Council",
    option_c: "Income Tax Department",
    option_d: "NITI Aayog",
    correct_option: "B",
    category: "Basics",
    module: "gst-module1",
    role: "BOTH"
  },
  {
    id: 3004,
    question_text: "Which of the following is NOT a type of GST?",
    option_a: "CGST",
    option_b: "SGST",
    option_c: "IGST",
    option_d: "UGST Plus",
    correct_option: "D",
    category: "Basics",
    module: "gst-module1",
    role: "BOTH"
  },
  {
    id: 3005,
    question_text: "Who is required to register under GST?",
    option_a: "Only government departments",
    option_b: "Only manufacturers",
    option_c: "Businesses exceeding prescribed turnover limits",
    option_d: "Only exporters",
    correct_option: "C",
    category: "Registration",
    module: "gst-module2",
    role: "BOTH"
  },
  {
    id: 3006,
    question_text: "Which document is issued after successful GST registration?",
    option_a: "PAN",
    option_b: "GSTIN",
    option_c: "TAN",
    option_d: "CIN",
    correct_option: "B",
    category: "Registration",
    module: "gst-module2",
    role: "BOTH"
  },
  {
    id: 3007,
    question_text: "Which return is generally filed monthly by regular GST taxpayers?",
    option_a: "GSTR-1",
    option_b: "GSTR-2",
    option_c: "GSTR-3B",
    option_d: "GSTR-9",
    correct_option: "C",
    category: "Returns",
    module: "gst-module2",
    role: "BOTH"
  },
  {
    id: 3008,
    question_text: "Input Tax Credit (ITC) refers to:",
    option_a: "Tax paid on exports",
    option_b: "Tax refund on salary",
    option_c: "Credit of GST paid on purchases",
    option_d: "Penalty waiver",
    correct_option: "C",
    category: "Returns",
    module: "gst-module2",
    role: "BOTH"
  },
  {
    id: 3009,
    question_text: "What is the first step if a taxpayer receives a GST notice?",
    option_a: "Ignore the notice",
    option_b: "Pay penalty immediately",
    option_c: "Review and respond within the given time",
    option_d: "Approach GSTAT directly",
    correct_option: "C",
    category: "Assessment",
    module: "gst-module3",
    role: "BOTH"
  },
  {
    id: 3010,
    question_text: "Which authority conducts GST assessments?",
    option_a: "GST officers",
    option_b: "Police department",
    option_c: "RBI",
    option_d: "District Collector",
    correct_option: "A",
    category: "Assessment",
    module: "gst-module3",
    role: "BOTH"
  }
];
