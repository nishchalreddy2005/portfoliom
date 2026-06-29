import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, GraduationCap, Calendar, BookOpen, Award, Sparkles, Check, School } from "lucide-react";
import { API_BASE } from "../config";

export type EducationId = "btech" | "intermediate" | "school";

interface Metric {
  label: string;
  value: string;
}

interface DetailData {
  title: string;
  institution: string;
  duration: string;
  degreeStream: string;
  board?: string;
  description: string;
  learnings: string[];
  highlights: string[];
  metrics: Metric[];
  snapshot: string[];
}

const DETAIL_DATA: Record<EducationId, DetailData> = {
  btech: {
    title: "Bachelor of Technology (B.Tech)",
    institution: "Koneru Lakshmaiah Educational Foundation",
    duration: "2022 – 2026",
    degreeStream: "Computer Science & Engineering",
    description: "Pursuing a Bachelor's degree in Computer Science & Engineering with a strong focus on software development, system design, and modern web technologies. Built multiple full-stack applications, blockchain projects, and AI-powered solutions while continuously strengthening problem-solving and engineering skills.",
    learnings: [
      "Full-Stack Development",
      "Software Architecture",
      "Database Design",
      "Problem Solving",
      "System Design",
      "AI Integration"
    ],
    highlights: [
      "Data Structures",
      "Algorithms",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
      "React",
      "Node.js",
      "TypeScript",
      "AI & Automation"
    ],
    metrics: [
      { label: "CGPA", value: "8.75" },
      { label: "Duration", value: "4 Years" },
      { label: "Projects", value: "5+" },
      { label: "Focus", value: "CSE" }
    ],
    snapshot: [
      "Built 5+ projects",
      "Explored MERN stack development",
      "Worked on Blockchain applications",
      "Developed AI-powered tools",
      "Strengthened problem-solving skills"
    ]
  },
  intermediate: {
    title: "Intermediate (MPC)",
    institution: "Shri Shiridi Sai Junior College",
    duration: "2020 – 2022",
    degreeStream: "MPC (Mathematics, Physics, Chemistry)",
    board: "BIEAP",
    description: "Developed a strong foundation in mathematics and science through the MPC curriculum. This phase strengthened analytical thinking, logical reasoning, and problem-solving abilities which later supported software engineering studies.",
    learnings: [
      "Mathematics Foundation",
      "Analytical Thinking",
      "Scientific Reasoning",
      "Physics Fundamentals",
      "Problem Solving"
    ],
    highlights: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Analytical Thinking",
      "Logical Reasoning"
    ],
    metrics: [
      { label: "Percentage", value: "65%" },
      { label: "Duration", value: "2 Years" },
      { label: "Stream", value: "MPC" },
      { label: "Board", value: "BIEAP" }
    ],
    snapshot: [
      "Developed analytical thinking",
      "Built strong mathematics foundation",
      "Improved logical reasoning",
      "Strengthened scientific understanding"
    ]
  },
  school: {
    title: "Secondary School Certificate (Class X)",
    institution: "Tripura English Medium School",
    duration: "Completed 2020",
    degreeStream: "Secondary Education",
    board: "CBSE",
    description: "Completed secondary education with a balanced academic foundation across mathematics, science, communication, and general studies. Developed discipline, learning habits, and curiosity that laid the groundwork for future technical education.",
    learnings: [
      "Academic Foundation",
      "Communication Skills",
      "Mathematics",
      "Science Fundamentals",
      "Learning Discipline"
    ],
    highlights: [
      "Mathematics",
      "Science",
      "English",
      "Social Science"
    ],
    metrics: [
      { label: "Percentage", value: "77%" },
      { label: "Board", value: "CBSE" },
      { label: "Completed", value: "2020" },
      { label: "Level", value: "Secondary" }
    ],
    snapshot: [
      "Built academic discipline",
      "Developed communication skills",
      "Established science foundation",
      "Strengthened learning habits"
    ]
  }
};

const containerVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const FloatingParticle = ({ delay = 0, xRange = [0, 30], yRange = [0, -60] }) => (
  <motion.div
    animate={{
      y: yRange,
      x: xRange,
      opacity: [0, 0.5, 0],
    }}
    transition={{
      duration: 6 + Math.random() * 4,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    className="absolute h-1.5 w-1.5 rounded-full bg-accent-pink/20 blur-[0.5px] pointer-events-none"
  />
);

const FALLBACK_ITEMS = [
  {
    id: "btech",
    shortTitle: "B.Tech",
    degree: "Bachelor of Technology (B.Tech)",
    institution: "Koneru Lakshmaiah Educational Foundation",
    duration: "2022 - 2026",
    degreeStream: "Computer Science & Engineering",
    description: "Pursuing a Bachelor's degree in Computer Science & Engineering with a strong focus on software development, system design, and modern web technologies. Built multiple full-stack applications, blockchain projects, and AI-powered solutions while continuously strengthening problem-solving and engineering skills.",
    learnings: [
      "Full-Stack Development",
      "Software Architecture",
      "Database Design",
      "Problem Solving",
      "System Design",
      "AI Integration"
    ],
    highlights: [
      "Data Structures",
      "Algorithms",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
      "React",
      "Node.js",
      "TypeScript",
      "AI & Automation"
    ],
    snapshot: [
      "Built 5+ projects",
      "Explored MERN stack development",
      "Worked on Blockchain applications",
      "Developed AI-powered tools",
      "Strengthened problem-solving skills"
    ],
    metrics: [
      "CGPA|8.75",
      "Duration|4 Years",
      "Projects|5+",
      "Focus|CSE"
    ],
    order: 0
  },
  {
    id: "intermediate",
    shortTitle: "Intermediate",
    degree: "Intermediate Class XII (MPC)",
    institution: "Shri Shiridi Sai Junior College",
    duration: "2020 - 2022",
    degreeStream: "MPC (Mathematics, Physics, Chemistry)",
    board: "BIEAP",
    description: "Developed a strong foundation in mathematics and science through the MPC curriculum. This phase strengthened analytical thinking, logical reasoning, and problem-solving abilities which later supported software engineering studies.",
    learnings: [
      "Mathematics Foundation",
      "Analytical Thinking",
      "Scientific Reasoning",
      "Physics Fundamentals",
      "Problem Solving"
    ],
    highlights: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Analytical Thinking",
      "Logical Reasoning"
    ],
    snapshot: [
      "Developed analytical thinking",
      "Built strong mathematics foundation",
      "Improved logical reasoning",
      "Strengthened scientific understanding"
    ],
    metrics: [
      "Percentage|65%",
      "Duration|2 Years",
      "Stream|MPC",
      "Board|BIEAP"
    ],
    order: 1
  },
  {
    id: "school",
    shortTitle: "School",
    degree: "SSC Class X",
    institution: "Tripura English Medium School",
    duration: "Completed 2020",
    degreeStream: "Secondary Education",
    board: "CBSE",
    description: "Completed secondary education with a balanced academic foundation across mathematics, science, communication, and general studies. Developed discipline, learning habits, and curiosity that laid the groundwork for future technical education.",
    learnings: [
      "Academic Foundation",
      "Communication Skills",
      "Mathematics",
      "Science Fundamentals",
      "Learning Discipline"
    ],
    highlights: [
      "Mathematics",
      "Science",
      "English",
      "Social Science"
    ],
    snapshot: [
      "Built academic discipline",
      "Developed communication skills",
      "Established science foundation",
      "Strengthened learning habits"
    ],
    metrics: [
      "Percentage|77%",
      "Board|CBSE",
      "Completed|2020",
      "Level|Secondary"
    ],
    order: 2
  }
];

export default function EducationSection() {
  const [items, setItems] = useState<any[]>(FALLBACK_ITEMS);
  const [selectedEducation, setSelectedEducation] = useState<string>("btech");
  const [activeTab, setActiveTab] = useState<"overview" | "learnings" | "highlights">("overview");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch(`${API_BASE}/api/education`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const sorted = data.sort((a, b) => a.order - b.order);
          setItems(sorted);
          setSelectedEducation(sorted[0].id);
        }
      })
      .catch(err => {
        console.error("Failed to fetch education details:", err);
      });
  }, []);

  useEffect(() => {
    const updateCoords = () => {
      if (!containerRef.current || !panelRef.current) return;
      const activeCard = cardRefs.current[selectedEducation];
      if (!activeCard) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const cardRect = activeCard.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();

      // Card right edge center coordinates relative to container
      const x1 = cardRect.right - containerRect.left;
      const y1 = (cardRect.top + cardRect.bottom) / 2 - containerRect.top;
      // Panel left edge center coordinates relative to container (using stable offset from top)
      const x2 = panelRect.left - containerRect.left;
      const y2 = panelRect.top + 120 - containerRect.top;

      setCoords({ x1, y1, x2, y2 });
    };

    updateCoords();
    const timer = setTimeout(updateCoords, 100);

    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [selectedEducation, items]);

  const educationList = items.map(item => {
    let parsedMetric = "";
    if (item.metrics && item.metrics[0]) {
      const [label, value] = item.metrics[0].split('|');
      parsedMetric = label === 'CGPA' ? `${value} CGPA` : (value || label);
    }
    return {
      id: item.id,
      shortTitle: item.shortTitle,
      degree: item.degree,
      institution: item.institution,
      duration: item.duration,
      metric: parsedMetric,
      isPrimary: item.order === 0
    };
  });

  const activeDetail = items.find(item => item.id === selectedEducation) || items[0];

  const activeMetrics = (activeDetail?.metrics || []).map((m: string) => {
    const [label, value] = m.split('|');
    return { label: label || '', value: value || '' };
  });

  const getIcon = (shortTitle: string) => {
    const title = (shortTitle || '').toLowerCase();
    if (title.includes('tech') || title.includes('bachelor') || title.includes('college') || title.includes('university')) {
      return <GraduationCap className="h-4 w-4" />;
    }
    if (title.includes('inter') || title.includes('school') || title.includes('class xii') || title.includes('high')) {
      return <BookOpen className="h-4 w-4" />;
    }
    return <School className="h-4 w-4" />;
  };

  const getDetailsIcon = (shortTitle: string) => {
    const title = (shortTitle || '').toLowerCase();
    if (title.includes('tech') || title.includes('bachelor') || title.includes('college') || title.includes('university')) {
      return <GraduationCap className="h-5 w-5" />;
    }
    if (title.includes('inter') || title.includes('school') || title.includes('class xii') || title.includes('high')) {
      return <BookOpen className="h-5 w-5" />;
    }
    return <School className="h-5 w-5" />;
  };

  if (!activeDetail) return null;

  return (
    <div ref={containerRef} className="relative grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-12 items-stretch mt-4">
      {/* Floating Particles in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <FloatingParticle delay={0} xRange={[-20, 20]} yRange={[-20, -100]} />
        <FloatingParticle delay={2.5} xRange={[10, 40]} yRange={[-30, -120]} />
        <FloatingParticle delay={4.2} xRange={[-30, 0]} yRange={[-10, -90]} />
      </div>

      {/* Left Column: Vertical timeline with clickable education cards */}
      <div className="flex flex-col space-y-6 justify-start">
        
        {/* Mobile Horizontal Tabs */}
        <div className="flex lg:hidden overflow-x-auto pb-4 gap-3 w-full scrollbar-none">
          {educationList.map((edu) => (
            <button
              key={edu.id}
              onClick={() => {
                setSelectedEducation(edu.id);
                setActiveTab("overview");
              }}
              className={`px-5 py-2.5 rounded-full border font-mono text-[10px] uppercase tracking-wider shrink-0 transition-all duration-300 ${
                selectedEducation === edu.id 
                  ? "border-accent-pink bg-accent-pink/15 text-accent-pink shadow-[0_0_12px_rgba(212,175,55,0.3)]" 
                  : "border-white/5 bg-white/1 text-neutral-400 hover:text-white"
              }`}
            >
              {edu.shortTitle}
            </button>
          ))}
        </div>

        {/* Desktop Vertical Timeline */}
        <div className="hidden lg:flex flex-col space-y-6">
          <div className="flex flex-col mb-2 pl-8">
            <span className="text-[10px] font-mono text-accent-pink tracking-widest uppercase font-semibold">
              ACADEMIC JOURNEY
            </span>
            <span className="text-[9px] text-neutral-500 font-mono mt-1">
              Foundation → Growth → Specialization
            </span>
          </div>

          {educationList.map((edu) => {
            const isSelected = selectedEducation === edu.id;
            const isHovered = hoveredCard === edu.id;
            return (
              <div 
                key={edu.id}
                ref={el => { cardRefs.current[edu.id] = el; }}
                className="relative pl-8 border-l border-white/10 group py-2"
              >
                {/* Timeline node with dynamic active/hover highlight */}
                <motion.div 
                  animate={isSelected ? { scale: [1, 1.3, 1], boxShadow: ["0 0 4px rgba(212,175,55,0.4)", "0 0 16px rgba(212,175,55,0.9)", "0 0 12px rgba(212,175,55,0.8)"] } : {}}
                  transition={{ duration: 0.4 }}
                  className={`absolute left-[-6.5px] top-6 h-3.5 w-3.5 rounded-full transition-all duration-300 z-10 ${
                    isSelected 
                      ? "bg-accent-pink border border-accent-pink" 
                      : isHovered
                        ? "bg-accent-pink border border-accent-pink shadow-[0_0_8px_rgba(212,175,55,0.6)] scale-105"
                        : "bg-neutral-800 border border-white/20"
                  }`} 
                />
                
                <motion.div 
                  onClick={() => {
                    setSelectedEducation(edu.id);
                    setActiveTab("overview");
                  }}
                  onMouseEnter={() => setHoveredCard(edu.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col gap-3 group transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? "border border-accent-pink bg-accent-pink/5 shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-[1.02]" 
                      : edu.isPrimary
                        ? "border border-accent-pink/20 bg-accent-pink/2 hover:border-accent-pink/40 hover:bg-white/2"
                        : "border border-white/5 bg-white/1 hover:border-white/15 hover:bg-white/2"
                  }`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border mt-1 shrink-0 transition-colors duration-300 ${
                        isSelected 
                          ? "bg-accent-pink/10 border-accent-pink/30 text-accent-pink" 
                          : "bg-neutral-900 border-white/5 text-neutral-400 group-hover:text-accent-pink"
                      }`}>
                        {getIcon(edu.shortTitle)}
                      </div>
                      <div>
                        <span className={`font-mono text-[9px] tracking-wider uppercase block font-semibold ${
                          isSelected ? "text-accent-pink" : "text-accent-blue"
                        }`}>{edu.duration}</span>
                        <h3 className="font-syne font-bold text-xl text-white mt-0.5 group-hover:text-accent-pink transition-colors">
                          {edu.degree}
                        </h3>
                      </div>
                    </div>
                    {edu.metric && (
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded border border-accent-pink/20 bg-accent-pink/5 text-accent-pink uppercase tracking-widest shrink-0 font-bold">
                        {edu.metric}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-neutral-400 text-xs font-light">
                    {edu.institution}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Dynamic Animated Connector SVG for Desktop */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden lg:block">
        {/* Glow Line racer */}
        <motion.path
          key={`glow-${selectedEducation}-${coords.x1}-${coords.y1}-${coords.x2}-${coords.y2}`}
          d={`M ${coords.x1},${coords.y1} C ${(coords.x1 + coords.x2)/2},${coords.y1} ${(coords.x1 + coords.x2)/2},${coords.y2} ${coords.x2},${coords.y2}`}
          fill="none"
          stroke="#dfba6b"
          strokeWidth="4"
          initial={{ opacity: 0.8, pathLength: 0 }}
          animate={{ opacity: 0, pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ filter: "blur(4px)" }}
        />
        {/* Main Solid Line */}
        <motion.path
          key={`line-${selectedEducation}-${coords.x1}-${coords.y1}-${coords.x2}-${coords.y2}`}
          d={`M ${coords.x1},${coords.y1} C ${(coords.x1 + coords.x2)/2},${coords.y1} ${(coords.x1 + coords.x2)/2},${coords.y2} ${coords.x2},${coords.y2}`}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.circle
          key={`circle-${selectedEducation}-${coords.x1}-${coords.y1}-${coords.x2}-${coords.y2}`}
          r="4"
          fill="#d4af37"
          className="shadow-[0_0_8px_#d4af37]"
        >
          <animateMotion
            path={`M ${coords.x1},${coords.y1} C ${(coords.x1 + coords.x2)/2},${coords.y1} ${(coords.x1 + coords.x2)/2},${coords.y2} ${coords.x2},${coords.y2}`}
            dur="0.5s"
            repeatCount="1"
            fill="freeze"
          />
        </motion.circle>

        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#dfba6b" stopOpacity="1" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Right Column: Dynamic Detail Panel */}
      <div ref={panelRef} className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEducation}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
            className="glass-card p-6 md:p-8 rounded-2xl flex flex-col justify-start relative overflow-hidden group min-h-[400px] border border-white/5 bg-white/1 shadow-[0_8px_32px_rgba(212,175,55,0.03),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-accent-pink/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.08)] transition-all duration-300"
          >
            {/* Ambient slow moving radial glows inside detail panel */}
            <motion.div
              animate={{
                x: [0, 30, -10, 0],
                y: [0, -20, 15, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-accent-pink/1.5 blur-[80px] pointer-events-none -z-10"
            />
            <motion.div
              animate={{
                x: [0, -20, 20, 0],
                y: [0, 15, -15, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-accent-blue/1 blur-[70px] pointer-events-none -z-10"
            />
            
            {/* Ambient motion particles inside the detail panel */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <FloatingParticle delay={1} xRange={[-10, 20]} yRange={[0, -50]} />
              <FloatingParticle delay={3} xRange={[20, -20]} yRange={[20, -60]} />
            </div>

            <div className="space-y-6">
              {/* 1. Title & Duration */}
              <motion.div variants={itemVariants} className="space-y-1">
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase block">
                  {activeDetail.duration}
                </span>
                <h3 className="font-syne font-bold text-2.5xl text-white tracking-tight mt-1">
                  {activeDetail.degree}
                </h3>
              </motion.div>

              {/* 2. Institution Identity */}
              <motion.div variants={itemVariants} className="flex items-center gap-3.5 p-4 rounded-xl border border-white/5 bg-white/1">
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/5 text-neutral-400">
                  {getDetailsIcon(activeDetail.shortTitle)}
                </div>
                <div>
                  <h4 className="font-display font-medium text-sm text-neutral-200">
                    {activeDetail.institution}
                  </h4>
                  <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                    {activeDetail.degreeStream}
                  </p>
                </div>
              </motion.div>

              {/* 3. Education Metric Strip */}
              {activeMetrics.length > 0 && (
                <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeMetrics.map((metric: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="glass-card px-3 py-3 rounded-xl border border-white/5 bg-white/1 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-accent-pink/20 hover:shadow-[0_0_10px_rgba(212,175,55,0.05)]"
                    >
                      <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider mb-1">
                        {metric.label}
                      </span>
                      <span className="font-syne font-bold text-base text-accent-pink">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 4. Internal Tabs */}
              <motion.div variants={itemVariants} className="flex border-b border-white/5 pb-2 gap-4">
                {(["overview", "learnings", "highlights"] as const).map((tab) => {
                  const label = 
                    tab === "overview" ? "Overview" :
                    tab === "learnings" ? "Key Learnings" : 
                    "Academic Highlights";
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="relative py-2 px-1 text-xs font-mono uppercase tracking-wider transition-colors duration-300 focus:outline-none cursor-pointer"
                    >
                      <span className={isActive ? "text-accent-pink font-semibold" : "text-neutral-400 hover:text-white"}>
                        {label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeDetailTab"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-pink shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 28,
                            mass: 0.8
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>

              {/* 5. Tab Content Panel */}
              <motion.div variants={itemVariants} className="pt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    {activeTab === "overview" && (
                      <div className="space-y-4">
                        <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                          {activeDetail.description}
                        </p>
                        {activeDetail.board && (
                          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 pt-1">
                            <BookOpen className="h-3.5 w-3.5 text-accent-pink" />
                            <span>Affiliation / Board: {activeDetail.board}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "learnings" && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(activeDetail.learnings || []).map((learning: string, idx: number) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className="flex items-center gap-2.5 text-xs text-neutral-300 font-light"
                          >
                            <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>{learning}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    {activeTab === "highlights" && (
                      <div className="flex flex-wrap gap-2">
                        {(activeDetail.highlights || []).map((highlight: string, idx: number) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03, duration: 0.2 }}
                            className="text-[10px] font-mono px-3 py-1.5 rounded-full border border-white/5 bg-white/2 text-neutral-300 hover:border-accent-pink/35 hover:text-white transition-all duration-300 hover:shadow-[0_0_8px_rgba(212,175,55,0.05)] cursor-default"
                          >
                            {highlight}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* 6. Journey Snapshot (Timeline/Checklist format) */}
              {(activeDetail.snapshot || []).length > 0 && (
                <motion.div variants={itemVariants} className="pt-5 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-accent-pink" />
                    <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-semibold">
                      Journey Snapshot
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {activeDetail.snapshot.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-400 font-light">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-pink shrink-0 shadow-[0_0_6px_#d4af37]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
