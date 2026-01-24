

export const aadhaarModules = [
  {
    id: 'aadhaar-module1',
    name: 'Aadhaar Basics & Overview',
    description: 'Introduction to Aadhaar, UIDAI, and basic concepts',
    role: 'BOTH',
    questionCount: 10
  },
  {
    id: 'aadhaar-module2',
    name: 'Aadhaar Enrolment Process',
    description: 'New enrolment, documents, and demographic details',
    role: 'BOTH',
    questionCount: 10
  },
  {
    id: 'aadhaar-module3',
    name: 'Aadhaar Update & eKYC',
    description: 'Aadhaar update, verification, and eKYC process',
    role: 'BOTH',
    questionCount: 10
  }
];


export const aadhaarQuestions = [
  {
    id: 1001,
    question_text: "Which authority issues Aadhaar in India?",
    option_a: "Ministry of Home Affairs",
    option_b: "UIDAI",
    option_c: "NITI Aayog",
    option_d: "Election Commission of India",
    correct_option: "B",
    category: "Basics",
    module: "aadhaar-module1",
    role: "BOTH"
  },
  {
    id: 1002,
    question_text: "How many digits are there in an Aadhaar number?",
    option_a: "10",
    option_b: "11",
    option_c: "12",
    option_d: "16",
    correct_option: "C",
    category: "Basics",
    module: "aadhaar-module1",
    role: "BOTH"
  },
  {
    id: 1003,
    question_text: "Which biometric information is collected during Aadhaar enrolment?",
    option_a: "DNA sample",
    option_b: "Retina scan only",
    option_c: "Fingerprints, iris scan, and photograph",
    option_d: "Blood group",
    correct_option: "C",
    category: "Basics",
    module: "aadhaar-module1",
    role: "BOTH"
  },
  {
    id: 1004,
    question_text: "Aadhaar is primarily used for which purpose?",
    option_a: "Citizenship proof",
    option_b: "Date of birth certificate",
    option_c: "Unique identity verification",
    option_d: "Voter registration",
    correct_option: "C",
    category: "Basics",
    module: "aadhaar-module1",
    role: "BOTH"
  },
  {
    id: 1005,
    question_text: "Which document is mandatory for Aadhaar enrolment?",
    option_a: "Only PAN card",
    option_b: "Only passport",
    option_c: "Proof of identity and address",
    option_d: "Driving license only",
    correct_option: "C",
    category: "Enrolment",
    module: "aadhaar-module2",
    role: "BOTH"
  },
  {
    id: 1006,
    question_text: "Which age group can apply for Aadhaar?",
    option_a: "Only adults",
    option_b: "Only citizens above 18 years",
    option_c: "Only senior citizens",
    option_d: "All residents including children",
    correct_option: "D",
    category: "Enrolment",
    module: "aadhaar-module2",
    role: "BOTH"
  },
  {
    id: 1007,
    question_text: "What is the name of Aadhaar issued for children below 5 years?",
    option_a: "Junior Aadhaar",
    option_b: "Child UID",
    option_c: "Baal Aadhaar",
    option_d: "Mini Aadhaar",
    correct_option: "C",
    category: "Enrolment",
    module: "aadhaar-module2",
    role: "BOTH"
  },
  {
    id: 1008,
    question_text: "Which details can be updated online in Aadhaar?",
    option_a: "Biometrics",
    option_b: "Name and address",
    option_c: "Iris scan",
    option_d: "Fingerprints",
    correct_option: "B",
    category: "Update",
    module: "aadhaar-module3",
    role: "BOTH"
  },
  {
    id: 1009,
    question_text: "Biometric updates in Aadhaar can be done:",
    option_a: "Online only",
    option_b: "Through mobile app",
    option_c: "At Aadhaar Seva Kendra",
    option_d: "By SMS",
    correct_option: "C",
    category: "Update",
    module: "aadhaar-module3",
    role: "BOTH"
  },
  {
    id: 1010,
    question_text: "What is Aadhaar eKYC mainly used for?",
    option_a: "Bank account verification",
    option_b: "Mobile number verification",
    option_c: "Digital identity verification with consent",
    option_d: "Passport issuance",
    correct_option: "C",
    category: "eKYC",
    module: "aadhaar-module3",
    role: "BOTH"
  },
  {
    id: 1011,
    question_text: "Which authentication method is commonly used for Aadhaar eKYC?",
    option_a: "Email verification",
    option_b: "OTP or biometric authentication",
    option_c: "Physical document submission",
    option_d: "Courier verification",
    correct_option: "B",
    category: "eKYC",
    module: "aadhaar-module3",
    role: "BOTH"
  },
  {
    id: 1012,
    question_text: "Masked Aadhaar hides how many digits of the Aadhaar number?",
    option_a: "First 4 digits",
    option_b: "Last 4 digits",
    option_c: "Middle 4 digits",
    option_d: "First 8 digits",
    correct_option: "D",
    category: "Security",
    module: "aadhaar-module3",
    role: "BOTH"
  }
];

