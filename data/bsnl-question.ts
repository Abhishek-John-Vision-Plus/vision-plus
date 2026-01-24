export const bsnlModules = [
  {
    id: 'bsnl-module1',
    name: 'BSNL Overview & Services',
    description: 'Introduction to BSNL and its major telecom services',
    role: 'BOTH',
    questionCount: 10
  },
  {
    id: 'bsnl-module2',
    name: 'BSNL KYC & Customer Onboarding',
    description: 'Customer verification, Aadhaar KYC, and documentation',
    role: 'BOTH',
    questionCount: 10
  },
  {
    id: 'bsnl-module3',
    name: 'BSNL Activation, Billing & Support',
    description: 'Service activation, billing, complaints, and support process',
    role: 'BOTH',
    questionCount: 10
  }
];

export const bsnlQuestions = [
  {
    id: 2001,
    question_text: "What does BSNL stand for?",
    option_a: "Bharat State Network Limited",
    option_b: "Bharat Sanchar Nigam Limited",
    option_c: "Bharat Services Network Limited",
    option_d: "Bharat Satellite Network Limited",
    correct_option: "B",
    category: "Basics",
    module: "bsnl-module1",
    role: "BOTH"
  },
  {
    id: 2002,
    question_text: "BSNL is operated under which ownership?",
    option_a: "Private company",
    option_b: "Public sector undertaking",
    option_c: "State government",
    option_d: "Foreign enterprise",
    correct_option: "B",
    category: "Basics",
    module: "bsnl-module1",
    role: "BOTH"
  },
  {
    id: 2003,
    question_text: "Which of the following services is provided by BSNL?",
    option_a: "Mobile services",
    option_b: "Broadband and FTTH",
    option_c: "Landline services",
    option_d: "All of the above",
    correct_option: "D",
    category: "Services",
    module: "bsnl-module1",
    role: "BOTH"
  },
  {
    id: 2004,
    question_text: "BSNL FTTH service primarily provides:",
    option_a: "Satellite television",
    option_b: "High-speed internet through optical fiber",
    option_c: "Only voice calls",
    option_d: "Radio communication",
    correct_option: "B",
    category: "Services",
    module: "bsnl-module1",
    role: "BOTH"
  },
  {
    id: 2005,
    question_text: "Which type of mobile services does BSNL offer?",
    option_a: "Only prepaid",
    option_b: "Only postpaid",
    option_c: "Both prepaid and postpaid",
    option_d: "Corporate only",
    correct_option: "C",
    category: "Services",
    module: "bsnl-module1",
    role: "BOTH"
  },
  {
    id: 2006,
    question_text: "Which document is commonly used for BSNL customer KYC?",
    option_a: "Ration card only",
    option_b: "Aadhaar card",
    option_c: "Birth certificate",
    option_d: "Marksheet",
    correct_option: "B",
    category: "KYC",
    module: "bsnl-module2",
    role: "BOTH"
  },
  {
    id: 2007,
    question_text: "BSNL eKYC is mainly used to:",
    option_a: "Issue SIM cards faster",
    option_b: "Verify customer identity digitally",
    option_c: "Activate roaming services",
    option_d: "Collect payments",
    correct_option: "B",
    category: "KYC",
    module: "bsnl-module2",
    role: "BOTH"
  },
  {
    id: 2008,
    question_text: "Which authentication method is commonly used in BSNL Aadhaar eKYC?",
    option_a: "Email OTP",
    option_b: "Courier verification",
    option_c: "OTP or biometric authentication",
    option_d: "Manual signature only",
    correct_option: "C",
    category: "KYC",
    module: "bsnl-module2",
    role: "BOTH"
  },
  {
    id: 2009,
    question_text: "What is required before activating a new BSNL SIM?",
    option_a: "Only payment",
    option_b: "Only address proof",
    option_c: "Successful KYC verification",
    option_d: "Customer feedback",
    correct_option: "C",
    category: "Activation",
    module: "bsnl-module3",
    role: "BOTH"
  },
  {
    id: 2010,
    question_text: "BSNL services are usually activated within:",
    option_a: "Immediately without verification",
    option_b: "24–72 hours after KYC approval",
    option_c: "15 days",
    option_d: "Only after one month",
    correct_option: "B",
    category: "Activation",
    module: "bsnl-module3",
    role: "BOTH"
  },
  {
    id: 2011,
    question_text: "Which payment modes are accepted by BSNL?",
    option_a: "Cash only",
    option_b: "Cheque only",
    option_c: "Online and offline payment modes",
    option_d: "Cryptocurrency",
    correct_option: "C",
    category: "Billing",
    module: "bsnl-module3",
    role: "BOTH"
  },
  {
    id: 2012,
    question_text: "BSNL customer complaints can be raised through:",
    option_a: "BSNL customer care",
    option_b: "Online BSNL portal",
    option_c: "BSNL service centers",
    option_d: "All of the above",
    correct_option: "D",
    category: "Support",
    module: "bsnl-module3",
    role: "BOTH"
  }
];

