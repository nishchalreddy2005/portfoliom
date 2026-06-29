import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Award } from "lucide-react";
import { API_BASE } from "../config";
import { 
  SiReact, 
  SiNodedotjs, 
  SiMongodb, 
  SiTypescript, 
  SiGit, 
  SiEthereum 
} from "react-icons/si";
const FALLBACK_INSIGHTS = [
  {
    id: "ins-workshop",
    title: "Internshala Web Developer",
    image: "/assets/cert 1.png",
    issuer: "Internshala Trainings",
    year: "2024",
    type: "Professional Training",
    status: "Verified",
    duration: "6 Weeks",
    description: "Built production-ready frontend and web development skills using HTML, CSS, JavaScript, Bootstrap, React, REST APIs, and modern UI development practices.",
    skills: ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
    badges: ["✓ Verified", "Industry Credential", "Professional Training", "Completed"],
    order: 0
  },
  {
    id: "ins-future",
    title: "Aviatrix Multicloud Network",
    image: "/assets/cert-3.png",
    issuer: "Aviatrix",
    year: "2025",
    type: "Technical Certification",
    status: "Credential Active",
    duration: "Self-Paced",
    description: "Developed practical expertise in multicloud networking, cloud transit architectures, AWS connectivity, Azure integration, network security, and scalable cloud infrastructure design.",
    skills: ["Cloud Networking", "Multi-Cloud Security", "AWS/Azure Transit"],
    badges: ["✓ Verified", "Industry Credential", "Technical Certification", "Active"],
    order: 1
  },
  {
    id: "ins-create",
    title: "Mathworks Onramp",
    image: "/assets/cert-2.png",
    issuer: "MathWorks",
    year: "2024",
    type: "Academic Certification",
    status: "Completed",
    duration: "3 Weeks",
    description: "Strengthened MATLAB programming fundamentals, data visualization techniques, numerical computation workflows, and analytical problem-solving skills used in engineering applications.",
    skills: ["MATLAB Scripting", "Data Analysis", "Numerical Visualization"],
    badges: ["✓ Verified", "Academic Credential", "Academic Certification", "Completed"],
    order: 2
  }
];

const FLOATING_ICONS = [
  { icon: <SiReact />, top: "12%", left: "6%", delay: 0 },
  { icon: <SiNodedotjs />, top: "72%", left: "10%", delay: 2 },
  { icon: <SiMongodb />, top: "18%", right: "8%", delay: 1.5 },
  { icon: <SiTypescript />, top: "68%", right: "7%", delay: 3 },
  { icon: <SiGit />, top: "78%", left: "48%", delay: 4 },
  { icon: <SiEthereum />, top: "15%", left: "45%", delay: 0.5 }
];

export default function Insights() {
  const [items, setItems] = useState<any[]>(FALLBACK_INSIGHTS);
  const [activeIdx, setActiveIdx] = useState(0);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/insights`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.sort((a, b) => a.order - b.order));
        }
      })
      .catch(err => {
        console.error("Failed to fetch insights:", err);
      });
  }, []);

  // Keyboard navigation (<- and ->)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev + 1) % items.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % items.length);
  };

  const handleCardClick = (idx: number, id: string) => {
    // Instant click feedback
    setClickedId(id);
    setTimeout(() => setClickedId(null), 250);

    if (idx !== activeIdx) {
      setActiveIdx(idx);
    }
  };

  // Mouse 3D Tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, isCenter: boolean) => {
    if (!isCenter) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 8; // Max 8 degrees tilt
    const rotateY = ((x - centerX) / centerX) * 8; // Max 8 degrees tilt

    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
    card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  };

  return (
    <section
      id="insights"
      className="relative bg-primary-dark py-8 md:py-12 border-t border-white/5 overflow-hidden cursor-default flex flex-col justify-center min-h-[580px] md:min-h-[640px]"
    >
      {/* Custom CSS for Shimmer and custom aesthetics */}
      <style>{`
        @keyframes activeBorderShimmer {
          0% { border-color: rgba(255, 213, 79, 0.35); box-shadow: 0 0 20px rgba(255, 213, 79, 0.05); }
          50% { border-color: rgba(255, 213, 79, 0.75); box-shadow: 0 0 35px rgba(255, 213, 79, 0.2); }
          100% { border-color: rgba(255, 213, 79, 0.35); box-shadow: 0 0 20px rgba(255, 213, 79, 0.05); }
        }
        .active-card-shimmer {
          animation: activeBorderShimmer 9s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle background glow - Ambient Base */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FFD54F] rounded-full blur-[35px] opacity-[0.015] pointer-events-none z-0" />

      {/* WOW Moment #5: Background Glow Burst during card transitions */}
      <motion.div
        key={`glow-burst-${activeIdx}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.12, 0.015], scale: [0.8, 1.25, 1.0] }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FFD54F] rounded-full blur-[65px] pointer-events-none z-0"
      />

      {/* Floating background brand icons - Refined for ambient overlay */}
      {FLOATING_ICONS.map((item, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 6, 0]
          }}
          transition={{
            duration: 45 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay
          }}
          style={{
            position: "absolute",
            top: item.top,
            left: item.left,
            right: item.right,
          }}
          className="text-[60px] md:text-[90px] text-white pointer-events-none select-none z-0 opacity-[0.015] blur-xs hidden sm:block"
        >
          {item.icon}
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full flex flex-col justify-center">
        
        {/* Section Header */}
        <div className="text-center space-y-2 mb-4 md:mb-6 max-w-xl mx-auto">
          <span className="text-[10px] text-[#FFD54F] tracking-[0.2em] uppercase font-bold block">
            // CREDENTIALS & RECOGNITIONS
          </span>
          <h2 className="font-syne font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
            Certifications
          </h2>
          <p className="text-neutral-400 text-[11px] md:text-xs">
            Professional certifications, training programs, and technical achievements.
          </p>
        </div>

        {/* 3D Carousel container */}
        <div 
          ref={containerRef}
          className="relative w-full h-[570px] md:h-[645px] flex items-center justify-center overflow-visible mt-[-10px] sm:mt-[-25px] md:mt-[-35px] mb-4"
          style={{ perspective: "1800px", transformStyle: "preserve-3d" }}
        >
          {items.map((ins, idx) => {
            const details = ins;

            const isCenter = idx === activeIdx;
            const isClicked = clickedId === ins.id;
            
            // Calculate 3D transformation properties based on position relative to center
            const diff = (idx - activeIdx + items.length) % items.length;
            let offset = diff;
            if (offset > items.length / 2) {
              offset -= items.length;
            }
            const absOffset = Math.abs(offset);

            // 3D positioning coordinates based on cinematic visual specs
            let scale = 1;
            let rotateY = 0;
            let translateZ = 0;
            let translateX = 0;
            let opacity = 1;
            let yOffset = 0;

            if (isCenter) {
              scale = isClicked ? 1.05 : 1;
              rotateY = 0;
              translateZ = 0;
              translateX = 0;
              opacity = 1;
              yOffset = 0; // WOW Moment #4: Elevates from 15px -> 0 when active
            } else if (offset === -1) {
              scale = 0.85; // WOW Moment: Side cards 0.82–0.88 scale
              rotateY = 30;
              translateZ = -150;
              translateX = -385; // Spaced out
              opacity = 0.42; // Side card opacity 0.35–0.45
              yOffset = 15;
            } else if (offset === 1) {
              scale = 0.85;
              rotateY = -30;
              translateZ = -150;
              translateX = 385;
              opacity = 0.42;
              yOffset = 15;
            } else {
              scale = 0.55;
              rotateY = offset < 0 ? 45 : -45;
              translateZ = -350;
              translateX = offset < 0 ? -550 : 550;
              opacity = 0.15;
              yOffset = 15;
            }

            const zIndex = isCenter ? 25 : 10 - absOffset;

            // Only apply animation logic to center, previous, and next cards to keep frames consistent
            const isAnimatable = absOffset <= 1;

            // Helper for staggered sequential reveal (WOW Moment #7)
            const getRevealProps = (orderIndex: number) => {
              if (!isCenter) return {};
              return {
                key: `reveal-${orderIndex}-${activeIdx}`,
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { 
                  duration: 0.5, 
                  ease: "easeOut", 
                  delay: orderIndex * 0.1
                }
              };
            };

            return (
              <motion.div
                key={ins.id}
                style={{
                  zIndex,
                  transformStyle: "preserve-3d",
                  pointerEvents: "auto",
                  filter: isCenter ? "none" : "blur(2px) brightness(0.65)" // WOW Moment: 2px blur & brightness control
                }}
                animate={isAnimatable ? {
                  x: translateX,
                  y: yOffset,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                } : {
                  x: translateX,
                  y: yOffset,
                  z: translateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 120, // WOW Moment #8: Smoothsnapping spring physics
                  damping: 18,
                  mass: 1.0
                }}
                onClick={() => handleCardClick(idx, ins.id)}
                className={`absolute w-[310px] sm:w-[400px] md:w-[450px] h-[490px] sm:h-[540px] md:h-[585px] rounded-2xl border backdrop-blur-md transition-[filter,opacity,border-color,background-color,box-shadow] duration-500 ease-out select-none ${
                  isCenter 
                    ? "cursor-default border-[#FFD54F]/35 bg-white/4 shadow-[0_0_25px_rgba(255,213,79,0.08)] active-card-shimmer" // WOW Moment #9: Subtle Shimmer Animation
                    : "cursor-pointer hover:border-white/10 border-white/5 bg-white/2"
                } ${
                  isClicked ? "border-[#FFD54F] shadow-[0_0_30px_rgba(255,213,79,0.25)] bg-white/6" : ""
                }`}
              >
                {/* WOW Moment #6: Floating Gold Particles around the active card */}
                {isCenter && (
                  <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
                    {[...Array(4)].map((_, pIdx) => {
                      const startX = pIdx === 0 ? -12 : pIdx === 1 ? 108 : pIdx === 2 ? -6 : 106;
                      const startY = pIdx === 0 ? 8 : pIdx === 1 ? -12 : pIdx === 2 ? 104 : 92;
                      return (
                        <motion.div
                          key={`particle-${activeIdx}-${pIdx}`}
                          initial={{ opacity: 0, x: `${startX}%`, y: `${startY}%` }}
                          animate={{
                            opacity: [0, 0.35, 0],
                            x: [
                              `${startX}%`,
                              `${startX + (Math.random() * 8 - 4)}%`,
                              `${startX + (Math.random() * 8 - 4)}%`
                            ],
                            y: [
                              `${startY}%`,
                              `${startY + (Math.random() * 8 - 4)}%`,
                              `${startY + (Math.random() * 8 - 4)}%`
                            ],
                          }}
                          transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute w-1 h-1 bg-[#FFD54F] rounded-full shadow-[0_0_6px_#FFD54F]"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Gold Border Tracing SVG Animation (Active Activation Alternative) */}
                {isCenter && (
                  <svg
                    key={`border-trace-${activeIdx}`}
                    className="absolute inset-0 w-full h-full pointer-events-none z-30"
                  >
                    <motion.rect
                      x="1"
                      y="1"
                      rx="16"
                      style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
                      fill="none"
                      stroke="#FFD54F"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                      transition={{ 
                        pathLength: { duration: 0.9, ease: "easeInOut" },
                        opacity: { times: [0, 0.15, 0.75, 1], duration: 1.2, ease: "linear" }
                      }}
                    />
                  </svg>
                )}

                {/* 3D Hover Tilt container */}
                <div
                  onMouseMove={(e) => handleMouseMove(e, isCenter)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.15s ease-out"
                  }}
                  className="w-full h-full rounded-2xl overflow-hidden relative flex flex-col p-4 md:p-5 justify-between"
                >
                  {/* Dynamic glow reflection overlay */}
                  {isCenter && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-40 mix-blend-overlay z-10"
                      style={{
                        background: "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,213,79,0.15) 0%, transparent 60%)"
                      }}
                    />
                  )}

                  {/* Header Information (Top - 65% height) */}
                  <div className="space-y-4">
                    {/* Title - Reveal 1 */}
                    <motion.h3 
                      {...getRevealProps(0)}
                      className="font-syne font-black text-xl md:text-2xl text-white tracking-tight leading-snug"
                    >
                      {ins.title}
                    </motion.h3>

                    {/* Issuer & Verification Badge Area - Reveal 2 */}
                    <motion.div 
                      {...getRevealProps(1)}
                      className="space-y-2"
                    >
                      <div className="text-[11px] uppercase tracking-widest text-[#FFD54F] font-bold">
                        {details.issuer}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {details.badges && details.badges.map((badge, bIdx) => (
                          <motion.span 
                            key={`${ins.id}-badge-${bIdx}-${activeIdx}`}
                            initial={{ scale: 1 }}
                            animate={isCenter ? {
                              scale: [1, 1.08, 1],
                              boxShadow: ["0 0 0 rgba(255,213,79,0)", "0 0 10px rgba(255,213,79,0.35)", "0 0 0 rgba(255,213,79,0)"]
                            } : {}}
                            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 + bIdx * 0.05 }}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium bg-[#FFD54F]/5 text-[#FFD54F]/90 border border-[#FFD54F]/15 tracking-wide"
                          >
                            {badge === "✓ Verified" && <ShieldCheck className="w-2.5 h-2.5 text-[#FFD54F] mr-1 shrink-0" />}
                            {badge}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Premium Stat KPI Cards Block - Reveal 3 */}
                    <motion.div
                      {...getRevealProps(2)}
                      className="grid grid-cols-3 gap-2 w-full pt-1"
                    >
                      <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-white/2 hover:border-[#FFD54F]/30 hover:bg-[#FFD54F]/2 transition-all duration-300 relative group/stat shadow-xs">
                        <span className="text-[8px] text-neutral-500 tracking-wider mb-1 block uppercase">Type</span>
                        <span className="font-sans font-bold text-[9px] sm:text-[10px] md:text-[11px] text-white text-center line-clamp-2 leading-tight group-hover/stat:text-[#FFD54F] group-hover/stat:drop-shadow-[0_0_8px_rgba(255,213,79,0.4)] transition-all">
                          {details.type}
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-white/2 hover:border-[#FFD54F]/30 hover:bg-[#FFD54F]/2 transition-all duration-300 relative group/stat shadow-xs">
                        <span className="text-[8px] text-neutral-500 tracking-wider mb-1 block uppercase">Duration</span>
                        <span className="font-sans font-bold text-[9px] sm:text-[10px] md:text-[11px] text-white text-center line-clamp-2 leading-tight group-hover/stat:text-[#FFD54F] group-hover/stat:drop-shadow-[0_0_8px_rgba(255,213,79,0.4)] transition-all">
                          {details.duration}
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-white/5 bg-white/2 hover:border-[#FFD54F]/30 hover:bg-[#FFD54F]/2 transition-all duration-300 relative group/stat shadow-xs">
                        <span className="text-[8px] text-neutral-500 tracking-wider mb-1 block uppercase">Year</span>
                        <span className="font-sans font-bold text-[9px] sm:text-[10px] md:text-[11px] text-white text-center line-clamp-2 leading-tight group-hover/stat:text-[#FFD54F] group-hover/stat:drop-shadow-[0_0_8px_rgba(255,213,79,0.4)] transition-all">
                          {details.year}
                        </span>
                      </div>
                    </motion.div>

                    {/* Description - Reveal 4 */}
                    <motion.p 
                      {...getRevealProps(3)}
                      className="text-[11px] md:text-xs text-neutral-300/90 leading-relaxed line-clamp-3 pt-1"
                    >
                      {details.description}
                    </motion.p>

                    {/* Skills Acquired - Reveal 5 */}
                    <motion.div 
                      {...getRevealProps(4)}
                      className="space-y-2 pt-2 border-t border-white/5"
                    >
                      <span className="text-[9px] text-neutral-500 tracking-widest block uppercase font-bold">SKILLS ACQUIRED</span>
                      <div className="flex flex-wrap gap-x-3.5 gap-y-2.5">
                        {details.skills.map((skill) => (
                          <span 
                            key={skill} 
                            className="h-7 px-3.5 flex items-center justify-center rounded bg-white/5 text-neutral-300 border border-white/5 font-semibold text-[10px] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FFD54F]/40 hover:shadow-[0_0_10px_rgba(255,213,79,0.12)] hover:text-white"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Certificate Preview Image (Bottom - Supporting Content 30-35% height) */}
                  <div className="h-[120px] sm:h-[135px] md:h-[150px] w-full overflow-hidden relative rounded-xl border border-white/5 bg-neutral-950/80 shrink-0 mt-3">
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent z-10" />
                    
                    {/* WOW Moment #2: LUXURY GLASS SHINE animation over the certificate image */}
                    {isCenter && (
                      <motion.div
                        key={`image-shine-${activeIdx}`}
                        initial={{ left: "-150%" }}
                        animate={{ left: "150%" }}
                        transition={{ duration: 1.0, ease: "easeInOut", delay: 0.1 }}
                        className="absolute top-0 bottom-0 w-[60px] bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-25 pointer-events-none z-20"
                      />
                    )}

                    <img
                      src={ins.image}
                      alt={ins.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isCenter 
                          ? "saturate-50 opacity-65 group-hover:saturate-100 group-hover:opacity-100" 
                          : "saturate-50 opacity-35"
                      }`}
                    />
                    
                    {/* Premium subtle icon on image */}
                    {isCenter && (
                      <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 z-20">
                        <Award className="w-3.5 h-3.5 text-[#FFD54F]" />
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Navigation and Indicators */}
        <div className="mt-4 flex flex-col items-center justify-center space-y-4 relative z-20">
          
          {/* Segmented Tab Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-white/5 bg-white/2 text-neutral-400 hover:text-[#FFD54F] hover:border-[#FFD54F]/30 hover:bg-[#FFD54F]/5 transition-all duration-300 cursor-pointer shadow-xs"
              aria-label="Previous Certificate"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Segmented Tab container */}
            <div className="bg-neutral-950/60 border border-white/5 p-1.5 rounded-full flex items-center gap-2 relative backdrop-blur-md">
              {items.map((ins, idx) => {
                const isAct = idx === activeIdx;
                const name = ins.title.split(" ")[0]; // Internshala, Aviatrix, Mathworks
                return (
                  <motion.button
                    key={ins.id}
                    onClick={() => setActiveIdx(idx)}
                    whileHover={{ scale: isAct ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative px-5 py-2.5 rounded-full text-[10px] tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer ${
                      isAct 
                        ? "text-[#FFD54F] border border-[#FFD54F]/50 shadow-[0_0_15px_rgba(255,213,79,0.15)] bg-[#FFD54F]/5"
                        : "text-neutral-400 bg-white/1 hover:bg-white/4 border border-white/5 hover:border-white/10 hover:text-neutral-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {isAct && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-1.5 left-5 right-5 h-[1.5px] bg-[#FFD54F] rounded-full shadow-[0_0_8px_rgba(255,213,79,0.8)]"
                        transition={{ type: "spring", stiffness: 220, damping: 24 }}
                      />
                    )}
                    {/* WOW Moment #10: Slide-in active label text layout transitions */}
                    <motion.span 
                      layout
                      className="relative z-10 block"
                      animate={{ color: isAct ? "#FFD54F" : "#a3a3a3" }}
                    >
                      {name}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-white/5 bg-white/2 text-neutral-400 hover:text-[#FFD54F] hover:border-[#FFD54F]/30 hover:bg-[#FFD54F]/5 transition-all duration-300 cursor-pointer shadow-xs"
              aria-label="Next Certificate"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick interactive tip */}
          <span className="text-[9px] text-neutral-500 tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3 h-3 text-[#FFD54F]/50" /> Use Arrow keys ← → or click navigation tabs to browse
          </span>

        </div>

      </div>
    </section>
  );
}
