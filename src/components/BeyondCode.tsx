import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Users, X, Trophy, UserCheck, Medal, Sparkles } from "lucide-react";
import { API_BASE } from "../config";

interface Achievement {
  id: string;
  tag: string;
  headline: string;
  subHeadline?: string;
  description: string;
  category: string;
  skills: string[];
  impact: string;
  iconName: string;
  bgPattern: string;
  stats: string[];
  accentColor: string;
  shadowColor: string;
  order: number;
}

const getIcon = (iconName: string, accentColor: string) => {
  switch (iconName) {
    case "Trophy":
      return <Trophy className="h-7 w-7" style={{ color: accentColor }} />;
    case "Medal":
      return <Medal className="h-7 w-7" style={{ color: accentColor }} />;
    case "Users":
      return <Users className="h-6 w-6" style={{ color: accentColor }} />;
    case "UserCheck":
      return <UserCheck className="h-6 w-6" style={{ color: accentColor }} />;
    default:
      return <Trophy className="h-7 w-7" style={{ color: accentColor }} />;
  }
};

const getGridClass = (index: number) => {
  if (index === 0) return "col-span-12 lg:col-span-8 min-h-[380px] lg:min-h-[400px]";
  if (index === 1) return "col-span-12 lg:col-span-4 min-h-[380px] lg:min-h-[400px]";
  return "col-span-12 lg:col-span-6 min-h-[300px]";
};

// Background Pattern Renderer (<5% Opacity)
const renderPattern = (pattern: string, isHovered: boolean = false) => {
  switch (pattern) {
    case "track":
      return (
        <svg className="absolute inset-0 w-full h-full text-white/3 pointer-events-none transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,50 C100,200 200,-100 500,250 M-100,85 C100,235 200,-65 500,285 M-100,120 C100,270 200,-30 500,320 M-100,155 C100,305 200,5 500,355 M-100,190 C100,340 200,40 500,390" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M50,-100 L450,400 M100,-100 L500,400" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6,6" />
        </svg>
      );
    case "pitch":
      return (
        <svg className="absolute inset-0 w-full h-full text-white/2.5 pointer-events-none transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
          <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50%" cy="50%" r="60" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50%" cy="50%" r="3" fill="currentColor" />
          <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="currentColor" strokeWidth="1.5" />
          <rect x="5%" y="30%" width="12%" height="40%" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="83%" y="30%" width="12%" height="40%" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 5, 20 A 15,15 0 0,0 20,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 95, 20 A 15,15 0 0,1 80,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "network":
    default:
      return (
        <svg className="absolute inset-0 w-full h-full text-white/3 pointer-events-none transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
          <motion.circle cx="20%" cy="25%" r="4" fill="currentColor" animate={isHovered ? { r: [4, 7, 4] } : {}} transition={{ repeat: Infinity, duration: 2 }} />
          <motion.circle cx="45%" cy="75%" r="5" fill="currentColor" animate={isHovered ? { r: [5, 8, 5] } : {}} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} />
          <motion.circle cx="75%" cy="35%" r="4" fill="currentColor" animate={isHovered ? { r: [4, 7, 4] } : {}} transition={{ repeat: Infinity, duration: 2, delay: 1 }} />
          <motion.circle cx="85%" cy="80%" r="6" fill="currentColor" animate={isHovered ? { r: [6, 9, 6] } : {}} transition={{ repeat: Infinity, duration: 3 }} />
          <motion.circle cx="10%" cy="85%" r="3" fill="currentColor" />
          <motion.circle cx="90%" cy="15%" r="3" fill="currentColor" />
          <line x1="20%" y1="25%" x2="45%" y2="75%" stroke="currentColor" strokeWidth="1" />
          <line x1="45%" y1="75%" x2="75%" y2="35%" stroke="currentColor" strokeWidth="1" />
          <line x1="75%" y1="35%" x2="85%" y2="80%" stroke="currentColor" strokeWidth="1" />
          <line x1="20%" y1="25%" x2="75%" y2="35%" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="10%" y1="85%" x2="45%" y2="75%" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4,4" />
          <line x1="75%" y1="35%" x2="90%" y2="15%" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4,4" />
        </svg>
      );
  }
};

interface AchievementCardProps {
  key?: string;
  item: Achievement;
  index: number;
  onSelect: (id: string) => void;
}

function AchievementCard({ item, index, onSelect }: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const gridClass = getGridClass(index);

  return (
    <motion.div
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -8,
        borderColor: `${item.accentColor}50`,
        boxShadow: `0 15px 40px ${item.shadowColor || 'rgba(255,255,255,0.05)'}`
      }}
      className={`${gridClass} group relative rounded-3xl border border-white/5 bg-white/2 backdrop-blur-xl p-8 sm:p-10 flex flex-col justify-between overflow-hidden cursor-pointer hover:bg-white/4 transition-all duration-300`}
    >
      {/* Radial Glow Highlight */}
      <div 
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${item.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Shine Sweep Effect for Medals */}
      {(item.iconName === "Trophy" || item.iconName === "Medal") && (
        <div 
          className="absolute inset-0 w-[200%] h-full -translate-x-full group-hover:animate-shine pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 30%, ${item.accentColor}15 45%, ${item.accentColor}30 50%, ${item.accentColor}15 55%, transparent 70%)`
          }}
        />
      )}

      {/* Background SVG Pattern */}
      {renderPattern(item.bgPattern, isHovered)}

      {/* Top Info Area */}
      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-start">
          <span 
            className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border bg-black/40 backdrop-blur-md"
            style={{ 
              color: item.accentColor,
              borderColor: `${item.accentColor}25`
            }}
          >
            {item.tag}
          </span>
          <motion.div 
            className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all duration-300 text-white"
            animate={item.iconName === "Users" && isHovered ? { rotate: 360 } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {getIcon(item.iconName, item.accentColor)}
          </motion.div>
        </div>

        <div className="space-y-2">
          {item.subHeadline && (
            <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase block font-semibold">
              {item.subHeadline}
            </span>
          )}
          <h3 
            className="font-syne font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight transition-colors duration-300"
            style={{ 
              color: isHovered ? item.accentColor : "#FFFFFF"
            }}
          >
            {item.headline}
          </h3>
        </div>
      </div>

      {/* Bottom Stats & Description Area */}
      <div className="mt-8 space-y-6 relative z-10">
        <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
          {item.description}
        </p>

        {/* Dynamic Achievement Stats Row */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {item.stats.map((stat, sIdx) => (
            <span 
              key={sIdx} 
              className="text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded bg-white/5 border border-white/5 text-neutral-300 font-semibold"
            >
              {stat}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function BeyondCode() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/achievements`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort by order asc
          const sorted = data.sort((a, b) => (a.order || 0) - (b.order || 0));
          setAchievements(sorted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading achievements:", err);
        setLoading(false);
      });
  }, []);

  const activeAchievement = achievements.find(a => a.id === selectedId);

  if (loading) {
    return (
      <section className="bg-primary-dark py-20 border-t border-white/5 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="h-6 w-6 text-[#FFD54F] animate-pulse" />
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">Loading achievements...</span>
        </div>
      </section>
    );
  }

  if (achievements.length === 0) return null;

  return (
    <section
      id="achievements-leadership"
      className="relative bg-primary-dark py-20 md:py-28 border-t border-white/5 cursor-default overflow-hidden"
    >
      {/* Stadium Light Glow Backdrops */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-radial from-[#FFD54F]/3 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-radial from-[#60A5FA]/2 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-4 mb-16 text-left">
          <span className="font-mono text-[10px] text-accent-pink tracking-widest uppercase block">// EXTRACURRICULAR ARCHIVE</span>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight">
            Achievements & Leadership
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl font-light leading-relaxed">
            Pursuits that shaped my discipline, teamwork, and competitive mindset beyond software development.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-5 md:gap-6 items-stretch">
          {achievements.map((item, index) => (
            <AchievementCard
              key={item.id}
              item={item}
              index={index}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        {/* Big Premium Quote Block */}
        <div className="mt-24 text-center max-w-4xl mx-auto relative px-4">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white/5 font-syne text-9xl select-none font-bold">
            “
          </div>
          <p className="font-syne font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral-200 tracking-tight leading-relaxed relative z-10">
            "Discipline is built on the track. Leadership is built on the field. Engineering is built through consistency."
          </p>
          <div className="w-16 h-[2px] bg-linear-to-r from-transparent via-[#FFD54F]/55 to-transparent mx-auto mt-8" />
        </div>

      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedId && activeAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-neutral-950 border p-6 sm:p-8 md:p-10 rounded-3xl max-w-xl w-full relative overflow-hidden"
              style={{
                borderColor: `${activeAchievement.accentColor}30`,
                boxShadow: `0 0 60px ${activeAchievement.shadowColor || 'rgba(255,255,255,0.05)'}`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pattern Background overlay */}
              <div className="absolute inset-0 opacity-5">
                {renderPattern(activeAchievement.bgPattern, true)}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-5 right-5 text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full transition-colors z-20 cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="relative z-10 space-y-6">
                
                {/* Header info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div 
                      className="p-3.5 rounded-2xl border"
                      style={{ 
                        backgroundColor: `${activeAchievement.accentColor}10`,
                        borderColor: `${activeAchievement.accentColor}25`,
                        color: activeAchievement.accentColor
                      }}
                    >
                      {getIcon(activeAchievement.iconName, activeAchievement.accentColor)}
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-widest uppercase block" style={{ color: activeAchievement.accentColor }}>
                        {activeAchievement.tag}
                      </span>
                      <h3 className="font-syne font-bold text-xl sm:text-2xl text-white mt-1 leading-snug">
                        {activeAchievement.headline}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Summary</span>
                  <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
                    {activeAchievement.description}
                  </p>
                </div>

                {/* Impact Statement */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Experience & Impact</span>
                  <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                    {activeAchievement.impact}
                  </p>
                </div>

                {/* Skills Developed */}
                <div className="space-y-2.5 border-t border-white/5 pt-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest block font-bold" style={{ color: activeAchievement.accentColor }}>
                    Skills Developed
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeAchievement.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-neutral-300 hover:text-white transition-all cursor-default"
                      >
                        • {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
