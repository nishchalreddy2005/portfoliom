import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowDown, Stars, ArrowRight, Github, Linkedin, Download } from "lucide-react";
import resumePdf from "../assets/G V R Nishchal Reddy.pdf";
import { API_BASE } from "../config";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    hero_subtitle: "Software Engineer • Full-Stack Developer",
    hero_title_part1: "Building software for",
    hero_title_part2: "real-world problems.",
    hero_description: "Computer Science Engineering graduate with hands-on experience building full-stack applications, AI-powered tools, and business-focused web solutions. Passionate about creating impactful products and continuously expanding my technical expertise.",
    hero_ticker_words: ["SOFTWARE ENGINEER", "TYPESCRIPT", "FULL STACK", "PROBLEM SOLVER", "LEARNER", "BUILDER"],
    hero_resume_url: "",
    hero_linkedin_url: "https://www.linkedin.com/in/gvrnishchalreddy",
    hero_github_url: "https://github.com/gvrnishchalreddy",
    hero_ticker_speed: "60"
  });

  useEffect(() => {
    const fetchHero = () => {
      fetch(`${API_BASE}/api/content`)
        .then(res => res.json())
        .then((data: any[]) => {
          if (Array.isArray(data)) {
            const mapped: any = { ...heroData };
            let hasHeroData = false;
            data.forEach(item => {
              if (item.key.startsWith('hero_')) {
                hasHeroData = true;
                if (item.key === 'hero_ticker_words') {
                  mapped[item.key] = item.value ? item.value.split(',').map((w: string) => w.trim()) : [];
                } else if (item.key in heroData) {
                  mapped[item.key] = item.value || '';
                }
              }
            });
            if (hasHeroData) {
              setHeroData(mapped);
            }
          }
        })
        .catch(err => console.error("Error loading hero content:", err));
    };

    fetchHero();

    window.addEventListener('refetchPortfolioData', fetchHero);
    const interval = setInterval(fetchHero, 10000);

    return () => {
      window.removeEventListener('refetchPortfolioData', fetchHero);
      clearInterval(interval);
    };
  }, []);

  const handleScrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const tickerOne = heroData.hero_ticker_words;
  const tickerTwo = [...heroData.hero_ticker_words].reverse();

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden bg-primary-dark pt-12 pb-16 cursor-default"
    >
      {/* Absolute background huge text logo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none opacity-[0.03] z-0 mt-8 w-full overflow-hidden leading-none gap-4 md:gap-8">
        {["G V R", "NISHCHAL", "REDDY"].map((word, idx) => (
          <span key={idx} className="font-syne font-extrabold text-[14vw] sm:text-[12vw] md:text-[10vw] xl:text-[11rem] tracking-widest uppercase">
            {word}
          </span>
        ))}
      </div>

      {/* Decorative colored visual orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-accent-blue/20 blur-[120px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-accent-pink/20 blur-[120px] pointer-events-none -z-10"
      />

      {/* Dual bidirectional marquees */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 hidden md:block">
        {/* Left marquee */}
        <div className="relative overflow-hidden w-full h-20 opacity-40 select-none pointer-events-none blur-[2px]">
          <div className="animate-marquee whitespace-nowrap flex py-2 border-y border-white/5 font-syne font-black text-5xl text-stroke-white tracking-widest leading-none" style={{ animationDuration: `${heroData.hero_ticker_speed || 60}s` }}>
            {Array(6).fill(tickerOne).flat().map((word, idx) => (
              <span key={idx} className="mx-8">
                {word} <span className="text-white/20 select-none ml-8">/</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right marquee (reverse) */}
        <div className="relative overflow-hidden w-full h-20 opacity-30 select-none pointer-events-none mt-4 blur-[2px]">
          <div className="animate-marquee-reverse whitespace-nowrap flex py-2 border-y border-white/5 font-syne font-black text-5xl text-stroke-white tracking-widest leading-none" style={{ animationDuration: `${heroData.hero_ticker_speed || 60}s` }}>
            {Array(6).fill(tickerTwo).flat().map((word, idx) => (
              <span key={idx} className="mx-8">
                {word} <span className="text-white/20 select-none ml-8">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 w-full flex flex-col items-center justify-center text-center relative z-10 py-12 mt-20">
        
        {/* Centered info - Developer focus */}
        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-2 justify-center"
          >
            <span className="h-px w-8 bg-accent-pink" />
            <span className="font-mono text-xs text-accent-pink uppercase tracking-widest flex items-center gap-1">
              <Stars className="h-3 w-3" /> {heroData.hero_subtitle}
            </span>
            <span className="h-px w-8 bg-accent-pink" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-syne font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05]"
          >
            <span>{heroData.hero_title_part1}</span> <br />
            <span className="text-gradient-gold whitespace-nowrap">
              {heroData.hero_title_part2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-sans text-sm sm:text-base md:text-lg text-neutral-400/80 max-w-xl leading-[1.8] mt-10"
          >
            {heroData.hero_description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-6"
          >
            <a
              href="#works"
              className="px-7 py-3.5 sm:px-9 sm:py-4.5 rounded-full bg-accent-pink/15 border border-accent-pink text-accent-pink font-mono text-[11px] sm:text-sm uppercase tracking-widest transition-all duration-300 hover:bg-accent-pink hover:text-black hover:scale-105 flex items-center gap-2 hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              View Projects
            </a>
            
            <a
              href={heroData.hero_resume_url || resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-full glass-card text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 hover:text-accent-pink hover:scale-105 flex items-center gap-2 hover:border-accent-pink/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
            
            <a
              href={heroData.hero_linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-full glass-card text-white font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 hover:text-accent-pink hover:scale-105 flex items-center gap-2 hover:border-accent-pink/30 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <Linkedin className="w-4 h-4" />
              Connect on LinkedIn
            </a>
          </motion.div>
        </div>

      </div>

      {/* Slide indicator chevron */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 select-none text-neutral-500 hover:text-white transition-colors cursor-pointer" onClick={handleScrollToAbout}>
        <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-600">SCROLL DOWN</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </div>
    </section>
  );
}
