export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: 'A' | 'B' | 'C' | 'D';
  category: string;
  module: string;
  role: 'CO' | 'FRO' | 'BOTH';
}

export interface Module {
  id: string;
  name: string;
  description: string;
  role: 'CO' | 'FRO' | 'BOTH';
  questionCount: number;
}

export interface TestResult {
  score: number;
  total: number;
  percentage: number;
  qualified: boolean;
  answers: Record<number, string>;
  correctAnswers: Record<number, string>;
  moduleId?: string;
  role?: 'CO' | 'FRO';
}

export const modules: Module[] = [
  {
    id: 'module1-co',
    name: 'Introduction & Role of Call Officer',
    description: 'Basic introduction to Elder Line and understanding the role of Call Officer',
    role: 'CO',
    questionCount: 20
  },
  {
    id: 'module2-co',
    name: 'Health & Elder Care Services',
    description: 'Health services, elder care, and assisted living devices for senior citizens',
    role: 'CO',
    questionCount: 20
  },
  {
    id: 'module3-co',
    name: 'Legal Rights & Support Services',
    description: 'Legal rights, pension schemes, and emotional support for elderly',
    role: 'CO',
    questionCount: 20
  },
  {
    id: 'module1-fro',
    name: 'Field Response & Intervention',
    description: 'Field intervention procedures and emergency response protocols',
    role: 'FRO',
    questionCount: 20
  },
  {
    id: 'module2-fro',
    name: 'Case Management & Documentation',
    description: 'Managing cases, documentation, and follow-up procedures',
    role: 'FRO',
    questionCount: 20
  },
  {
    id: 'final-co',
    name: 'Final Assessment - Call Officer',
    description: 'Comprehensive assessment covering all CO modules',
    role: 'CO',
    questionCount: 30
  },
  {
    id: 'final-fro',
    name: 'Final Assessment - Field Response Officer',
    description: 'Comprehensive assessment covering all FRO modules',
    role: 'FRO',
    questionCount: 30
  },
  {
    id: 'pkt-co',
    name: 'PKT Assessment - Call Officer',
    description: 'Practical Knowledge Test for Call Officers',
    role: 'CO',
    questionCount: 25
  },
  {
    id: 'pkt-fro',
    name: 'PKT Assessment - Field Response Officer',
    description: 'Practical Knowledge Test for Field Response Officers',
    role: 'FRO',
    questionCount: 25
  }
];

export const questions: Question[] = [
  // Module 1 - CO: Introduction and Role of Call Officer
  {
    id: 1,
    question_text: "Elder Line (14567) is a national helpline set up by which ministry?",
    option_a: "Ministry of Health and Family Welfare",
    option_b: "Ministry of Home Affairs",
    option_c: "Ministry of Social Justice and Empowerment",
    option_d: "Ministry of Women and Child Development",
    correct_option: "C",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 2,
    question_text: "What is the toll-free number for Elder Line?",
    option_a: "112",
    option_b: "1091",
    option_c: "14567",
    option_d: "181",
    correct_option: "C",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 3,
    question_text: "Elder Line (14567) operates across which areas?",
    option_a: "Selected metro cities only",
    option_b: "Rural areas only",
    option_c: "State capitals only",
    option_d: "All States and Union Territories",
    correct_option: "D",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 4,
    question_text: "What is the availability of Elder Line services?",
    option_a: "Office hours only",
    option_b: "12 hours a day",
    option_c: "Weekdays only",
    option_d: "24×7 (All the time)",
    correct_option: "D",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 5,
    question_text: "Which of the following is NOT a supported channel of Elder Line?",
    option_a: "Phone Call",
    option_b: "WhatsApp",
    option_c: "Email",
    option_d: "Video Conferencing",
    correct_option: "D",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 6,
    question_text: "Elder Line services can be accessed through which of the following channels?",
    option_a: "Phone Call only",
    option_b: "Phone Call and SMS only",
    option_c: "Phone Call, SMS, WhatsApp",
    option_d: "Phone Call, SMS, WhatsApp, Chat, Email, Social Media",
    correct_option: "D",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 7,
    question_text: "What is the vision of Elder Line?",
    option_a: "To provide financial aid to seniors",
    option_b: "To build senior care homes",
    option_c: "A nation where every senior citizen ages with dignity, happiness, and well-being",
    option_d: "To offer employment to seniors",
    correct_option: "C",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 8,
    question_text: "One of the key missions of Elder Line is to:",
    option_a: "Entertain senior citizens",
    option_b: "Replace family support",
    option_c: "Address grievances through a unified platform",
    option_d: "Provide legal punishment",
    correct_option: "C",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 9,
    question_text: "Elder Line ensures timely field interventions through the support of:",
    option_a: "Only government agencies",
    option_b: "Only NGOs",
    option_c: "Only private companies",
    option_d: "Government agencies, NGOs, private sector, senior citizen organizations, and volunteers",
    correct_option: "D",
    category: "Introduction",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 10,
    question_text: "Who is the first point of contact for vulnerable senior citizens?",
    option_a: "Field Response Officer (FRO)",
    option_b: "Hospital staff",
    option_c: "Call Officer (CO)",
    option_d: "Family member",
    correct_option: "C",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 11,
    question_text: "One of the most important responsibilities of a CO is to:",
    option_a: "Conduct field visits",
    option_b: "Handle legal cases",
    option_c: "Build trust, comfort, and safety for callers",
    option_d: "Manage hospital admissions",
    correct_option: "C",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 12,
    question_text: "The role of a CO directly helps in ensuring:",
    option_a: "Faster paperwork",
    option_b: "Entertainment for seniors",
    option_c: "Timely support and dignified ageing",
    option_d: "Only emergency services",
    correct_option: "C",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 13,
    question_text: "Which of the following stakeholders may a CO coordinate with?",
    option_a: "Family members",
    option_b: "NGOs",
    option_c: "Hospitals",
    option_d: "All of the above",
    correct_option: "D",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 14,
    question_text: "Who among the following is NOT typically coordinated with by a CO?",
    option_a: "SHO",
    option_b: "DMO",
    option_c: "DSWO",
    option_d: "School teacher",
    correct_option: "D",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 15,
    question_text: "What should a CO do when a case requires field intervention?",
    option_a: "Close the case immediately",
    option_b: "Ignore the request",
    option_c: "Handle it alone",
    option_d: "Assign or escalate the case to the FRO",
    correct_option: "D",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 16,
    question_text: "What is the primary focus of a CO while handling a caller?",
    option_a: "Speed of call closure",
    option_b: "Personal opinions",
    option_c: "Empathy, safety, and clear communication",
    option_d: "Strict questioning",
    correct_option: "C",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 17,
    question_text: "COs help senior citizens mainly by:",
    option_a: "Providing medical treatment",
    option_b: "Visiting homes",
    option_c: "Coordinating support and ensuring timely action",
    option_d: "Managing finances",
    correct_option: "C",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  {
    id: 18,
    question_text: "Which statement best describes the role of a CO?",
    option_a: "Works only during emergencies",
    option_b: "Handles only technical issues",
    option_c: "Acts as a compassionate first responder and coordinator",
    option_d: "Replaces the role of FRO",
    correct_option: "C",
    category: "Role of CO",
    module: "module1-co",
    role: "CO"
  },
  // Module 2 - CO: Health Related Services
  {
    id: 19,
    question_text: "The Government of India has established several programs mainly to provide:",
    option_a: "Employment for elders",
    option_b: "Housing facilities",
    option_c: "Affordable and dedicated healthcare services for elders",
    option_d: "Entertainment services",
    correct_option: "C",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 20,
    question_text: "Continuous Care Homes are meant for senior citizens afflicted with:",
    option_a: "Diabetes",
    option_b: "Heart disease",
    option_c: "Alzheimer's disease / Dementia",
    option_d: "Cancer",
    correct_option: "C",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 21,
    question_text: "Mobile Medicare Units are designed to serve senior citizens living in:",
    option_a: "Urban corporate areas",
    option_b: "Metro cities only",
    option_c: "Slums, rural, and inaccessible areas",
    option_d: "Private housing societies",
    correct_option: "C",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 22,
    question_text: "Physiotherapy Clinics supported under this program must serve a minimum of:",
    option_a: "10 senior citizens per month",
    option_b: "25 senior citizens per month",
    option_c: "50 senior citizens per month",
    option_d: "100 senior citizens per month",
    correct_option: "C",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 23,
    question_text: "Which program brings healthcare services directly to elders' locations?",
    option_a: "Physiotherapy Clinics",
    option_b: "Continuous Care Homes",
    option_c: "Mobile Medicare Units",
    option_d: "Senior hostels",
    correct_option: "C",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 24,
    question_text: "Which program provides free health check-ups and special geriatric care in government hospitals?",
    option_a: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
    option_b: "Central Government Health Scheme",
    option_c: "National Programme for Health Care of the Elderly",
    option_d: "Rashtriya Varisth Jan Swasthya Yojana",
    correct_option: "C",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 25,
    question_text: "Which scheme provides health coverage up to ₹5 lakh per year for senior citizens aged 70 and above?",
    option_a: "CGHS",
    option_b: "NPHCE",
    option_c: "RVJSY",
    option_d: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
    correct_option: "D",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 26,
    question_text: "Under PM-JAY, health coverage for senior citizens is provided:",
    option_a: "Based on income",
    option_b: "Only to BPL families",
    option_c: "Only in government hospitals",
    option_d: "Regardless of income",
    correct_option: "D",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 27,
    question_text: "Which scheme offers free or highly subsidized healthcare to retired Central Government employees?",
    option_a: "PM-JAY",
    option_b: "RVJSY",
    option_c: "Central Government Health Scheme",
    option_d: "NPHCE",
    correct_option: "C",
    category: "Health Services",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 28,
    question_text: "Elderline Helpline 14567 provides information related to:",
    option_a: "Employment opportunities",
    option_b: "Housing loans",
    option_c: "Old Age Homes for senior citizens",
    option_d: "Travel facilities",
    correct_option: "C",
    category: "Elder Care",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 29,
    question_text: "Which of the following services are available at Old Age Homes supported through Elderline information?",
    option_a: "Medical care only",
    option_b: "Counseling only",
    option_c: "Recreation only",
    option_d: "Medical care, counseling, recreation, and rehabilitation",
    correct_option: "D",
    category: "Elder Care",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 30,
    question_text: "The services informed through Elderline are mainly designed to promote:",
    option_a: "Financial profit",
    option_b: "Employment",
    option_c: "Independence and quality of life",
    option_d: "Competition",
    correct_option: "C",
    category: "Elder Care",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 31,
    question_text: "Assisted living devices are provided to senior citizens belonging to which category?",
    option_a: "All senior citizens",
    option_b: "Only government employees",
    option_c: "BPL category with monthly income not more than ₹15,000",
    option_d: "Private insurance holders",
    correct_option: "C",
    category: "Assisted Living",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 32,
    question_text: "Which of the following is an assisted living device provided to senior citizens?",
    option_a: "Smart phones",
    option_b: "Laptops",
    option_c: "Walking sticks and wheelchairs",
    option_d: "Fitness bands",
    correct_option: "C",
    category: "Assisted Living",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 33,
    question_text: "Who is the sole implementing agency for distribution of assisted living devices under RVY?",
    option_a: "Ministry of Health",
    option_b: "District Hospital",
    option_c: "Artificial Limbs Manufacturing Corporation (ALIMCO)",
    option_d: "NGOs",
    correct_option: "C",
    category: "Assisted Living",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 34,
    question_text: "Assisted living devices under RVY are distributed through:",
    option_a: "Online delivery",
    option_b: "Hospitals only",
    option_c: "Home visits",
    option_d: "Camp mode distribution",
    correct_option: "D",
    category: "Assisted Living",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 35,
    question_text: "Good nutrition for older adults mainly focuses on:",
    option_a: "High-calorie foods",
    option_b: "Fast food intake",
    option_c: "Nutrient-dense foods with lower calories",
    option_d: "Sugary foods",
    correct_option: "C",
    category: "Nutrition",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 36,
    question_text: "Which nutrients are especially important for senior citizens?",
    option_a: "Sugar and salt",
    option_b: "Fat only",
    option_c: "Protein, fiber, Vitamin B12, and Vitamin D",
    option_d: "Caffeine",
    correct_option: "C",
    category: "Nutrition",
    module: "module2-co",
    role: "CO"
  },
  {
    id: 37,
    question_text: "One key nutritional guide for seniors is to:",
    option_a: "Skip meals",
    option_b: "Reduce water intake",
    option_c: "Stay hydrated throughout the day",
    option_d: "Eat only fruits",
    correct_option: "C",
    category: "Nutrition",
    module: "module2-co",
    role: "CO"
  },
  // Module 3 - CO: Legal Rights & Support Services
  {
    id: 38,
    question_text: "If information is available with the Call Officer, what should be done?",
    option_a: "Raise service request to FRO",
    option_b: "Ask senior to call back later",
    option_c: "Share information over SMS immediately",
    option_d: "Close the call without response",
    correct_option: "C",
    category: "Timeliness",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 39,
    question_text: "If information is NOT available with the Call Officer, what is the first action?",
    option_a: "Close the call",
    option_b: "Escalate to police",
    option_c: "Raise a Service Request to FRO immediately",
    option_d: "Ask the senior to visit an office",
    correct_option: "C",
    category: "Timeliness",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 40,
    question_text: "Within how many hours should the FRO find out information and call the elder person?",
    option_a: "1 hour",
    option_b: "2 hours",
    option_c: "4 hours",
    option_d: "24 hours",
    correct_option: "C",
    category: "Timeliness",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 41,
    question_text: "What does the 'Right to Maintenance' for senior citizens include?",
    option_a: "Only financial support",
    option_b: "Food, clothing, residence, and medical care",
    option_c: "Only medical care",
    option_d: "Only housing",
    correct_option: "B",
    category: "Legal Rights",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 42,
    question_text: "From whom can senior citizens legally claim maintenance?",
    option_a: "Government only",
    option_b: "Neighbours",
    option_c: "Children or relatives",
    option_d: "Social organizations",
    correct_option: "C",
    category: "Legal Rights",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 43,
    question_text: "What is meant by 'Elder Abuse' under the Act?",
    option_a: "Only physical harm",
    option_b: "Only financial exploitation",
    option_c: "Physical, mental, or financial abuse and neglect",
    option_d: "Only verbal arguments",
    correct_option: "C",
    category: "Legal Rights",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 44,
    question_text: "The Maintenance Tribunal primarily helps senior citizens to:",
    option_a: "Resolve property disputes only",
    option_b: "Claim pension benefits",
    option_c: "Seek maintenance and protection of rights",
    option_d: "Apply for senior citizen cards",
    correct_option: "C",
    category: "Legal Rights",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 45,
    question_text: "What benefit does PMVVY provide to senior citizens?",
    option_a: "One-time lump sum amount",
    option_b: "Health insurance coverage",
    option_c: "Pension with assured return",
    option_d: "Free medical treatment",
    correct_option: "C",
    category: "Pension Schemes",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 46,
    question_text: "Indira Gandhi National Old Age Pension Scheme (IGNOAPS) is meant for:",
    option_a: "All senior citizens",
    option_b: "Government employees only",
    option_c: "BPL senior citizens",
    option_d: "Retired pensioners",
    correct_option: "C",
    category: "Pension Schemes",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 47,
    question_text: "Under IGNOAPS, how much pension is given to beneficiaries aged 60–79 years?",
    option_a: "₹100 per month",
    option_b: "₹200 per month",
    option_c: "₹300 per month",
    option_d: "₹500 per month",
    correct_option: "B",
    category: "Pension Schemes",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 48,
    question_text: "Pradhan Mantri Suraksha Bima Yojana (PMSBY) mainly covers:",
    option_a: "Natural death",
    option_b: "Accidental death and disability",
    option_c: "Hospitalization expenses",
    option_d: "Old age pension",
    correct_option: "B",
    category: "Pension Schemes",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 56,
    question_text: "Which of the following is a key emotional support service offered by Elderline 14567?",
    option_a: "Financial loans",
    option_b: "Anxiety resolution",
    option_c: "Property registration",
    option_d: "Employment placement",
    correct_option: "B",
    category: "Emotional Support",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 57,
    question_text: "When a senior citizen feels lonely and calls Elderline, what is the primary role of the call officer?",
    option_a: "End the call quickly",
    option_b: "Give legal advice immediately",
    option_c: "Listen patiently and provide emotional reassurance",
    option_d: "Transfer the call without listening",
    correct_option: "C",
    category: "Emotional Support",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 58,
    question_text: "Which emotion-related concern is commonly addressed through Elderline's emotional support?",
    option_a: "Loneliness",
    option_b: "Job stress",
    option_c: "School anxiety",
    option_d: "Exam fear",
    correct_option: "A",
    category: "Emotional Support",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 59,
    question_text: "Which skill is MOST important for providing emotional support on Elderline calls?",
    option_a: "Fast typing",
    option_b: "Active listening",
    option_c: "Legal drafting",
    option_d: "Data analysis",
    correct_option: "B",
    category: "Emotional Support",
    module: "module3-co",
    role: "CO"
  },
  {
    id: 60,
    question_text: "Emotional support calls under Elderline are:",
    option_a: "Time-bound and rushed",
    option_b: "Focused only on complaints",
    option_c: "Non-judgmental and supportive",
    option_d: "Meant only for emergencies",
    correct_option: "C",
    category: "Emotional Support",
    module: "module3-co",
    role: "CO"
  },
  // Module 1 - FRO: Field Response & Intervention
  {
    id: 49,
    question_text: "Which of the following issues requires immediate field intervention by Elderline?",
    option_a: "General enquiry about pension schemes",
    option_b: "Complaint of physical abuse by a caregiver",
    option_c: "Request for brochure information",
    option_d: "Bank interest rate enquiry",
    correct_option: "B",
    category: "Field Intervention",
    module: "module1-fro",
    role: "FRO"
  },
  {
    id: 50,
    question_text: "Physical abuse of senior citizens includes which of the following?",
    option_a: "Ignoring phone calls",
    option_b: "Verbal arguments only",
    option_c: "Hitting, pushing, or causing bodily harm",
    option_d: "Delayed service delivery",
    correct_option: "C",
    category: "Field Intervention",
    module: "module1-fro",
    role: "FRO"
  },
  {
    id: 51,
    question_text: "Who conducts on-ground verification and intervention in Elderline cases?",
    option_a: "Call centre agent only",
    option_b: "Police only",
    option_c: "Field Response Officer (FRO)",
    option_d: "Bank official",
    correct_option: "C",
    category: "Field Intervention",
    module: "module1-fro",
    role: "FRO"
  },
  {
    id: 52,
    question_text: "Within what time should an FRO ideally contact the senior citizen after case assignment?",
    option_a: "Within 24 hours",
    option_b: "Within 12 hours",
    option_c: "Within 1 hour",
    option_d: "Within 7 days",
    correct_option: "C",
    category: "Field Intervention",
    module: "module1-fro",
    role: "FRO"
  },
  {
    id: 53,
    question_text: "What is the first responsibility of an Elderline agent when a distress call is received?",
    option_a: "Transfer the call immediately",
    option_b: "Stay calm, listen actively, and assess urgency",
    option_c: "Promise legal action",
    option_d: "End the call quickly",
    correct_option: "B",
    category: "Field Intervention",
    module: "module1-fro",
    role: "FRO"
  },
  {
    id: 54,
    question_text: "Elderline field intervention aims to ensure:",
    option_a: "Punishment only",
    option_b: "Safety, dignity, and well-being of senior citizens",
    option_c: "Family separation",
    option_d: "Media reporting",
    correct_option: "B",
    category: "Field Intervention",
    module: "module1-fro",
    role: "FRO"
  },
  {
    id: 55,
    question_text: "What helpline number should seniors call for Elderline support?",
    option_a: "112",
    option_b: "1091",
    option_c: "14567",
    option_d: "181",
    correct_option: "C",
    category: "Field Intervention",
    module: "module1-fro",
    role: "FRO"
  }
];

// Get all unique categories
export const getCategories = (): string[] => {
  const categories = [...new Set(questions.map(q => q.category))];
  return categories;
};

// Get questions by category
export const getQuestionsByCategory = (category: string): Question[] => {
  return questions.filter(q => q.category === category);
};

// Get questions by module
export const getQuestionsByModule = (moduleId: string): Question[] => {
  return questions.filter(q => q.module === moduleId);
};

// Get questions by role
export const getQuestionsByRole = (role: 'CO' | 'FRO'): Question[] => {
  return questions.filter(q => q.role === role || q.role === 'BOTH');
};

// Get random questions with balanced category distribution
export const getRandomQuestions = (count: number = 20): Question[] => {
  const categories = getCategories();
  const questionsPerCategory = Math.floor(count / categories.length);
  const remainder = count % categories.length;
  
  let selectedQuestions: Question[] = [];
  
  // Shuffle categories to randomize which ones get extra questions
  const shuffledCategories = [...categories].sort(() => Math.random() - 0.5);
  
  shuffledCategories.forEach((category, index) => {
    const categoryQuestions = getQuestionsByCategory(category);
    // Shuffle questions within each category
    const shuffledCategoryQuestions = [...categoryQuestions].sort(() => Math.random() - 0.5);
    
    // Determine how many questions to take from this category
    let questionsToTake = questionsPerCategory;
    if (index < remainder) {
      questionsToTake += 1; // Give extra question to first few categories
    }
    
    // Take the required number of questions from this category
    const selectedFromCategory = shuffledCategoryQuestions.slice(0, Math.min(questionsToTake, categoryQuestions.length));
    selectedQuestions = [...selectedQuestions, ...selectedFromCategory];
  });
  
  // Final shuffle to randomize the order of questions across categories
  return selectedQuestions.sort(() => Math.random() - 0.5).slice(0, count);
};

// Get random questions from a specific module
export const getRandomQuestionsFromModule = (moduleId: string, count?: number): Question[] => {
  const moduleQuestions = getQuestionsByModule(moduleId);
  const shuffled = [...moduleQuestions].sort(() => Math.random() - 0.5);
  return count ? shuffled.slice(0, Math.min(count, moduleQuestions.length)) : shuffled;
};

// Alternative: Get completely random questions (original behavior)
export const getCompletelyRandomQuestions = (count: number = 20): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
};

// Get random questions from specific categories
export const getRandomQuestionsFromCategories = (categories: string[], count: number = 20): Question[] => {
  const filteredQuestions = questions.filter(q => categories.includes(q.category));
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, filteredQuestions.length));
};

export const calculateScore = (answers: Record<number, string>, questionSet: Question[]): TestResult => {
  let correct = 0;
  let incorrect = 0;
  const correctAnswers: Record<number, string> = {};
  
  questionSet.forEach((q) => {
    correctAnswers[q.id] = q.correct_option;
    if (answers[q.id]) {
      if (answers[q.id] === q.correct_option) {
        correct++;
      } else {
        incorrect++;
      }
    }
  });
  
  // Negative marking: -1 for each incorrect answer
  const rawScore = correct - incorrect;
  const score = Math.max(0, rawScore);
  
  const percentage = Math.round((score / questionSet.length) * 100);
  return {
    score,
    total: questionSet.length,
    percentage,
    qualified: percentage >= 60,
    answers,
    correctAnswers
  };
};

// Utility function to analyze category distribution in a question set
export const getCategoryDistribution = (questionSet: Question[]): Record<string, number> => {
  const distribution: Record<string, number> = {};
  questionSet.forEach(q => {
    distribution[q.category] = (distribution[q.category] || 0) + 1;
  });
  return distribution;
};