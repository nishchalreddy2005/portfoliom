import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import axios from "axios";
import { API_BASE } from "../config";

const FALLBACK_INTERNSHIPS = [
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
    tags: ["React", "TypeScript", "NodeJS", "SCSS", "Redux Toolkit", "RTK Query", "GraphQL", "WebSockets", "Material UI", "HighCharts", "Rsuite", "Jest and RTL"],
    order: 0
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
    tags: ["React", "ViteJS", "NodeJS", "MongoDB", "AWS Serverless", "REST APIs", "AWS S3"],
    order: 1
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
    tags: ["React", "TypeScript", "ViteJS", "Recharts", "Tailwind CSS", "REST APIs", "Dynamic Dashboards"],
    order: 2
  }
];

export default function Services() {
  const [activeItem, setActiveItem] = useState<string | null>("hivel-fulltim");
  const [internships, setInternships] = useState<any[]>(FALLBACK_INTERNSHIPS);

  useEffect(() => {
    axios.get(`${API_BASE}/api/internships`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const sorted = res.data.sort((a: any, b: any) => a.order - b.order);
          setInternships(sorted);
          setActiveItem(sorted[0].id);
        }
      })
      .catch(err => {
        console.error("Error loading internships:", err);
      });
  }, []);

  const toggleItem = (id: string) => {
    setActiveItem(activeItem === id ? null : id);
  };

  if (internships.length === 0) return null;

  return (
    <section
      id="services"
      className="relative bg-primary-dark/40 py-16 md:py-24 border-t border-white/5 cursor-default"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Sticky Column Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col space-y-6">
            <span className="font-mono text-[10px] text-accent-pink tracking-widest uppercase block">// PROFESSIONAL JOURNEY</span>

            <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none">
              Internships & <br />
              Experience.
            </h2>

            <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed max-w-md">
              Hands-on software engineering contributions at design-led and product-focused organizations, building performant web architectures.
            </p>
          </div>

          {/* Right Column: Numbered accord-list based on internships data */}
          <div className="lg:col-span-7 flex flex-col divider-y divide-white/5 border-t border-white/5">
            {internships.map((intern, idx) => {
              const isOpen = activeItem === intern.id;
              const displayNum = `0${idx + 1}`;
              return (
                <div
                  key={intern.id}
                  className={`border-b border-white/5 py-6 md:py-8 transition-all duration-300 text-left ${isOpen ? "glass-card px-4 md:px-8 rounded-xl my-4 border-transparent" : ""
                    }`}
                >
                  <button
                    onClick={() => toggleItem(intern.id)}
                    className="w-full flex items-center justify-between text-left group gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-4 md:gap-8 grow">
                      <span className="font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-accent-pink transition-colors">
                        / {displayNum}
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between grow gap-2 pr-2 sm:pr-8">
                        <div className="flex flex-col gap-1">
                          <h3 className="font-syne font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight group-hover:text-accent-pink transition-colors duration-300">
                            {intern.company}
                          </h3>
                          <span className="text-neutral-400 font-light text-sm sm:text-base group-hover:text-accent-pink transition-colors duration-300">
                            {intern.role}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors uppercase shrink-0 mt-1 sm:mt-0">
                          {intern.duration}
                        </span>
                      </div>
                    </div>

                    <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/35 transition-colors text-neutral-400 group-hover:text-white shrink-0">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>

                  {/* Expandable activity details block */}
                  <div
                    className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[600px] opacity-100 mt-6" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="pl-6 sm:pl-12 pr-4 pb-4 space-y-6">

                      {/* Tech Stack */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">// TECH STACK</span>
                        <div className="flex flex-wrap gap-1.5">
                          {intern.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-[9px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/2 text-neutral-300 hover:border-accent-pink/30 hover:text-white transition-colors duration-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key Deliverables & Impact */}
                      <div className="space-y-3">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">// KEY DELIVERABLES & IMPACT</span>
                        <div className="space-y-2.5">
                          {(intern.details || []).map((detail: string, dIdx: number) => (
                            <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent-pink shrink-0 mt-1.5" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

