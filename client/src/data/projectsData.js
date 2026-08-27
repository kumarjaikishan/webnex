export const projectsData = [
  {
    id: "proj-riseown",
    slug: "riseown",
    title: "RISEOWN — Custom Enterprise Retail & Real Estate ERP",
    tagline: "Bespoke Client ERP • Multi-Tier Sponsor Commission Engine • Plot Inventory & POS",
    category: "ERP & Systems",
    projectType: "commercial_client", // "commercial_client" | "proprietary_saas"
    clientName: "RISEOWN Marketing Pvt. Ltd",
    clientIndustry: "Real Estate & Multi-Tier Retail Management",
    role: "Lead Full-Stack Architect & System Engineer",
    deliveryTimeline: "3 Months (End-to-End Delivery & Handover)",
    handoverStatus: "100% Delivered & Live in Production Operations",
    badge: "Custom Client ERP (100% Handover Complete)",
    featured: true,
    coverColor: "#0284C7",
    liveUrl: "", // Proprietary Enterprise deployment
    demoNote: "Bespoke enterprise ERP delivered for private client operations across branches and retail counters",
    seo: {
      title: "Riseown Custom ERP Case Study | Real Estate & Retail POS System",
      description: "How Webnex Labs architected and delivered a bespoke enterprise ERP with real-time WebSockets barcode scanner, multi-tier sponsor commission engine, and automated legal contracts.",
      keywords: "Enterprise ERP Case Study, Custom Retail POS, Real Estate Plot Management System, WebSockets Barcode Scanner, Multi-tier Commission Engine, React Node.js MongoDB ERP"
    },
    keyMetrics: [
      { label: "Commission Error Rate", value: "0.00%", sub: "100% Automated" },
      { label: "Scanner Sync Latency", value: "<50ms", sub: "WebSockets Pairing" },
      { label: "Billing Cycle Speed", value: "4.5x", sub: "Faster POS Checkout" },
      { label: "System Uptime", value: "99.9%", sub: "Production Operations" }
    ],
    tags: [
      "Real Estate Plot Booking",
      "Retail POS & Billing",
      "Multi-Tier Sponsor Commissions",
      "Socket.IO Wireless Scanner",
      "Automated Bilingual Legal Invoices",
      "Enterprise RBAC / ABAC Security"
    ],
    problem: "RISEOWN was facing severe administrative bottlenecks. Counter staff, regional offices, and hundreds of distributor agents were tracking property plot bookings, installment ledgers, coupon distributions, and multi-tier percentage commissions manually across paper registers and disjointed spreadsheets.",
    solution: "We engineered and delivered a bespoke, production-ready enterprise ERP. The system centralizes real-time plot bookings, dynamic installment payment cards, low-latency mobile camera barcode scanning over WebSockets, recursive sponsor payout distribution ledgers, and automated bilingual Hindi/English legal contract generation.",
    businessImpact: "Successfully transitioned the entire company to a unified digital architecture. Digitized hundreds of property plot records, accelerated counter checkout cycles by 80%, and completely eliminated payout disputes with transparent, immutable sponsor commission ledgers.",
    technology: [
      "React.js 19",
      "Node.js",
      "Express.js",
      "MongoDB & Mongoose",
      "Socket.IO",
      "TailwindCSS",
      "Redux Toolkit",
      "jsPDF & AutoTable",
      "Web Audio API"
    ],
    caseStudy: {
      clientObjective: "RISEOWN approached Webnex Labs to architect a high-security, custom enterprise platform tailored precisely to their internal workflow. They required seamless point-of-sale billing for daily retail counters, instant synchronization with mobile phone cameras as hardware scanners, property plot reservation ledgers with milestone installments, and a multi-level distributor commission ledger that updates in real time with zero calculation error.",
      deliverables: [
        "Real-Time Retail Billing Point-of-Sale (POS) with coupon schemes and cash drawer closing reconciliation",
        "Zero-Hardware Mobile Barcode/QR Scanner connecting any smartphone camera directly to desktop POS counters via Socket.IO",
        "Complete Real Estate Plot Booking & Management module (plot inventory master, installment schedules, collection vouchers, multilingual legal agreements in Hindi & English)",
        "Automated Recursive Sponsor Commission Distribution Engine & Downline Tree Visualizer",
        "Enterprise Role-Based (RBAC) & Attribute-Based (ABAC) permissions for Admins, Counter Staff, and Field Agents",
        "Automated Client-Side PDF Generation Engine for GST Tax Invoices, Booking Certificates, and Payment Receipts"
      ],
      challenges: [
        {
          title: "Multi-Tier Recursive Sponsor Commission Ledger",
          problem: "Every retail purchase or plot installment triggers upstream commission disbursements across multi-level sponsor hierarchies. Concurrency bursts during business hours risked ledger race conditions and duplicated payouts.",
          solution: "Implemented atomic MongoDB session operations combined with immutable double-entry ledger records and scheduled cron-based batch reconciliations. Every transaction generates an auditable cryptographic log."
        },
        {
          title: "Zero-Hardware Smartphone Barcode POS Integration",
          problem: "Equipping multiple counters with specialized handheld USB barcode scanners was expensive and inconvenient for mobile staff.",
          solution: "Architected a WebRTC/ZXing smartphone camera scanner module that pairs with desktop terminals over dedicated Socket.IO event rooms. Synthesized instant haptic/audio feedback with Web Audio API and achieved sub-50ms cart populating."
        },
        {
          title: "Instant Multilingual Legal Agreement & Receipt Printing",
          problem: "Property sales required on-the-spot legal buyer-seller agreements in both Hindi and English, complete with custom stamp boundaries, payment terms, and installment schedules.",
          solution: "Engineered a client-side dynamic document engine using jsPDF + AutoTable layouts, supporting UTF font encodings and instant print previews ready for physical signature."
        }
      ],
      techRationale: [
        {
          tech: "React 19 & TailwindCSS",
          reason: "High-density enterprise data grids, instant reactive filtering, and zero-latency keyboard-first POS counter shortcuts."
        },
        {
          tech: "Node.js & Express Modular Architecture",
          reason: "Decoupled domain services with strict ABAC policy middleware for high concurrent API throughput."
        },
        {
          tech: "MongoDB Aggregation Pipelines",
          reason: "Complex multi-depth downline tree calculations and monthly closing financial aggregation queries executed in milliseconds."
        },
        {
          tech: "Socket.IO Real-Time Engine",
          reason: "Low-overhead bidirectional event streaming between mobile camera feeds and desktop cashier terminals."
        }
      ],
      handoverDeliverables: [
        "Full production source code and automated build pipelines delivered",
        "Database schema migrations, security audits, and deployment guides",
        "Role-based staff onboarding runbooks and admin training sessions",
        "100% verified production handover for continuous commercial daily operations"
      ]
    }
  },

  {
    id: "proj-01",
    slug: "battlefiesta",
    title: "BattleFiesta",
    tagline: "Esports Tournament Management SaaS Platform",
    category: "Full-Stack Web App",
    projectType: "personal",
    liveUrl: "https://battlefiesta.in/",
    badge: "Own Product / Subscription Based (Free to Try)",
    featured: true,
    coverColor: "#7C6CFB",
    tags: ["BGMI / PUBG", "Free Fire", "Esports Tournament Manager", "SaaS Platform", "Real-time Statistics"],
    problem: "Esports organizers hosting BGMI, PUBG, and Free Fire tournaments struggle with manual player registrations, messy slot allocation, and error-prone score tracking across spreadsheets.",
    solution: "I engineered BattleFiesta as my own flagship SaaS product — a complete esports tournament platform that automates tournament creation, slot management, automatic leaderboard calculations, and live statistics tracking. Organizers can start with a free trial and upgrade via subscription.",
    technology: ["React.js", "Node.js", "Express.js", "MongoDB", "Redux Toolkit", "Cloudinary", "Firebase"],
    businessImpact: "Used by active gaming communities to host hundreds of BGMI & Free Fire matches seamlessly with zero manual scorekeeping, instant ranking generation, and automated player notifications.",
    caseStudy: {
      clientObjective: "Build a scalable, real-time tournament orchestration platform for competitive mobile esports organizers, empowering them to run monetization-ready leagues.",
      deliverables: [
        "Live tournament bracket & slot allocation engine",
        "Dynamic OCR/image & score calculation pipelines",
        "Subscription & payment gateway integration",
        "Player portfolio & performance statistics tracker"
      ],
      challenges: [
        {
          title: "High-Concurrency Tournament Rush",
          problem: "Hundreds of team captains registering simultaneously within seconds of slot release caused database lock contention.",
          solution: "Implemented optimistic locking with queue buffers and caching to ensure fair, millisecond-accurate slot reservations."
        }
      ],
      techRationale: [
        {
          tech: "Node.js & MongoDB",
          reason: "Flexible schema for diverse game match formats (BGMI, Free Fire) and rapid leaderboard reads."
        }
      ],
      handoverDeliverables: [
        "Live active product maintained and updated regularly",
        "Global esports community adoption"
      ]
    }
  },

  {
    id: "proj-02",
    slug: "employee-attendance-system",
    title: "Employee Attendance & Payroll System",
    tagline: "Attendance & Workforce Tracking ERP",
    category: "Internal Software",
    projectType: "freelance",
    clientName: "Internal Enterprise Client",
    handoverStatus: "Delivered & Deployed",
    badge: "Real Freelance Client Work (Handover Complete)",
    featured: false,
    coverColor: "#3A6B63",
    tags: ["Attendance", "Role Based Access", "Dashboard", "Payroll Reports"],
    problem: "Manual attendance tracking across departments led to errors, disputes, and slow payroll processing.",
    solution: "We delivered a role-based attendance system with real-time check-in tracking, manager dashboards, and automated monthly reports.",
    technology: ["React", "Express", "MongoDB", "JWT"],
    businessImpact: "Reduced payroll processing time and eliminated attendance disputes with a transparent, auditable record for every employee.",
    caseStudy: {
      clientObjective: "Automate company-wide employee shift logging and payroll reconciliation into an auditable digital dashboard.",
      deliverables: [
        "Check-in/Check-out tracking with IP and geofence verification",
        "Departmental manager approval workflows",
        "One-click monthly payroll export"
      ],
      challenges: [
        {
          title: "Attendance Discrepancy Reconciliation",
          problem: "Managing half-day, overtime, and leave approval chains across multiple departments without manual intervention.",
          solution: "Built a state machine workflow engine that automatically updates monthly payroll calculations based on manager actions."
        }
      ],
      techRationale: [
        {
          tech: "React & Express",
          reason: "Lightweight, reliable architecture tailored for fast enterprise adoption."
        }
      ],
      handoverDeliverables: [
        "Delivered and deployed for operational workforce tracking"
      ]
    }
  },

  {
    id: "proj-03",
    slug: "expense-management-system",
    title: "AccuSoft — Personal & Business Expense Analytics SaaS",
    tagline: "Free-to-Use Financial Analytics SaaS • Multi-Ledger Tracking • Real-Time Spending Insights",
    category: "SaaS & Finance",
    projectType: "proprietary_saas",
    liveUrl: "https://accusoft.battlefiesta.in/dashboard",
    badge: "Own SaaS Product / Free to Use (No Subscription Fee)",
    featured: true,
    coverColor: "#E8A33D",
    seo: {
      title: "AccuSoft SaaS Case Study | Free Multi-Ledger Expense Analytics Platform",
      description: "How Webnex Labs built AccuSoft: A full-stack free SaaS financial analytics and expense management platform with multi-ledger tracking, Chart.js visual breakdowns, and Cloudinary receipts.",
      keywords: "Free Expense Tracker SaaS, Personal Finance Management Web App, Multi-Ledger Accounting Tool, React Redux Toolkit Financial Dashboard, Node.js MongoDB Expense System"
    },
    keyMetrics: [
      { label: "Cost to Users", value: "100% Free", sub: "Open Access SaaS" },
      { label: "Ledger Organization", value: "Multi-Ledger", sub: "Personal & Business" },
      { label: "Chart Render Speed", value: "60 FPS", sub: "Client Aggregation" },
      { label: "Live Deployment", value: "Online", sub: "Instant Web Access" }
    ],
    tags: [
      "Free SaaS Platform",
      "Multi-Ledger Accounting",
      "Interactive Chart.js Analytics",
      "Category Spending Breakdown",
      "Receipt & File Cloudinary Uploads",
      "CSV Data Export & Audit Reports"
    ],
    problem: "Freelancers, independent professionals, and households struggle to keep track of daily cash outflows, utility bills, and multi-category budgets when relying on disorganized paper receipts, complex paid accounting software, or fragile spreadsheets.",
    solution: "I designed and engineered AccuSoft as my own flagship, 100% free-to-use SaaS web application. It offers instant multi-ledger creation (personal vs business vs office), custom spending categorization, real-time Chart.js visual analytics, receipt image attachments via Cloudinary, and one-click CSV export.",
    businessImpact: "Provides hundreds of active users instant clarity on monthly net cash flow and category burn rates with zero subscription barrier, no intrusive ads, and a lightning-fast responsive interface.",
    technology: [
      "React.js 18",
      "Redux Toolkit & Persist",
      "Node.js & Express 5",
      "MongoDB & Mongoose",
      "Chart.js & React-Chartjs-2",
      "TailwindCSS & Framer Motion",
      "Cloudinary & AWS S3 Storage",
      "JWT & Refresh Token Auth",
      "Docker & Node-Cron"
    ],
    caseStudy: {
      clientObjective: "Build a seamless, high-speed, and zero-cost cloud financial manager that empowers individuals and small business owners to track expenses effortlessly across multiple segregated ledgers without complex accounting jargon.",
      deliverables: [
        "Interactive Dashboard with daily cash spend cards, monthly trend graphs, and category pie charts",
        "Multi-Ledger Architecture allowing users to maintain independent balance sheets for Home, Office, and Freelance projects",
        "Cloud Receipt & File Storage integrating Cloudinary and S3 for tax proof attachments",
        "Data Export Engine supporting instant CSV downloads and printable expense vouchers",
        "Secure JWT Dual-Token Authentication with refresh tokens, password recovery, and email verification",
        "Custom Theme Chooser with persistent dark/light mode preference across devices"
      ],
      challenges: [
        {
          title: "Multi-Ledger Segregation & Balance Recalculation",
          problem: "Users often manage distinct budgets (e.g. Personal vs Business) simultaneously. Combining different ledgers without state leaks or slow backend queries was a major architectural requirement.",
          solution: "Structured MongoDB ledger schemas with indexed composite keys and Redux Persist state slices. Ledger switches occur instantly with zero full-page reloads and isolated financial calculations."
        },
        {
          title: "Fluid Visual Data Aggregations Across Large Date Ranges",
          problem: "Rendering dynamic bar charts, category doughnut graphs, and filtered transaction data tables for months of historical entries without UI stutter.",
          solution: "Implemented client-side memoized aggregation pipelines paired with Chart.js canvas rendering and responsive date-range filtering for smooth 60fps animations."
        },
        {
          title: "Optimized File Attachment & Media Lifecycle",
          problem: "Attaching receipt photos to transactions risked ballooning server disk space and bandwidth.",
          solution: "Integrated Cloudinary and S3 storage with automatic image compression on upload and automated cleanup handlers when expense records are deleted."
        }
      ],
      techRationale: [
        {
          tech: "React 18 & Redux Toolkit",
          reason: "Predictable central financial state management with Redux Persist ensuring offline state resilience."
        },
        {
          tech: "Chart.js & React-Chartjs-2",
          reason: "Crisp canvas rendering for spending breakdown doughnuts, income vs expense bar charts, and timeline trends."
        },
        {
          tech: "Express 5 & MongoDB Aggregations",
          reason: "Next-gen Express async routing with MongoDB monthly closing pipelines for sub-millisecond report generation."
        },
        {
          tech: "Cloudinary & Multer Storage",
          reason: "Scalable cloud receipt image hosting with dynamic transformation and instant thumbnail previews."
        }
      ],
      handoverDeliverables: [
        "Live production SaaS deployed at accusoft.battlefiesta.in",
        "100% free public access for personal and business budget management",
        "Continuous feature updates, backup cron jobs, and cloud database maintenance"
      ]
    }
  }
];
