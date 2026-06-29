import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code, Server, Database, Cpu, Shield, Wrench, Sparkles, Gamepad2, X } from "lucide-react";
import MemoryGame from "./MemoryGame";
import { API_BASE } from "../config";
import { 
  SiReact, SiTypescript, SiJavascript, SiTailwindcss, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiSolidity, SiEthereum, SiOpenai, SiGit, SiGithub, SiPostman,
  SiPython, SiCplusplus, SiC, SiRust, SiDocker, SiKubernetes,
  SiGooglecloud, SiFirebase, SiSupabase, SiFramer, SiNextdotjs, SiVite, SiGraphql, SiPrisma,
  SiRedux, SiHtml5, SiCss, SiSass
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";

export type SkillCategory = "frontend" | "backend" | "database" | "blockchain" | "ai" | "tools";

interface TechItem {
  name: string;
  icon?: React.ReactNode;
  color: string;
}

const getCategoryIcon = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case "code": return <Code className="h-4 w-4" />;
    case "server": return <Server className="h-4 w-4" />;
    case "database": return <Database className="h-4 w-4" />;
    case "shield": return <Shield className="h-4 w-4" />;
    case "cpu": return <Cpu className="h-4 w-4" />;
    case "wrench": return <Wrench className="h-4 w-4" />;
    case "sparkles": return <Sparkles className="h-4 w-4" />;
    default: return <Sparkles className="h-4 w-4" />;
  }
};

const getSkillIcon = (iconName: string): React.ReactNode => {
  const norm = (iconName || '').toLowerCase().replace(/[\s\.\-\_]/g, "");
  switch (norm) {
    case "react": return <SiReact />;
    case "typescript": return <SiTypescript />;
    case "javascript": return <SiJavascript />;
    case "tailwind":
    case "tailwindcss": return <SiTailwindcss />;
    case "nodejs": return <SiNodedotjs />;
    case "express":
    case "expressjs": return <SiExpress />;
    case "mongodb": return <SiMongodb />;
    case "mysql": return <SiMysql />;
    case "solidity": return <SiSolidity />;
    case "ethereum": return <SiEthereum />;
    case "hardhat": return <SiEthereum />;
    case "metamask": return <SiEthereum />;
    case "openai": return <SiOpenai />;
    case "git": return <SiGit />;
    case "github": return <SiGithub />;
    case "vscode": return <VscVscode />;
    case "postman": return <SiPostman />;
    case "python": return <SiPython />;
    case "c++":
    case "cpp": return <SiCplusplus />;
    case "c": return <SiC />;
    case "java": return <FaJava />;
    case "rust": return <SiRust />;
    case "docker": return <SiDocker />;
    case "kubernetes": return <SiKubernetes />;
    case "aws":
    case "amazonwebservices": return <FaAws />;
    case "gcp":
    case "googlecloud": return <SiGooglecloud />;
    case "firebase": return <SiFirebase />;
    case "supabase": return <SiSupabase />;
    case "framer":
    case "framermotion": return <SiFramer />;
    case "next":
    case "nextjs": return <SiNextdotjs />;
    case "vite": return <SiVite />;
    case "graphql": return <SiGraphql />;
    case "prisma": return <SiPrisma />;
    case "redux": return <SiRedux />;
    case "html":
    case "html5": return <SiHtml5 />;
    case "css":
    case "css3": return <SiCss />;
    case "sass": return <SiSass />;
    default: return <Sparkles className="h-4 w-4" />;
  }
};

const CATEGORY_DATA: Record<SkillCategory, { title: string; skills: TechItem[] }> = {
  frontend: {
    title: "Frontend Development",
    skills: [
      { name: "React", color: "#61DAFB" },
      { name: "TypeScript", color: "#3178C6" },
      { name: "JavaScript", color: "#F7DF1E" },
      { name: "Tailwind CSS", color: "#06B6D4" }
    ]
  },
  backend: {
    title: "Backend Development",
    skills: [
      { name: "Node.js", color: "#339933" },
      { name: "Express.js", color: "#E0E0E0" }
    ]
  },
  database: {
    title: "Database Management",
    skills: [
      { name: "MongoDB", color: "#47A248" },
      { name: "MySQL", color: "#4479A1" }
    ]
  },
  blockchain: {
    title: "Blockchain & Web3",
    skills: [
      { name: "Solidity", color: "#AAAEB0" },
      { name: "Ethereum", color: "#627EEA" },
      { name: "Hardhat", color: "#FFF100" },
      { name: "MetaMask", color: "#F6851B" }
    ]
  },
  ai: {
    title: "AI & Automation",
    skills: [
      { name: "OpenAI", color: "#10A37F" }
    ]
  },
  tools: {
    title: "Developer Tools",
    skills: [
      { name: "Git", color: "#F05032" },
      { name: "GitHub", color: "#FFFFFF" },
      { name: "VS Code", color: "#007ACC" },
      { name: "Postman", color: "#FF6C37" }
    ]
  }
};

const ALL_TECHS = Object.values(CATEGORY_DATA).flatMap(c => c.skills).map(s => ({ ...s, icon: getSkillIcon(s.name) }));

const ROW_1 = ALL_TECHS.slice(0, 4);
const ROW_2 = ALL_TECHS.slice(4, 8);
const ROW_3 = ALL_TECHS.slice(8, 13);
const ROW_4 = ALL_TECHS.slice(13, 17);

const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, -80, 0],
      x: [0, 40, 0],
      opacity: [0, 0.4, 0],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    className="absolute h-1.5 w-1.5 rounded-full bg-accent-pink/30 blur-[0.5px] pointer-events-none"
  />
);

const MarqueeRow = ({ items, direction = "left", speed = 30 }: { items: TechItem[]; direction: "left" | "right"; speed: number }) => {
  // Duplicate array for seamless loop
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="flex overflow-hidden w-full select-none py-2 md:py-3 relative">
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
        }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity
        }}
        className="flex gap-20 md:gap-28 shrink-0 items-center"
      >
        {doubled.map((item, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ scale: 1.08 }}
            className="group flex items-center gap-4 md:gap-6 transition-all duration-300 opacity-12 hover:opacity-100 cursor-pointer select-none text-white blur-[1px] hover:blur-0"
          >
            {/* Logo container */}
            <div 
              style={{ 
                color: item.color,
                filter: "drop-shadow(0 0 0px transparent)"
              }}
              className="transition-all duration-300 shrink-0 flex items-center justify-center text-[28px] md:text-[45px] group-hover:brightness-125 group-hover:drop-shadow-[0_0_20px_var(--shadow-color)]"
              ref={(el) => {
                if (el) {
                  el.style.setProperty('--shadow-color', item.color);
                }
              }}
            >
              {item.icon}
            </div>

            {/* Text container */}
            <span 
              style={{ 
                color: "#FFFFFF",
                WebkitTextStroke: `1.2px ${item.color}`,
                WebkitTextStrokeWidth: "var(--stroke-width, 1.2px)",
                fontSize: "clamp(2rem, 3vw, 3.5rem)"
              } as React.CSSProperties}
              className="font-syne font-black tracking-tight uppercase whitespace-nowrap transition-all duration-300 group-hover:drop-shadow-[0_0_15px_var(--shadow-color)] group-hover:[--stroke-width:1.8px]"
              ref={(el) => {
                if (el) {
                  el.style.setProperty('--shadow-color', item.color);
                }
              }}
            >
              {item.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("frontend");
  const [categories, setCategories] = useState<any[]>([]);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/content`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const skillsItem = data.find(item => item.key === 'skills_data');
          if (skillsItem && skillsItem.value) {
            const parsed = JSON.parse(skillsItem.value);
            const withIcons = parsed.map((cat: any) => ({
              ...cat,
              skills: cat.skills.map((skill: any) => ({
                ...skill,
                icon: getSkillIcon(skill.iconName || skill.name)
              }))
            }));
            setCategories(withIcons);
            if (withIcons.length > 0) {
              setActiveCategory(withIcons[0].id);
            }
          }
        }
      })
      .catch(err => console.error("Error loading skills in client:", err));
  }, []);

  const activeCatData = categories.find(c => c.id === activeCategory);
  const allSkills = categories.flatMap(c => c.skills);

  const rowSize = Math.max(1, Math.ceil(allSkills.length / 4));
  const row1 = allSkills.slice(0, rowSize);
  const row2 = allSkills.slice(rowSize, rowSize * 2);
  const row3 = allSkills.slice(rowSize * 2, rowSize * 3);
  const row4 = allSkills.slice(rowSize * 3);

  return (
    <div className="relative w-full overflow-hidden mt-2 min-h-[520px] flex flex-col items-center justify-start py-4 md:py-6">
      {/* Background Scrolling Ticker Grid - NASDEQ / Apple Event Wall style */}
      {allSkills.length > 0 && (
        <div className="absolute inset-0 flex flex-col justify-center space-y-4 md:space-y-6 opacity-100 pointer-events-auto z-0 select-none overflow-hidden">
          {row1.length > 0 && <MarqueeRow items={row1} direction="left" speed={28} />}
          {row2.length > 0 && <MarqueeRow items={row2} direction="right" speed={38} />}
          {row3.length > 0 && <MarqueeRow items={row3} direction="left" speed={33} />}
          {row4.length > 0 && <MarqueeRow items={row4} direction="right" speed={42} />}
        </div>
      )}

      {/* Floating Gold Particles in Foreground */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <FloatingParticle delay={0} />
        <FloatingParticle delay={2} />
        <FloatingParticle delay={4.5} />
        <FloatingParticle delay={6} />
      </div>

      {/* Foreground Content - Centered Engineering Toolkit Card */}
      {categories.length > 0 && (
        <div className="relative z-20 w-full max-w-3xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6 md:p-10 pb-16 md:pb-20 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-[#D4AF37]/20 hover:shadow-[0_0_40px_rgba(212,175,55,0.06)] transition-all duration-500"
          >
            {/* Ambient Glow corner bubble */}
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-accent-pink/5 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-accent-blue/3 blur-[60px] pointer-events-none" />

            {/* Heading */}
            <div className="text-center space-y-2 mb-8 md:mb-10">
              <span className="font-mono text-[9px] text-[#D4AF37] tracking-widest uppercase font-semibold block">// STACK SHOWCASE</span>
              <h3 className="font-syne font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
                Engineering Toolkit
              </h3>
              <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto mt-2" />
            </div>

            {/* Categories Grid selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-8 border-b border-white/5 pb-6">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.15)]" 
                        : "border-white/5 bg-white/1 text-neutral-400 hover:text-white hover:border-white/15"
                    }`}
                  >
                    <span className="mb-1.5">{getCategoryIcon(category.iconName || category.id)}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider font-semibold">
                      {category.id === "ai" ? "AI & Auto" : category.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Staggered Skills Content grid */}
            {activeCatData && (
              <div className="min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <h4 className="font-display font-medium text-base text-neutral-200 text-center flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                      {activeCatData.title}
                    </h4>

                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-2">
                      {activeCatData.skills.map((skill: any, idx: number) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05, duration: 0.25 }}
                          className="group flex items-center gap-2.5 font-mono text-xs md:text-sm px-4 py-2.5 rounded-full border border-white/5 bg-white/5 text-neutral-200 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] cursor-default"
                        >
                          <div 
                            style={{ color: skill.color }}
                            className="transition-all duration-300 text-[24px] md:text-[32px] flex items-center justify-center group-hover:brightness-125 group-hover:drop-shadow-[0_0_8px_var(--shadow-color)]"
                            ref={(el) => {
                              if (el) el.style.setProperty('--shadow-color', skill.color);
                            }}
                          >
                            {skill.icon}
                          </div>
                          <span className="group-hover:text-[#D4AF37] transition-colors duration-300 font-semibold">{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Want to play memory game link */}
            <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8">
              <button
                onClick={() => setIsMemoryOpen(true)}
                className="font-syne transition-all duration-300 cursor-pointer flex flex-col items-end gap-1 group"
              >
                <span className="text-xs sm:text-sm md:text-base font-bold text-neutral-300 group-hover:text-[#D4AF37] transition-all duration-300">
                  Want to play a game
                </span>
                <span className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-bold text-[#D4AF37] underline decoration-[#D4AF37]/40 group-hover:decoration-[#D4AF37] group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] transition-all duration-300">
                  Click here
                  <span className="text-xs sm:text-sm md:text-lg no-underline inline-block">🎮</span>
                </span>
              </button>
            </div>

          </motion.div>
          
          <AnimatePresence>
            {isMemoryOpen && (
              <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto py-10 px-4 md:py-16 bg-black/85 backdrop-blur-xl">
                <div className="relative w-full max-w-xl bg-neutral-950 border border-white/10 p-4 sm:p-6 md:p-8 rounded-3xl my-auto shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                  <button 
                    onClick={() => setIsMemoryOpen(false)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-20 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                  <MemoryGame />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
