export const Webdata = {
  processes: {
/* ===================== AADHAAR ===================== */
    aadhar: {
      name: "Aadhaar",
      description:
        "India’s biometric-based unique digital identity issued by UIDAI.",
      locations: ["New Delhi", "Mumbai", "Hyderabad", "Bangalore", "Kolkata"],
      features: [
        "Biometric Identity",
        "Online Authentication",
        "Digital KYC",
        "Secure Verification"
      ],
      stats: ["130+ Crore Issued"],
      headings: {
        hero_title: "Aadhaar – Unique Identification",
        hero_subtitle:
          "A trusted digital identity for every resident of India.",
        footer_text:
          "UIDAI | Unique Identification Authority of India"
      },
      style: {
        primary_color: "#E27D60", // Pastel Terracotta
        secondary_color: "#85DCB0", // Pastel Mint
        accent_color: "#fef2f2"
      },
      images: {
        logo:
          "/Adhar/Adhar-logo.png",
        hero_bg:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0",
        banner:
          "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
        extra1: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        extra2: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
      },
      links: {
        website: "https://uidai.gov.in/",
        twitter: "https://twitter.com/UIDAI",
        facebook: "https://www.facebook.com/AadhaarOfficial/"
      },

      about: {
        overview:
          "Aadhaar provides a unique identity number backed by biometric data.",
        mission:
          "To empower residents with a portable digital identity.",
        vision:
          "Inclusive and secure identity ecosystem.",
        objectives: [
          "Prevent identity fraud",
          "Enable digital governance",
          "Support welfare delivery"
        ]
      },

      projects: [
        {
          title: "Aadhaar Enrollment",
          description:
            "Nationwide biometric enrollment drive.",
          impact: "Universal digital identity",
          status: "Ongoing"
        },
        {
          title: "Aadhaar Authentication",
          description:
            "Online verification services for public & private use.",
          impact: "Secure service delivery",
          status: "Active"
        }
      ],

      contactPage: {
        offices: [
          { name: "UIDAI Regional Office", location: "Hyderabad" },
          { name: "UIDAI Regional Office", location: "Noida" }
        ],
        support: {
          helpline: "1947",
          email: "help@uidai.gov.in"
        },
        working_hours: "9:30 AM – 6:00 PM"
      }
    },
    

    /* ===================== BSNL ===================== */
    bsnl: {
      name: "BSNL",
      description:
        "Government of India enterprise delivering telecom and broadband services.",
      locations: ["Pan India", "New Delhi", "Mumbai", "Chennai", "Kolkata"],
      features: [
        "Fiber Broadband",
        "Mobile Services",
        "Enterprise Connectivity",
        "Landline Services"
      ],
      // stats: ["700k+ Villages", "Govt Enterprise"],
      headings: {
        // hero_title: "BSNL - Connecting India",
        // hero_subtitle: "Reliable telecom services for every citizen.",
        footer_text: "BSNL | Government of India"
      },
      style: {
        primary_color: "#41B3A3", // Pastel Teal
        secondary_color: "#E8A87C", // Pastel Peach
        accent_color: "#eff6ff"
      },
      images: {
        logo: "/Bsnl/bsnl-logo.png",
        
      
        image1: "/Bsnl/banner1.png",
      image2: "/Bsnl/banner3.png",       
      },
      links: {
        website: "https://www.bsnl.co.in/",
        facebook: "https://www.facebook.com/bsnlcorporate/",
        twitter: "https://twitter.com/BSNLCorporate"
      },
      about: {
        overview:
          "BSNL is a state-owned telecommunications company providing pan-India connectivity.",
        mission: "Affordable and reliable communication services.",
        vision: "Digital inclusion for every Indian.",
        objectives: [
          "Expand rural telecom",
          "Strengthen fiber infrastructure",
          "Support Digital India"
        ]
      },

      projects: [
        {
          title: "Bharat Fiber",
          description: "High-speed FTTH broadband project.",
          impact: "Lakhs of homes connected",
          status: "Active"
        },
        {
          title: "4G Expansion",
          description: "Nationwide 4G rollout.",
          impact: "Improved mobile coverage",
          status: "Ongoing"
        }
      ],

      contactPage: {
        offices: [
          { name: "BSNL SSA Office", location: "Zahirabad" },
          { name: "BSNL SSA Office", location: "Mehabubnagar" }
        ],
        support: {
          helpline: "1500",
          email: "care@bsnl.co.in"
        },
        working_hours: "9:30 AM – 6:00 PM"
      }
    },

    /* ===================== BSNL KYC ===================== */
    bsnlKyc: {
      name: "BSNL KYC",
      description:
        "Digital Aadhaar-based verification for BSNL connections.",
      locations: ["New Delhi", "Mumbai", "Bangalore", "Hyderabad"],
      features: [
        "Aadhaar KYC",
        "Paperless Verification",
        "Instant Activation"
      ],
      stats: ["100% Secure", "Instant Approval"],
      headings: {
        hero_title: "BSNL Digital KYC",
        hero_subtitle: "Fast and secure BSNL verification.",
        footer_text: "Official BSNL KYC Portal"
      },
      style: {
        primary_color: "#C38D9E", // Pastel Mauve
        secondary_color: "#E27D60", // Pastel Terracotta
        accent_color: "#f0f9ff"
      },
      images: {
        logo: "/Bsnl/bsnl-logo.png",
        
        banner1: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
        banner2: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74"
      },
      links: {
        website: "https://portal2.bsnl.in/myportal/",
        facebook: "https://www.facebook.com/bsnlcorporate/",
        twitter: "https://twitter.com/BSNLCorporate"
      },

      about: {
        overview:
          "BSNL KYC enables paperless identity verification for telecom services.",
        mission: "Secure and instant customer onboarding.",
        vision: "Zero-paper telecom activation.",
        objectives: [
          "Reduce fraud",
          "Speed up activation",
          "Ensure compliance"
        ]
      },

      projects: [
        {
          title: "Digital KYC Platform",
          description: "Aadhaar-based identity verification.",
          impact: "Faster SIM activation",
          status: "Active"
        }
      ],

      contactPage: {
        offices: [{ name: "KYC Center", location: "Ashok Nagar" }],
        support: {
          email: "kyc@bsnl.co.in"
        },
        working_hours: "10:00 AM – 5:30 PM"
      }
    },
     /* ===================== CM CONNECT ===================== */
    cmConnect: {
      name: "CM Connect (Meghalaya)",
      description:
        "A citizen grievance redressal and feedback platform of the Meghalaya Government.",
      locations: ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar"],
      features: [
        "Citizen Grievances",
        "CM Helpline 181",
        "Department Tracking",
        "Public Feedback"
      ],
      stats: ["181 Helpline", "Statewide Coverage"],
      headings: {
        hero_title: "CM Connect Meghalaya",
        hero_subtitle:
          "Bridging citizens and governance through digital engagement.",
        footer_text: "Government of Meghalaya Initiative"
      },
      style: {
        primary_color: "#E8A87C", // Pastel Peach
        secondary_color: "#41B3A3", // Pastel Teal
        accent_color: "#fff7ed"
      },
      images: {
        logo:
          "/MPConnect/logo.jfif",
        hero_bg:
          "https://images.unsplash.com/photo-1562774053-701939374585",
        banner:
          "https://images.unsplash.com/photo-1600334129128-685c5582fd35",
        extra1: "https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6",
        extra2: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85"
      },
      links: {
        website: "https://cmhelpline.mp.gov.in/",
        twitter: "https://twitter.com/cmhelpline181",
        facebook: "https://www.facebook.com/CMHelplineMP/"
      },

      about: {
        overview:
          "CM Connect is a unified platform enabling citizens to directly raise issues with the state administration.",
        mission:
          "Responsive, accountable, and transparent governance.",
        vision:
          "Citizen-centric administration in Meghalaya.",
        objectives: [
          "Direct grievance redressal",
          "Department accountability",
          "Public service improvement"
        ]
      },

      projects: [
        {
          title: "CM Helpline 181",
          description:
            "Statewide toll-free grievance helpline.",
          impact: "Lakhs of grievances resolved",
          status: "Active"
        },
        {
          title: "Digital Feedback System",
          description:
            "Real-time citizen feedback collection.",
          impact: "Improved service quality",
          status: "Ongoing"
        }
      ],

      contactPage: {
        offices: [
          { name: "State Control Room", location: "Bhopal" }
        ],
        support: {
          helpline: "181",
          email: "cmhelpline@mp.gov.in"
        },
        working_hours: "24x7 (Helpline)"
      }
    },
/* ===================== ELDERLINE ===================== */
    elderLine: {
      name: "ElderLine",
      description:
        "A national helpline dedicated to serving senior citizens, providing technical, financial, legal guidance, and emotional support.",
      locations: ["North India", "South India", "East India", "West India", "Central India"],
      features: [
        "Grievance Redressal",
        "Information Support",
        "Emotional Care",
        "Field Intervention"
      ],
      stats: ["Toll Free: 14567", "8 AM - 8 PM", "7 Days a Week"],
      headings: {
        hero_title: "ElderLine - National Helpline for Senior Citizens",
        hero_subtitle:
          "Empowering the elderly with dignity through compassionate support.",
        footer_text:
          "Toll Free Number: 14567 | Ministry of Social Justice & Empowerment"
      },
      style: {
        primary_color: "#85DCB0", // Pastel Mint
        secondary_color: "#41B3A3", // Pastel Teal
        accent_color: "#f0fdf4"
      },
      images: {
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
        hero_bg:
          "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4",
        banner:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        extra1: "https://images.unsplash.com/photo-1571053748382-141b7de59b88",
        extra2: "https://images.unsplash.com/photo-1573497620053-ea5310f94a17"
      },
      links: {
        website: "https://elder-person.vercel.app/",
        facebook: "https://www.facebook.com/elderlineindia/",
        twitter: "https://twitter.com/elderlineindia",
        instagram: "https://www.instagram.com/elderlineindia/"
      },

      about: {
        overview:
          "ElderLine is India’s first national helpline exclusively for senior citizens.",
        mission:
          "To ensure safety, dignity, and well-being of senior citizens.",
        vision:
          "A society where every senior citizen lives with respect and independence.",
        objectives: [
          "Single-point elderly assistance",
          "Fast grievance redressal",
          "Psychological & emotional care",
          "District-level coordination"
        ]
      },

      projects: [
        {
          title: "Elder Helpline 14567",
          description:
            "24x7 toll-free support for elderly citizens across India.",
          impact: "Millions assisted nationwide",
          status: "Active"
        },
        {
          title: "District Intervention Program",
          description:
            "Field-level grievance resolution with district authorities.",
          impact: "Improved response time",
          status: "Ongoing"
        }
      ],

      contactPage: {
        offices: [
          { name: "National Control Room", location: "New Delhi", phone: "14567" }
        ],
        support: {
          helpline: "14567",
          email: "elderline@gov.in"
        },
        working_hours: "8:00 AM – 8:00 PM (All Days)"
      }
    },
    
    /* ===================== GST ===================== */
    gst: {
      name: "GST",
      description:
        "Unified indirect tax system of India.",
      locations: ["New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"],
      features: [
        "Digital Tax Filing",
        "Unified Taxation",
        "Transparent Compliance"
      ],
      stats: ["1.5Cr+ Taxpayers"],
      headings: {
        hero_title: "GST - One Nation One Tax",
        hero_subtitle: "Simplifying tax compliance.",
        footer_text: "GST Network | Government of India"
      },
      style: {
        primary_color: "#C38D9E", // Pastel Mauve
        secondary_color: "#E27D60", // Pastel Terracotta
        accent_color: "#f5f3ff"
      },
      images: {
        logo: "/GST/GST-logo.png",
        hero_bg:
          "https://images.unsplash.com/photo-1554224154-22dec7ec8818",
        banner:
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
        extra1: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
        extra2: "https://images.unsplash.com/photo-1586486855514-8c633cc6fd38"
      },
      links: {
        website: "https://www.gst.gov.in/",
        twitter: "https://twitter.com/Infosys_GSTN",
        facebook: "https://www.facebook.com/gstsystemsindia/"
      },

      about: {
        overview:
          "GST replaced multiple indirect taxes with a single tax system.",
        mission: "Simplified taxation.",
        vision: "Transparent digital economy.",
        objectives: [
          "Ease of doing business",
          "Uniform taxation",
          "Digital governance"
        ]
      },

      projects: [
        {
          title: "GST Portal",
          description: "Online tax registration & filing system.",
          impact: "Nationwide digital compliance",
          status: "Active"
        }
      ],

      contactPage: {
        offices: [{ name: "GST Seva Kendra", location: "Noida" }],
        support: {
          email: "helpdesk@gst.gov.in"
        },
        working_hours: "9:00 AM – 6:00 PM"
      }
    },

    /* ===================== GSTAT ===================== */
    gstat: {
      name: "GSTAT",
      description:
        "The Goods and Services Tax Appellate Tribunal adjudicates disputes arising under the GST law.",
      locations: ["New Delhi", "Noida", "Mumbai", "Bangalore", "Chennai"],
      features: [
        "Tax Appeals",
        "Digital Hearings",
        "Judicial Review",
        "Transparent Justice"
      ],
      stats: ["31 State Benches", "Statutory Body"],
      headings: {
        hero_title: "GST Appellate Tribunal (GSTAT)",
        hero_subtitle:
          "Ensuring justice, transparency, and fairness in GST dispute resolution.",
        footer_text: "GST Appellate Tribunal | Government of India"
      },
      style: {
        primary_color: "#41B3A3", // Pastel Teal
        secondary_color: "#C38D9E", // Pastel Mauve
        accent_color: "#f8fafc"
      },
      images: {
        logo: "/GSTAT/Gstat-logo.png",
        hero_bg:
          "https://images.unsplash.com/photo-1521791055366-0d553872125f",
        banner:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        extra1: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
        extra2: "https://images.unsplash.com/photo-1505664194779-8beaceb93744"
      },
      links: {
        website: "https://gstat.gov.in/"
      },

      about: {
        overview:
          "GSTAT is a statutory tribunal constituted under the GST Act to hear appeals against orders passed by GST authorities.",
        mission:
          "To deliver timely, impartial, and effective justice in indirect tax matters.",
        vision:
          "A transparent and efficient appellate tax judiciary.",
        objectives: [
          "Speedy disposal of GST disputes",
          "Uniform interpretation of GST law",
          "Digital case management"
        ]
      },

      projects: [
        {
          title: "National GST Appellate Framework",
          description:
            "Establishment of state and principal benches across India.",
          impact: "Faster resolution of GST disputes",
          status: "Operational"
        },
        {
          title: "e-Tribunal Platform",
          description:
            "Online filing and digital hearing system.",
          impact: "Reduced case pendency",
          status: "Active"
        }
      ],

      contactPage: {
        offices: [
          { name: "Principal Bench", location: "New Delhi" },
          { name: "State Bench", location: "Noida" }
        ],
        support: {
          email: "gstat@gov.in"
        },
        working_hours: "10:00 AM – 5:30 PM (Working Days)"
      }
    },
    
    /* ===================== MoH ===================== */
    moh: {
      name: "MoH",
      description:
        "Ministry of Health and Family Welfare governs healthcare policy and delivery in India.",
      locations: ["New Delhi", "Noida", "Mumbai", "Hyderabad", "Pune"],
      features: [
        "Public Health Policy",
        "Medical Education",
        "National Health Programs"
      ],
      stats: ["National Authority"],
      headings: {
        hero_title: "Ministry of Health & Family Welfare",
        hero_subtitle:
          "Strengthening India’s healthcare ecosystem.",
        footer_text:
          "MoHFW | Government of India"
      },
      style: {
        primary_color: "#85DCB0", // Pastel Mint
        secondary_color: "#E8A87C", // Pastel Peach
        accent_color: "#ecfdf5"
      },
      images: {
        logo:
          "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
        hero_bg:
          "https://images.unsplash.com/photo-1580281658629-44c0a1f8a8b1",
        banner:
          "https://images.unsplash.com/photo-1579154204601-01588f351e67",
        extra1: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7",
        extra2: "https://images.unsplash.com/photo-1505751172107-573225a9139c"
      },
      links: {
        website: "https://main.mohfw.gov.in/",
        twitter: "https://twitter.com/MoHFW_INDIA",
        facebook: "https://www.facebook.com/MoHFWIndia/"
      },

      about: {
        overview:
          "MoHFW formulates health policies and oversees healthcare programs.",
        mission:
          "Accessible, affordable, and quality healthcare for all.",
        vision:
          "Healthy India, productive nation.",
        objectives: [
          "Universal health coverage",
          "Disease prevention",
          "Healthcare infrastructure growth"
        ]
      },

      projects: [
        {
          title: "Ayushman Bharat",
          description:
            "World’s largest health insurance scheme.",
          impact: "Healthcare for millions",
          status: "Active"
        },
        {
          title: "National Health Mission",
          description:
            "Strengthening public healthcare delivery.",
          impact: "Improved maternal & child health",
          status: "Ongoing"
        }
      ],

      contactPage: {
        offices: [
          { name: "MoHFW Headquarters", location: "New Delhi" }
        ],
        support: {
          email: "contact-mohfw@gov.in"
        },
        working_hours: "9:00 AM – 5:30 PM"
      }
    },
    /* ===================== RECL ===================== */
    recl: {
      name: "RECL",
      description:
        "Maharatna CPSE financing power and infrastructure projects.",
      locations: ["New Delhi", "Noida", "Ajmer", "Hyderabad", "Bangalore"],
      features: [
        "Power Financing",
        "Renewable Energy",
        "Infrastructure Loans"
      ],
      stats: ["Maharatna", "50+ Years"],
      headings: {
        hero_title: "RECL - Powering India",
        hero_subtitle: "Sustainable energy financing.",
        footer_text: "REC Limited | Ministry of Power"
      },
      style: {
        primary_color: "#41B3A3", // Pastel Teal
        secondary_color: "#85DCB0", // Pastel Mint
        accent_color: "#eff6ff"
      },
      images: {
        logo: "/RECL/RECL-logo.png",
        hero_bg: "/RECL/banner.jpeg",
        banner: "/RECL/banner.jpeg",
        extra1: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
        extra2: "https://images.unsplash.com/photo-1466611653911-954ffea132e8"
      },
      links: {
        website: "https://www.recindia.nic.in/",
        twitter: "https://twitter.com/RECLimited",
        facebook: "https://www.facebook.com/reclimited/"
      },

      about: {
        overview:
          "REC Limited finances power infrastructure across India.",
        mission: "Reliable power for every Indian.",
        vision: "Sustainable energy future.",
        objectives: [
          "Renewable financing",
          "Rural electrification",
          "Grid modernization"
        ]
      },

      projects: [
        {
          title: "Rural Electrification",
          description: "Village-level power infrastructure funding.",
          impact: "Thousands of villages electrified",
          status: "Completed"
        }
      ],

      contactPage: {
        offices: [{ name: "Corporate Office", location: "Gurugram" }],
        support: {
          email: "contactus@recindia.com"
        },
        working_hours: "9:00 AM – 5:30 PM"
      }
    },


   

    


    /* ===================== VISION PLUS ===================== */
    visionPlus: {
      name: "Vision Plus",
      description:
        "Leading digital transformation partner providing cutting-edge IT solutions, cloud services, and enterprise software for government and private sectors.",
      locations: ["Ahmedabad", "Gandhinagar", "Mumbai", "New Delhi", "Dubai"],
      features: [
        "Cloud Native Development",
        "AI & Machine Learning",
        "Cyber Security Excellence",
        "Big Data Analytics",
        "Enterprise Resource Planning",
        "DevOps & Automation"
      ],
      services: [
        {
          title: "Custom Software Development",
          description: "Tailored enterprise solutions built with modern tech stacks like React, Node.js, and Python.",
          icon: "Code"
        },
        {
          title: "Cloud & Infrastructure",
          description: "Seamless cloud migration, architecture design, and 24/7 managed infrastructure services.",
          icon: "Cloud"
        },
        {
          title: "AI & Data Science",
          description: "Transforming raw data into actionable insights using advanced ML models and analytics.",
          icon: "Brain"
        },
        {
          title: "Cyber Security",
          description: "Protecting your digital assets with robust security audits, encryption, and threat monitoring.",
          icon: "Shield"
        }
      ],
      stats: [
        "15+ Years Experience",
        "500+ Projects Delivered",
        "200+ Expert Consultants",
        "Global Presence"
      ],
      testimonials: [
        {
          name: "Rajesh Kumar",
          role: "CTO, Digital India Initiative",
          content: "Vision Plus has been instrumental in our digital transformation journey. Their technical expertise is unmatched.",
          avatar: "https://i.pravatar.cc/150?u=rajesh"
        },
        {
          name: "Sarah Ahmed",
          role: "Director, Dubai Smart City",
          content: "The cloud infrastructure provided by Vision Plus is exceptionally stable and secure. A pleasure to work with.",
          avatar: "https://i.pravatar.cc/150?u=sarah"
        }
      ],
      headings: {
        hero_title: "Empowering Digital Future",
        hero_subtitle:
          "Vision Plus – Your Trusted Partner in Technology and Innovation.",
        footer_text: "Vision Plus © 2026 – Excellence in Digital Transformation"
      },
      style: {
        primary_color: "#C38D9E", // Pastel Mauve
        secondary_color: "#41B3A3", // Pastel Teal
        accent_color: "#eff6ff"
      },
      images: {
        
        logo:"/logo/Vision2.png",
        // hero_bg:
        //   "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
      },
      links: {
        website: "https://visionplusglobal.in/",
        linkedin: "https://linkedin.com/company/visionplus",
        twitter: "https://twitter.com/visionplus"
      },

      about: {
        overview:
          "Vision Plus is a premier IT consulting and software development company dedicated to helping organizations navigate the complexities of digital transformation. We specialize in building scalable, secure, and high-performance solutions.",
        mission:
          "To provide innovative technology solutions that drive business growth and social impact.",
        vision:
          "To be the global leader in delivering transformative digital experiences.",
        objectives: [
          "Accelerate digital adoption for government agencies",
          "Deliver secure and scalable enterprise software",
          "Foster a culture of continuous technological innovation",
          "Empower businesses with data-driven insights"
        ]
      },

      projects: [
        {
          title: "Aadhaar Digital Identity System",
          description: "Architecting the world's largest biometric-based unique identity system for 130+ crore residents.",
          impact: "99% coverage of adult population",
          status: "Active",
          image: "/Adhar/Adhar-logo.png",
          bgImage: "/Adhar/aadhar.png",
          link: "https://uidai.gov.in/"
        },
        {
          title: "Bharat Fiber (BSNL) FTTH",
          description: "Deploying high-speed fiber-to-the-home broadband infrastructure across pan-India rural and urban areas.",
          impact: "Millions of households connected",
          status: "Ongoing",
          image: "/Bsnl/bsnl-logo.png",
          bgImage: "/Bsnl/banner3.png",
          link: "https://www.bsnl.co.in/"
        },
        {
          title: "GST Unified Tax Portal",
          description: "Developing the central portal for Goods and Services Tax registration, filing, and compliance.",
          impact: "1.5 Cr+ taxpayers managed",
          status: "Active",
          image: "/GST/GST-logo.png",
          bgImage: "/GST/GST-logo.png",
          link: "https://www.gst.gov.in/"
        },
        {
          title: "ElderLine National Helpline",
          description: "Implementing the 14567 toll-free helpline for senior citizens' welfare and grievance redressal.",
          impact: "Nationwide support for elderly",
          status: "Active",
          image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
          bgImage: "/elderline/elder-helpline.jpg",
          link: "https://elder-person.vercel.app/"
        },
        {
          title: "CM Connect (Meghalaya)",
          description: "Unified citizen grievance redressal platform with real-time department tracking.",
          impact: "Enhanced governance transparency",
          status: "Active",
          image: "/MPConnect/logo.jfif",
          bgImage: "/MPConnect/image1.png",
          link: "https://cmhelpline.mp.gov.in/"
        },
        {
          title: "MOH Portal",
          description: "Empowering ASHA workers and frontline health staff with digital tools for community health monitoring and service delivery.",
          impact: "Enhanced rural healthcare delivery",
          status: "Active",
          image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
          bgImage: "/Moh/image1.png",
          link: "https://main.mohfw.gov.in/"
        },
        {
          title: "GSTAT e-Tribunal Platform",
          description: "Digital case management and online hearing system for the GST Appellate Tribunal.",
          impact: "Reduced judicial pendency",
          status: "Active",
          image: "/GSTAT/Gstat-logo.png",
          bgImage: "/GSTAT/image.png",
          link: "https://gstat.gov.in/"
        },
        {
          title: "RECL Power Infrastructure Financing",
          description: "Strategic consulting for rural electrification and renewable energy project financing.",
          impact: "100% village electrification support",
          status: "Completed",
          image: "/RECL/RECL-logo.png",
          bgImage: "/RECL/RECL-logo.png",
          link: "https://www.recindia.nic.in/"
        },
        {
          title: "BSNL Digital KYC",
          description: "Paperless Aadhaar-based instant verification system for telecom customer onboarding.",
          impact: "Zero-paper activation process",
          status: "Active",
          image: "/Bsnl/bsnl-logo.png",
          bgImage:"/Bsnl/bsnl-logo.png",
          link: "https://portal2.bsnl.in/myportal/"
        }
      ],

      contactPage: {
        offices: [
          { name: "Corporate Headquarters", location: "Ahmedabad, Gujarat", address: "123 Tech Park, SG Highway" },
          { name: "Regional Office", location: "Mumbai, Maharashtra", address: "BKC, G Block, Mumbai" },
          { name: "International Hub", location: "Dubai, UAE", address: "Internet City, Phase 2" }
        ],
        support: {
          email: "solutions@visionplus.in",
          helpline: "+91 79 1234 5678"
        },
        social_links: [
          { platform: "LinkedIn", url: "https://linkedin.com/company/visionplus" },
          { platform: "Twitter", url: "https://twitter.com/visionplus" },
          { platform: "GitHub", url: "https://github.com/visionplus" }
        ],
        working_hours: "9:00 AM – 7:00 PM (Mon-Sat)"
      }
    }
  },

  common: {
    default_images: {
      placeholder:
        "https://www.svgrepo.com/show/508699/placeholder.svg",
      emblem:
        "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
      digital_india:
        "https://upload.wikimedia.org/wikipedia/commons/9/9e/Digital_India_logo.svg"
    },
    contact: {
      helpline: "14567",
      email: "support@portal.gov.in"
    }
  }
};
