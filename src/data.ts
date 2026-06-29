import { Project, Service, Internship, Insight, ProcessStep } from "./types";
import cert1 from "./assets/cert 1.png";
import cert2 from "./assets/cert-2.png";
import cert3 from "./assets/cert-3.png";
import proj1 from "./assets/proj1.png";
import proj2 from "./assets/proj2.png";
import proj3 from "./assets/proj3.png";
import proj4 from "./assets/proj4.png";
import proj5 from "./assets/proj5.png";


export const PROJECTS: Project[] = [
  {
    id: "kavachai",
    title: "KavachAI — AI Enhanced Intrusion Detection System",
    category: "AI",
    image: proj1,
    client: "Research Publication",
    year: "2025",
    description: "KavachAI is an intelligent intrusion detection platform developed as a Final Year Research Project to identify malicious network activities using advanced deep learning techniques. The system combines real-time network monitoring, AI-driven anomaly detection, and active network reconnaissance to provide early threat detection across enterprise environments.",
    tags: ["React.js", "TypeScript", "Node.js", "Python", "Deep Learning", "Transformer", "VAE"],
    demoUrl: "#",
    githubUrl: "#",
    featured: true,
    badges: ["⭐ Featured Research Project", "🎓 Final Year Project", "📄 Conference Presented"],
    metrics: ["96% Detection Accuracy", "4 AI Models", "Real-Time Monitoring", "Conference Presented"]
  },
  {
    id: "decentralized-voting",
    title: "Decentralized Voting System",
    category: "Blockchain",
    image: proj2,
    client: "Independent System",
    year: "2025",
    description: "A blockchain-powered electronic voting platform designed to ensure transparency, integrity, and trust in the electoral process. The system leverages Ethereum smart contracts to securely record votes on-chain, eliminating risks such as vote tampering, duplicate voting, and centralized manipulation.",
    tags: ["React", "Vite", "Solidity", "Hardhat", "Ganache", "Ethereum", "MetaMask"],
    demoUrl: "#",
    githubUrl: "https://github.com/nishchalreddy2005/Online-Voting-System-using-blockchain"
  },
  {
    id: "electricity-billing",
    title: "Electricity Billing D-App",
    category: "Blockchain",
    image: proj3,
    client: "Utility DApp",
    year: "2024",
    description: "A decentralized electricity billing platform that utilizes blockchain smart contracts to securely manage billing records and transactions. The system ensures transparency, prevents record tampering, and provides a trusted environment for managing utility billing data.",
    tags: ["React", "Vite", "Solidity", "Hardhat", "Ganache", "Ethereum", "MetaMask"],
    demoUrl: "#",
    githubUrl: "https://github.com/nishchalreddy2005/Online-Voting-System-using-blockchain"
  },
  {
    id: "sri-friends-flavours",
    title: "Sri Friends & Flavours Restaurant Management System",
    category: "Full Stack",
    image: proj4,
    client: "Sri Friends & Flavours",
    year: "2024",
    description: "A real-world restaurant management solution developed to digitize and automate daily restaurant operations. The platform streamlines order management, customer interactions, record keeping, and business workflows, significantly reducing manual errors while improving operational efficiency.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "SQL"],
    demoUrl: "https://srifriendsandflavours.vercel.app/",
    githubUrl: "https://github.com/nishchalreddy2005/Sri-Friends-and-Flavours-Resturant-Website"
  },
  {
    id: "checkit",
    title: "CheckIT",
    category: "Full Stack",
    image: proj5,
    client: "Productivity Tool",
    year: "2023",
    description: "A modern productivity and task management platform built to streamline personal and team workflows. The application features intelligent task scheduling, interactive calendar integration, reminder management, deadline tracking, and a dedicated focus mode with built-in music support.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "SQL"],
    demoUrl: "#",
    githubUrl: "https://github.com/nishchalreddy2005/CheckIt"
  },
  {
    id: "student-counselling",
    title: "Student Counselling Management System",
    category: "Enterprise",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    client: "Academic Institution",
    year: "2024",
    description: "A comprehensive counselling management platform designed to help educational institutions manage student counselling operations efficiently. The system supports profile management, appointment scheduling, confidential communication, assessment tracking, progress monitoring, and analytical reporting.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "REST API", "GraphQL"],
    demoUrl: "#",
    githubUrl: "https://github.com/nishchalreddy2005/student-counselling-management-system"
  },
  {
    id: "student-feedback",
    title: "Student Feedback & Evaluation System",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
    client: "Academic Analytics",
    year: "2024",
    description: "A web-based platform developed to enhance the feedback and evaluation process within educational institutions. The system enables structured feedback collection, faculty evaluation, academic performance assessment, and transparent communication between students and instructors.",
    tags: ["JavaScript", "HTML", "CSS", "Java", "Spring Boot", "MySQL", "REST API"],
    demoUrl: "#",
    githubUrl: "#"
  }
];

export const SERVICES: Service[] = [
  {
    id: "serv-brand",
    num: "01",
    title: "Component Systems & State",
    description: "Architecting decoupled, highly reusable component APIs with strict type definitions and optimal React state flow.",
    details: ["React Hooks & Memoization Structures", "Custom Context State Management", "Tailwind CSS Design Systems", "High-Speed Modular Forms"]
  },
  {
    id: "serv-creative",
    num: "02",
    title: "Fluid Motion & Interaction",
    description: "Bringing flat interfaces to life using physics-based transitions, interactive gestural handlers, and keyframe sequences.",
    details: ["Framer Motion Layout Animations", "Micro-Interactions & Hover Dynamics", "Bezier Curve Custom Transitions", "GSAP Scroll Integrations"]
  },
  {
    id: "serv-interactive",
    num: "03",
    title: "D3 & WebGL Data Rendering",
    description: "Transforming vast dynamic data lists into crisp, high-impact vector graphics, custom responsive charts, and 3D scenes.",
    details: ["D3.js Custom SVG Renderers", "Three.js React-Three-Fiber Integrations", "Interactive WebGL Shaders", "Performance Grid Visualizers"]
  },
  {
    id: "serv-dev",
    num: "04",
    title: "Performance & CI Auditing",
    description: "Optimizing bundle sizes, minimizing layout thrashing, and ensuring maximum frame rate consistency for low-end mobile systems.",
    details: ["Tree Shaking & Lazy Importing", "Bundle Analyser Profiling", "Lighthouse & SEO Best Practices", "Cross-Browser Layout Calibration"]
  }
];

export const INTERNSHIPS: Internship[] = [
  {
    id: "hivel-fulltim",
    num: "01",
    company: "Hivel",
    role: "Frontend Developer",
    duration: "Jun 2025 - Mar 2026",
    details: [
      "Built real-time, data-driven dashboards handling dynamic and streaming data in production environments using Material Icons.",
      "Implemented efficient state management using Redux Toolkit (RTK Query) for scalable application flows.",
      "Integrated GraphQL APIs, REST APIs, and WebSockets for real-time data synchronization.",
      "Designed and optimized interactive data visualizations for performance and usability.",
      "Wrote and maintained test cases to ensure application reliability and stability.",
      "Debugged and resolved complex issues in production systems.",
      "Contributed to complex, real-time interactive features including chatbot workflows and configuration-driven systems impacting overall application behavior."
    ],
    tags: ["React", "TypeScript", "NodeJS", "SCSS", "Redux Toolkit", "RTK Query", "GraphQL", "WebSockets", "Material UI", "HighCharts", "Rsuite", "Jest and RTL"]
  },
  {
    id: "intern-edgeforce-sem",
    num: "02",
    company: "Edgeforce Solutions",
    role: "Frontend Developer Intern",
    duration: "Jan 2025 - May 2025",
    details: [
      "Built responsive and high-performance frontend applications using React, focusing on usability and smooth user experience.",
      "Developed and visualized real-time sensor data systems, processing live data from AWS-based systems.",
      "Implemented data processing and event-detection logic for wearable-based tracking systems (timing, activity detection, user-device mapping).",
      "Integrated frontend with backend services using REST APIs, with exposure to Node.js, MongoDB, and AWS serverless (Lambda, DynamoDB, S3)."
    ],
    tags: ["React", "ViteJS", "NodeJS", "MongoDB", "AWS Serverless", "REST APIs", "AWS S3"]
  },
  {
    id: "intern-edgeforce",
    num: "03",
    company: "Edgeforce Solutions",
    role: "Frontend Developer Intern",
    duration: "Jun 2024 - Sept 2024",
    details: [
      "Engineered dynamic analytics dashboards and robust administrator interfaces to manage sensor telemetry data, facilitating real-time tracking, retrieval, and trend analysis.",
      "Developed a comprehensive military vehicle management and fleet status system featuring component-level lifespan, manufacturing date, and usage condition analysis.",
      "Designed and implemented intelligent, priority-based automated alert systems to trigger immediate notifications for critical repairs, maintenance schedules, and fuel replenishment.",
      "Built secure operational modules allowing administrators to seamlessly register new fleet units and log inspection details, maintenance logs, and parts replacement records."
    ],
    tags: ["React", "TypeScript", "ViteJS", "Recharts", "Tailwind CSS", "REST APIs", "Dynamic Dashboards"]
  }
];

export const INSIGHTS: Insight[] = [
  {
    id: "ins-workshop",
    title: "Internshala Web Developer",
    image: cert1
  },
  {
    id: "ins-future",
    title: "Aviatrix Multicloud Network",
    image: cert3
  },
  {
    id: "ins-create",
    title: "Mathworks Onramp",
    image: cert2
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "proj-kavachai",
    num: "01",
    title: "KavachAI — AI Enhanced Intrusion Detection System",
    description: "KavachAI is an intelligent intrusion detection platform developed as a Final Year Research Project to identify network threats. Using deep learning models (VAE, LSTM, Transformers) and a max-voting aggregator, the system achieves 96% detection accuracy alongside live monitoring and Nmap reconnaissance.",
    details: ["React.js", "TypeScript", "Node.js", "Python", "Deep Learning", "VAE & LSTM"],
    image: proj1,
  },
  {
    id: "proj-voting",
    num: "02",
    title: "Decentralized Voting System",
    description: "A blockchain-powered electronic voting platform designed to ensure transparency, integrity, and trust in the electoral process. The system leverages Ethereum smart contracts to securely record votes on-chain, eliminating risks such as vote tampering, duplicate voting, and centralized manipulation.",
    details: ["React", "Vite", "Solidity", "Hardhat", "Ethereum", "MetaMask"],
    image: proj2,
    liveUrl: "https://github.com/nishchalreddy2005/Online-Voting-System-using-blockchain"
  },
  {
    id: "proj-electricity",
    num: "03",
    title: "Electricity Billing D-App",
    description: "A decentralized electricity billing platform that utilizes blockchain smart contracts to securely manage billing records and transactions. The system ensures transparency, prevents record tampering, and provides a trusted environment for managing utility billing data.",
    details: ["React", "Vite", "Solidity", "Hardhat", "Ethereum", "MetaMask"],
    image: proj3,
    liveUrl: "https://github.com/nishchalreddy2005/Online-Voting-System-using-blockchain"
  },
  {
    id: "proj-sri",
    num: "04",
    title: "Sri Friends & Flavours Restaurant Management System",
    description: "A real-world restaurant management solution developed to digitize and automate daily restaurant operations. The platform streamlines order management, customer interactions, record keeping, and business workflows, significantly reducing manual errors while improving operational efficiency.",
    details: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js"],
    image: proj4,
    liveUrl: "https://srifriendsandflavours.vercel.app/"
  },
  {
    id: "proj-checkit",
    num: "05",
    title: "CheckIT",
    description: "A modern productivity and task management platform built to streamline personal and team workflows. The application features intelligent task scheduling, interactive calendar integration, reminder management, deadline tracking, and a dedicated focus mode with built-in music support.",
    details: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "SQL"],
    image: proj5,
    liveUrl: "https://github.com/nishchalreddy2005/CheckIt"
  },
  {
    id: "proj-counselling",
    num: "06",
    title: "Student Counselling Management System",
    description: "A comprehensive counselling management platform designed to help educational institutions manage student counselling operations efficiently. The system supports profile management, appointment scheduling, confidential communication, assessment tracking, progress monitoring, and analytical reporting.",
    details: ["React.js", "Node.js", "Express.js", "MongoDB", "REST API", "GraphQL"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    liveUrl: "https://github.com/nishchalreddy2005/student-counselling-management-system"
  },
  {
    id: "proj-feedback",
    num: "07",
    title: "Student Feedback & Evaluation System",
    description: "A web-based platform developed to enhance the feedback and evaluation process within educational institutions. The system enables structured feedback collection, faculty evaluation, academic performance assessment, and transparent communication between students and instructors.",
    details: ["JavaScript", "HTML", "CSS", "Java", "Spring Boot", "MySQL"],
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop"
  }
];

export const SOCIAL_LINKS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/gvrnishchalreddy" },
  { name: "GitHub", url: "https://github.com/gvrnishchalreddy" },
  { name: "E-Mail", url: "mailto:gvrnishchalreddy@gmail.com"}
];

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  grade?: string;
  details?: string[];
}

export const EDUCATION: EducationItem[] = [
  {
    degree: "Bachelor of Technology (B.Tech)",
    institution: "Computer Science & Engineering",
    period: "2021 - 2025",
    grade: "7.0 CGPA",
    details: [
      "Specialized in Software Engineering and Modern Web Architectures.",
      "Hands-on coursework in Data Structures, Algorithms and DBMS.",
    ]
  }
];

export const ACADEMIC_FOCUS = [
  {
    title: "Software Engineering & Architecture",
    desc: "Object-oriented design patterns, software testing, systems analysis, and modular application development."
  },
  {
    title: "Advanced Web Technologies",
    desc: "Full-stack development ecosystems, single-page application architectures, and client-side performance engineering."
  },
  {
    title: "Algorithmic Problem Solving",
    desc: "Analyzing algorithm complexities, optimizing runtime efficiency, and structured data structure design."
  }
];

export const COURSEWORK_TAGS = [
  "Data Structures",
  "Algorithms",
  "DBMS",
  "OOPs",
  "Software Eng.",
  "Web Technologies",
  "Computer Networks",
  "Operating Systems"
];
