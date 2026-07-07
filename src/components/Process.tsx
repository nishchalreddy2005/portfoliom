import { useState, useEffect, useRef } from "react";
import { CheckCircle, ArrowUpRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from 'axios';
import { API_BASE } from "../config";

interface ProcessStep {
  id: string;
  num: string;
  title: string;
  description: string;
  details: string[];
  metrics?: string[];
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  paperUrl?: string;
}

export default function Process() {
  const [activeStepIdx, setActiveStepIdx] = useState(0); // Default to first project
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  const [offsetY, setOffsetY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      const activeCard = cardRefs.current[activeStepIdx];
      const listContainer = listRef.current;
      if (activeCard && listContainer) {
        const activeRect = activeCard.getBoundingClientRect();
        const listRect = listContainer.getBoundingClientRect();
        setOffsetY(activeRect.top - listRect.top);
      }
    } else {
      setOffsetY(0);
    }
  }, [activeStepIdx, processSteps, isDesktop]);

  useEffect(() => {
    const fetchProjects = () => {
      axios.get(`${API_BASE}/api/projects`)
        .then(response => {
          const data = response.data.map((proj: any, idx: number) => ({
            id: proj.id,
            num: `0${idx + 1}`,
            title: proj.title,
            description: proj.description,
            details: proj.tags || [],
            metrics: proj.metrics || [],
            image: proj.image,
            demoUrl: proj.demoUrl || undefined,
            githubUrl: proj.githubUrl || undefined,
            paperUrl: proj.paperUrl || undefined,
          }));
          setProcessSteps(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching projects:", error);
          setLoading(false);
        });
    };

    fetchProjects();

    window.addEventListener('refetchPortfolioData', fetchProjects);
    const interval = setInterval(fetchProjects, 10000);

    return () => {
      window.removeEventListener('refetchPortfolioData', fetchProjects);
      clearInterval(interval);
    };
  }, []);

  if (loading) return null;
  if (processSteps.length === 0) return null;

  return (
    <section
      id="projects"
      className="relative bg-primary-dark py-16 md:py-24 border-t border-white/5 cursor-default"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 pb-8">
          <div>
            <span className="font-mono text-[10px] text-accent-pink tracking-widest uppercase block">// SELECTED CREATIONS</span>
            <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mt-1">
              Projects
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold text-accent-pink">
              0{activeStepIdx + 1}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="font-mono text-xs text-neutral-400">
              0{processSteps.length} CREATIONS
            </span>
          </div>
        </div>

        {/* Visual Workflow split layout */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative transition-all duration-500 ease-[0.16,1,0.3,1]"
          style={isDesktop ? { minHeight: `${offsetY + 460}px` } : {}}
        >
          
          {/* Left Column: Vertical workflow steps navigator */}
          <div ref={listRef} className="lg:col-span-5 flex flex-col space-y-4">
            {processSteps.map((step, idx) => {
              const isSelected = activeStepIdx === idx;
              return (
                <div
                  key={step.id}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`w-full text-left p-6 rounded-xl transition-all duration-300 flex items-start gap-4 cursor-pointer focus:outline-none relative ${
                    isSelected
                      ? "glass-card"
                      : "bg-transparent border border-transparent hover:bg-white/1"
                  }`}
                >
                  <span className={`font-mono text-xs px-2.5 py-1 rounded bg-white/5 shrink-0 ${
                    isSelected ? "text-accent-pink border border-accent-pink/20 bg-accent-pink/5" : "text-neutral-500"
                  }`}>
                    {step.num}
                  </span>

                  <div className="space-y-2 text-left w-full">
                    <h3 className={`font-display font-medium text-lg leading-relaxed ${
                      isSelected ? "text-white" : "text-neutral-400"
                    }`}>
                      {step.title}
                    </h3>
                    {isSelected && (
                      <div className="space-y-3 pt-1 animate-fade-in">
                        <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                          {step.description}
                        </p>
                        {step.metrics && step.metrics.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 pt-3 pb-2 border-t border-white/5">
                            {step.metrics.map((metric, mIdx) => {
                              const parts = metric.split(" ");
                              const value = parts[0];
                              const label = parts.slice(1).join(" ");
                              return (
                                <div key={mIdx} className="bg-white/5 border border-white/5 rounded-lg p-2.5 flex flex-col justify-center text-left">
                                  <span className="text-[10px] font-syne font-black text-[#FFD54F] tracking-wider">{value}</span>
                                  <span className="text-[8px] text-neutral-400 uppercase tracking-widest mt-0.5 leading-none">
                                    {label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 pt-1">
                          {(() => {
                            const hasDemo = step.demoUrl && step.demoUrl !== "#" && step.demoUrl.trim() !== "";
                            const hasGithub = step.githubUrl && step.githubUrl !== "#" && step.githubUrl.trim() !== "";
                            const hasPaper = step.paperUrl && step.paperUrl !== "#" && step.paperUrl.trim() !== "";

                            if (!hasDemo && !hasGithub && !hasPaper) {
                              return (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUnavailableModal(true);
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-neutral-500 hover:text-white uppercase pt-1 border-b border-neutral-700 hover:border-white transition-all duration-300 w-fit cursor-pointer"
                                >
                                  No Links Available <ArrowUpRight className="h-3 w-3 shrink-0" />
                                </button>
                              );
                            }

                            return (
                              <>
                                {hasDemo && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(step.demoUrl, "_blank", "noopener,noreferrer");
                                    }}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-accent-pink hover:text-white uppercase pt-1 border-b border-accent-pink/30 hover:border-white transition-all duration-300 w-fit cursor-pointer"
                                  >
                                    View Live Project <ArrowUpRight className="h-3 w-3 shrink-0" />
                                  </button>
                                )}
                                {hasGithub && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(step.githubUrl, "_blank", "noopener,noreferrer");
                                    }}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-neutral-400 hover:text-white uppercase pt-1 border-b border-neutral-700 hover:border-white transition-all duration-300 w-fit cursor-pointer"
                                  >
                                    View Git Repo <ArrowUpRight className="h-3 w-3 shrink-0" />
                                  </button>
                                )}
                                {hasPaper && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(step.paperUrl, "_blank", "noopener,noreferrer");
                                    }}
                                    className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-accent-blue hover:text-white uppercase pt-1 border-b border-accent-blue/30 hover:border-white transition-all duration-300 w-fit cursor-pointer"
                                  >
                                    View Conference Paper <ArrowUpRight className="h-3 w-3 shrink-0" />
                                  </button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual display matching current active indexing step (Desktop only) */}
          <div 
            className="hidden lg:flex lg:col-span-7 flex-col items-center"
            style={isDesktop ? {
              transform: `translateY(${offsetY}px)`,
              transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform'
            } : {}}
          >
            <div className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden glass-card flex items-center justify-center">
              
              {/* Overlay graphics */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent pointer-events-none z-10" />
              
              <img
                src={processSteps[activeStepIdx]?.image}
                alt={processSteps[activeStepIdx]?.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out saturate-50 hover:saturate-100"
              />

              {/* Detailed specification list overlays */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {processSteps[activeStepIdx]?.details.map((detail, dIdx) => (
                    <span
                      key={dIdx}
                      className="font-mono text-[9px] bg-black/80 backdrop-blur-md border border-white/10 text-neutral-300 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="h-3 w-3 text-accent-pink shrink-0" /> {detail}
                    </span>
                  ))}
                </div>
                
                <span className="font-mono text-[9px] text-neutral-500 bg-black/50 backdrop-blur-sm px-2 py-1 rounded uppercase border border-white/5 hidden xs:block">
                  {(processSteps[activeStepIdx]?.demoUrl && processSteps[activeStepIdx]?.demoUrl !== "#") ? "LIVE SYSTEM" : "ARCHIVED PROJECT"}
                </span>
              </div>
            </div>

            {/* Quick pagination arrows */}
            <div className="flex justify-between items-center w-full mt-6 text-xs text-neutral-400 font-mono">
              <button
                onClick={() => setActiveStepIdx((prev) => (prev > 0 ? prev - 1 : processSteps.length - 1))}
                className="hover:text-white transition-colors cursor-pointer"
              >
                ← PREV CREATION
              </button>
              <div className="flex gap-1.5">
                {processSteps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      activeStepIdx === i ? "bg-accent-pink w-4" : "bg-neutral-700"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveStepIdx((prev) => (prev < processSteps.length - 1 ? prev + 1 : 0))}
                className="hover:text-white transition-colors cursor-pointer"
              >
                NEXT CREATION →
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Alert Popup */}
      <AnimatePresence>
        {showUnavailableModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowUnavailableModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-white/10 p-6 md:p-8 rounded-2xl max-w-sm w-full text-center relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-accent-pink/10 border border-accent-pink/20 flex items-center justify-center mb-4 text-accent-pink">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="font-syne font-bold text-lg text-white mb-2">Link Unavailable</h3>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                This project link has not been published yet or is currently offline. Please check back later!
              </p>
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="w-full bg-white text-black font-mono text-xs uppercase tracking-widest py-3 rounded-lg hover:bg-accent-pink hover:text-white transition-colors duration-300 font-bold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
