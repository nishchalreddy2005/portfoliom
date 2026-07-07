import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, Clock, CheckCircle } from "lucide-react";
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

interface Card {
  id: number;
  name: string;
  icon: React.ReactNode;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const getSkillIcon = (iconName: string): React.ReactNode => {
  const norm = (iconName || '').toLowerCase().replace(/[\s\.\-\_]/g, "");
  switch (norm) {
    case "react": return <SiReact size={24} />;
    case "typescript": return <SiTypescript size={24} />;
    case "javascript": return <SiJavascript size={24} />;
    case "tailwind":
    case "tailwindcss": return <SiTailwindcss size={24} />;
    case "nodejs": return <SiNodedotjs size={24} />;
    case "express":
    case "expressjs": return <SiExpress size={24} />;
    case "mongodb": return <SiMongodb size={24} />;
    case "mysql": return <SiMysql size={24} />;
    case "solidity": return <SiSolidity size={24} />;
    case "ethereum": return <SiEthereum size={24} />;
    case "hardhat": return <SiEthereum size={24} />;
    case "metamask": return <SiEthereum size={24} />;
    case "openai": return <SiOpenai size={24} />;
    case "git": return <SiGit size={24} />;
    case "github": return <SiGithub size={24} />;
    case "vscode": return <VscVscode size={24} />;
    case "postman": return <SiPostman size={24} />;
    case "python": return <SiPython size={24} />;
    case "c++":
    case "cpp": return <SiCplusplus size={24} />;
    case "c": return <SiC size={24} />;
    case "java": return <FaJava size={24} />;
    case "rust": return <SiRust size={24} />;
    case "docker": return <SiDocker size={24} />;
    case "kubernetes": return <SiKubernetes size={24} />;
    case "aws":
    case "amazonwebservices": return <FaAws size={24} />;
    case "gcp":
    case "googlecloud": return <SiGooglecloud size={24} />;
    case "firebase": return <SiFirebase size={24} />;
    case "supabase": return <SiSupabase size={24} />;
    case "framer":
    case "framermotion": return <SiFramer size={24} />;
    case "next":
    case "nextjs": return <SiNextdotjs size={24} />;
    case "vite": return <SiVite size={24} />;
    case "graphql": return <SiGraphql size={24} />;
    case "prisma": return <SiPrisma size={24} />;
    case "redux": return <SiRedux size={24} />;
    case "html":
    case "html5": return <SiHtml5 size={24} />;
    case "css":
    case "css3": return <SiCss size={24} />;
    case "sass": return <SiSass size={24} />;
    default: return <Sparkles className="h-5 w-5" />;
  }
};

const FALLBACK_SKILLS = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#FFFFFF" },
  { name: "Node.js", color: "#339933" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "MongoDB", color: "#47A248" },
  { name: "SQL", color: "#4479A1" },
  { name: "Solidity", color: "#AAAEB0" },
  { name: "Python", color: "#3776AB" },
  { name: "AI", color: "#10A37F" },
  { name: "Blockchain", color: "#627EEA" },
  { name: "Tailwind CSS", color: "#06B6D4" },
  { name: "Express.js", color: "#E0E0E0" }
];

export default function MemoryGame() {
  const [dbSkills, setDbSkills] = useState<{ name: string; color: string; iconName?: string }[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; scale: number; tx: number; ty: number }[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load skills from database
  useEffect(() => {
    const fetchSkillsForGame = () => {
      fetch(`${API_BASE}/api/content`)
        .then(res => res.json())
        .then((data: any[]) => {
          if (Array.isArray(data)) {
            const skillsItem = data.find(item => item.key === 'skills_data');
            if (skillsItem && skillsItem.value) {
              const parsed = JSON.parse(skillsItem.value);
              // Flatten all skills across categories
              const allSkills = parsed.flatMap((cat: any) => cat.skills || []);
              if (allSkills.length > 0) {
                setDbSkills(allSkills);
              }
            }
          }
        })
        .catch(err => console.error("Error loading skills in Memory Game:", err));
    };

    fetchSkillsForGame();

    window.addEventListener('refetchPortfolioData', fetchSkillsForGame);
    const interval = setInterval(fetchSkillsForGame, 10000);

    return () => {
      window.removeEventListener('refetchPortfolioData', fetchSkillsForGame);
      clearInterval(interval);
    };
  }, []);

  // Initialize and shuffle deck
  const initializeGame = () => {
    // Determine the skills pool
    const pool = dbSkills.length > 0 ? dbSkills : FALLBACK_SKILLS;

    // Shuffle the pool to pick randomly
    const shuffledPool = [...pool];
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }

    // Select exactly 10 unique skills
    const selectedSkills = shuffledPool.slice(0, 10);

    // If less than 10 (e.g. database has very few skills), pad with fallback items
    while (selectedSkills.length < 10) {
      const fallback = FALLBACK_SKILLS.find(fs => !selectedSkills.some(s => s.name.toLowerCase() === fs.name.toLowerCase()));
      if (fallback) {
        selectedSkills.push(fallback);
      } else {
        // Break to avoid infinite loop if somehow fallback is exhausted
        const randomFallback = FALLBACK_SKILLS[Math.floor(Math.random() * FALLBACK_SKILLS.length)];
        selectedSkills.push(randomFallback);
      }
    }

    // Map to duplicate pairs
    const gameItems = [...selectedSkills, ...selectedSkills].map((item, idx) => ({
      id: idx,
      name: item.name,
      icon: getSkillIcon(item.iconName || item.name),
      color: item.color,
      isFlipped: false,
      isMatched: false
    }));

    // Fisher-Yates Shuffle the final deck
    for (let i = gameItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameItems[i], gameItems[j]] = [gameItems[j], gameItems[i]];
    }

    setCards(gameItems);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setGameStarted(false);
    setGameCompleted(false);
    setConfetti([]);
    setToastMessage(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Re-run initialization whenever database skills load/change
  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dbSkills]);

  // Timer logic
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameCompleted]);

  // Toast handler
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Confetti generator
  const triggerConfetti = () => {
    const colors = ["#FFD700", "#FFD54F", "#06B6D4", "#61DAFB", "#34D399", "#818CF8", "#F472B6"];
    const particles = Array.from({ length: 80 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 200 + 100;
      return {
        id: i,
        x: 0,
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 0.8 + 0.4,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity - 100
      };
    });
    setConfetti(particles);
  };

  // Card click handler
  const handleCardClick = (index: number) => {
    if (gameCompleted || cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) return;

    // Start timer on first flip
    if (!gameStarted) {
      setGameStarted(true);
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If we flipped two cards
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.name === secondCard.name) {
        // MATCH
        setTimeout(() => {
          const matchedCards = newCards.map((c) => {
            if (c.name === firstCard.name) {
              return { ...c, isMatched: true };
            }
            return c;
          });
          setCards(matchedCards);
          setFlippedIndices([]);
          const newMatches = matches + 1;
          setMatches(newMatches);
          triggerToast(`⚡ Skill Unlocked — ${firstCard.name}`);

          if (newMatches === cards.length / 2) {
            setGameCompleted(true);
            triggerConfetti();
          }
        }, 300);
      } else {
        // MISMATCH - flip back after 600ms
        setTimeout(() => {
          const resetCards = newCards.map((c, idx) => {
            if (idx === newFlipped[0] || idx === newFlipped[1]) {
              return { ...c, isFlipped: false };
            }
            return c;
          });
          setCards(resetCards);
          setFlippedIndices([]);
        }, 600);
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 bg-neutral-950/90 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.15)] backdrop-blur-xl flex items-center gap-3 pointer-events-none"
          >
            <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
            <span className="font-mono text-sm text-white font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto text-center px-4 pt-6">
        
        {/* Game Headers */}
        <div className="space-y-1 mb-4">
          <span className="font-mono text-[10px] text-accent-pink tracking-widest uppercase block">// TECHNICAL MINI-GAME</span>
          <h3 className="font-syne font-bold text-xl sm:text-2xl text-white tracking-tight">Test Your Memory</h3>
          <p className="text-neutral-400 text-xs font-light">Can you match my tech stack?</p>
        </div>

        {/* Game Stats HUD */}
        <div className="flex justify-center items-center gap-6 mb-5 text-neutral-400 font-mono text-[11px] uppercase bg-white/2 border border-white/5 rounded-xl px-5 py-2.5 max-w-xs mx-auto backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#FFD700]" />
            <span>Time: <strong className="text-white font-semibold">{formatTime(time)}</strong></span>
          </div>
          <div className="w-px h-3.5 bg-white/10" />
          <div>
            <span>Moves: <strong className="text-white font-semibold">{moves}</strong></span>
          </div>
          <div className="w-px h-3.5 bg-white/10" />
          <button 
            onClick={initializeGame}
            className="p-1 hover:text-[#FFD700] hover:rotate-180 transition-all duration-300 cursor-pointer"
            title="Reset Game"
          >
            <RefreshCw size={12} />
          </button>
        </div>

        {/* 5x4 Grid Layout */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-2.5 sm:gap-3 max-w-xl mx-auto relative z-10">
          {cards.map((card, index) => {
            const isFlipped = card.isFlipped || card.isMatched;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="aspect-square relative cursor-pointer group"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="w-full h-full relative duration-400 rounded-xl"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* Face Down Back Side */}
                  <div
                    className="absolute inset-0 bg-neutral-900/40 border border-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner group-hover:border-[#FFD700]/30 transition-colors"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="w-6 h-6 rounded-full border border-dashed border-[#FFD700]/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#FFD700] rounded-full opacity-60" />
                    </div>
                  </div>

                  {/* Face Up Front Side */}
                  <div
                    className="absolute inset-0 bg-neutral-950/80 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderColor: card.isMatched ? "#FFD700" : "rgba(255, 255, 255, 0.1)",
                      boxShadow: card.isMatched ? "0 0 15px rgba(255, 215, 0, 0.15)" : "none"
                    }}
                  >
                    <div style={{ color: card.color }}>{card.icon}</div>
                    <span className="text-[9px] font-mono text-neutral-400 mt-2 font-semibold select-none">{card.name}</span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Completion Overlay Screen */}
        <AnimatePresence>
          {gameCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl z-30 flex items-center justify-center p-6 rounded-3xl"
            >
              {/* Confetti Render */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {confetti.map((c) => (
                  <motion.div
                    key={c.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: c.color,
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: c.tx,
                      y: c.ty,
                      opacity: [1, 1, 0],
                      scale: [1, c.scale, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>

              <div className="max-w-md space-y-6 text-center z-40 relative">
                <div className="w-16 h-16 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                  <CheckCircle size={32} className="text-[#FFD700]" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-syne font-extrabold text-2xl sm:text-3xl text-white tracking-tight">Tech Stack Discovered</h4>
                  <p className="text-neutral-400 text-xs sm:text-sm font-light">
                    You've successfully explored my technical toolkit.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-white/2 border border-white/5 rounded-2xl p-4 font-mono text-xs uppercase text-neutral-400">
                  <div className="space-y-1">
                    <span>Matched</span>
                    <span className="block text-base text-white font-bold font-syne">{matches}/{cards.length / 2}</span>
                  </div>
                  <div className="space-y-1 border-x border-white/5">
                    <span>Time</span>
                    <span className="block text-base text-white font-bold font-syne">{formatTime(time)}</span>
                  </div>
                  <div className="space-y-1">
                    <span>Moves</span>
                    <span className="block text-base text-white font-bold font-syne">{moves}</span>
                  </div>
                </div>

                <button
                  onClick={initializeGame}
                  className="bg-[#FFD700] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#e5c100] transition-colors font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
