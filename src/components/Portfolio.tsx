import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, FolderOpen, Tag, Layers, Github, ExternalLink, Award } from "lucide-react";
import { PROJECTS } from "../data";
import { Project } from "../types";

export default function Portfolio() {
  const [filter, setFilter] = useState("All");

  const filterCategories = ["All", "AI", "Blockchain", "Full Stack", "Enterprise", "Academic"];

  // Match categories
  const filteredProjects = PROJECTS.filter((proj) => {
    if (filter === "All") return true;
    return proj.category.toLowerCase() === filter.toLowerCase();
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "ai":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "blockchain":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "full stack":
        return "bg-[#FFD54F]/10 text-[#FFD54F] border border-[#FFD54F]/20";
      case "enterprise":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "academic":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      default:
        return "bg-white/5 text-neutral-300 border border-white/10";
    }
  };

  return (
    <section
      id="works"
      className="relative bg-primary-dark py-16 md:py-24 border-t border-white/5 cursor-default"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-accent-pink tracking-widest uppercase block">// ARCHIVE</span>
            <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight shrink-0">
              Selected Works
            </h2>
            <p className="text-neutral-400 text-xs md:text-sm max-w-lg font-light leading-relaxed">
              An interactive archive of applications spanning Artificial Intelligence, Cybersecurity, Blockchain dApps, and Full-Stack enterprise architectures.
            </p>
          </div>

          {/* Inline Filter pills */}
          <div className="flex flex-wrap items-center gap-2 border border-white/10 p-1.5 rounded-full bg-white/2">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  filter === cat
                    ? "bg-white text-black font-semibold shadow-md"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Project grid layout with AnimatePresence */}
        <motion.div
          id="project-items-grid"
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: Project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`interactive-card group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-500
                  ${project.featured 
                    ? "md:col-span-2 border-[#FFD54F]/25 bg-white/2 md:flex-row hover:border-[#FFD54F]/50 shadow-[0_0_50px_rgba(255,213,79,0.03)] hover:shadow-[0_0_50px_rgba(255,213,79,0.08)]" 
                    : "border-white/5 bg-white/1 hover:border-white/15"
                  }`}
              >
                
                {/* Image Container with zoom scale */}
                <div className={`relative overflow-hidden bg-neutral-900 border-b md:border-b-0 border-white/5 shrink-0
                  ${project.featured ? "h-[220px] sm:h-[280px] md:h-auto md:w-[42%] md:border-r" : "h-[220px] sm:h-[260px] w-full"}`}
                >
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 z-10" />
                  
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-105 saturate-95 group-hover:saturate-110"
                  />

                  {/* Project metadata pills over visual card */}
                  <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[90%]">
                    <span className="font-mono text-[8px] bg-black/75 backdrop-blur-md border border-white/10 text-neutral-300 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                      {project.year}
                    </span>
                    <span className={`font-mono text-[8px] backdrop-blur-md px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 font-bold ${getCategoryBadgeClass(project.category)}`}>
                      <Tag className="h-2 w-2" /> {project.category}
                    </span>
                  </div>

                  {/* Featured Flagship Tag */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="font-syne text-[8px] bg-[#FFD54F] text-black font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 shadow-md">
                        <Award className="h-2.5 w-2.5 fill-black" /> Flagship Project
                      </span>
                    </div>
                  )}
                </div>

                {/* Text overlay details block */}
                <div className="p-6 flex flex-col grow justify-between gap-5 text-left">
                  <div className="space-y-3">
                    
                    {/* Display badges for featured project */}
                    {project.featured && project.badges && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.badges.map((badge, bIdx) => (
                          <span key={bIdx} className="text-[8px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-neutral-400 px-2 py-0.5 rounded-md">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <FolderOpen className="h-3 w-3 text-neutral-500 shrink-0" />
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest leading-none">
                          System : {project.client}
                        </span>
                      </div>

                      <h3 className={`font-syne font-black uppercase text-white transition-colors tracking-wide leading-tight group-hover:text-[#FFD54F]
                        ${project.featured ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}>
                        {project.title.split(" — ")[0]}
                      </h3>
                    </div>

                    <p className="text-neutral-400 text-xs font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Display achievement metrics grid for featured projects */}
                    {project.featured && project.metrics && (
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                        {project.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="bg-white/5 border border-white/5 rounded-lg p-2.5 flex flex-col justify-center">
                            <span className="text-[10px] font-syne font-black text-[#FFD54F] tracking-wider">{metric.split(" ")[0]}</span>
                            <span className="text-[8px] text-neutral-400 uppercase tracking-widest mt-0.5 leading-none">
                              {metric.split(" ").slice(1).join(" ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3.5 mt-auto">
                    {/* Tag List */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/5">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[8.5px] font-mono text-neutral-400 border border-white/5 px-2 py-0.5 rounded bg-white/2 hover:text-[#FFD54F] hover:border-[#FFD54F]/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons (GitHub / Live Link) */}
                    <div className="flex items-center gap-4 pt-1">
                      {project.githubUrl && project.githubUrl !== "#" && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-mono font-bold text-neutral-400 hover:text-[#FFD54F] flex items-center gap-1 transition-all hover:translate-x-0.5 uppercase tracking-wider"
                        >
                          <Github className="h-3 w-3 shrink-0" />
                          <span>Code repository</span>
                          <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      )}
                      
                      {project.demoUrl && project.demoUrl !== "#" && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-mono font-bold text-[#FFD54F] hover:text-white flex items-center gap-1 transition-all hover:translate-x-0.5 uppercase tracking-wider"
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span>Live deployment</span>
                          <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty matching banner */}
        {filteredProjects.length === 0 && (
          <div className="py-16 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2">
            <Layers className="h-4 w-4 animate-bounce" /> No matching project archives found.
          </div>
        )}

      </div>
    </section>
  );
}
