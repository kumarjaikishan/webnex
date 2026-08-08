import { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    id: "cs-01",
    slug: "battlefiesta",
    client: "BattleFiesta",
    clientProblem: "Running esports tournaments manually meant delayed bracket updates, disputes over results, and no reliable way to scale beyond a handful of events at a time.",
    ourSolution: "We designed and built a full tournament management platform with secure user authentication, automated bracket generation, and live score syncing.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
    challenges: "Real-time updates needed to stay accurate even with hundreds of concurrent viewers, which required careful state management on both client and server.",
    result: "The platform now runs multiple tournaments simultaneously with real-time updates and zero manual bracket management.",
    businessGrowth: "The client has been able to scale tournament frequency without adding administrative overhead.",
  },
  {
    id: "cs-02",
    slug: "employee-attendance-system",
    client: "A Multi-Branch Retail Business",
    clientProblem: "Attendance was tracked on paper across branches, leading to payroll delays and frequent disputes between staff and management.",
    ourSolution: "We built a role-based attendance system with real-time check-ins, manager dashboards, and automated monthly reporting.",
    technologies: ["React", "Express", "MongoDB", "JWT"],
    challenges: "Supporting multiple branches with different manager permissions required a carefully structured role-based access system.",
    result: "Attendance is now tracked in real time with a single source of truth across all branches.",
    businessGrowth: "Payroll processing time dropped significantly, and attendance disputes were eliminated entirely.",
  },
];
