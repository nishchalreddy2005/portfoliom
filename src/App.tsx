import { useState, useEffect } from "react";
import { Compass, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
// import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Process from "./components/Process";
import Insights from "./components/Insights";
import BeyondCode from "./components/BeyondCode";
import AsteroidDodger from "./components/AsteroidDodger";
import Contact from "./components/Contact";
import CustomCursor from "./components/CustomCursor";
import PortfolioChatbot from "./components/PortfolioChatbot";

import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";

function MainPortfolio() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    experience: true,
    projects: true,
    certifications: true,
    education: true,
    skills: true,
  });

  // Fetch toggles from the database
  useEffect(() => {
    fetch('http://localhost:3001/api/content')
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const newToggles = { ...toggles };
          data.forEach(item => {
            if (item.key.startsWith('toggle_')) {
              newToggles[item.key.replace('toggle_', '')] = item.value === 'true';
            }
          });
          setToggles(newToggles);
        }
      })
      .catch(err => console.error("Error loading toggles:", err));
  }, []);

  // Multi-step Loading progress emulator for boutique brand entry effect
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 600); // smooth release fade out
      }
      setLoadingProgress(progress);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Track active section to highlighted indicators in headers
  useEffect(() => {
    if (loading) return;

    const sections = ["home", "services", "about", "projects", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -40% 0px", // triggers when section dominates visual center
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [loading]);

  return (
    <>
      {/* Custom Spring Pointer Cursor Node */}
      <CustomCursor />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -60, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-50 bg-primary-dark flex flex-col justify-between p-6 md:p-12 text-white"
          >
            {/* Top info row */}
            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              <span>// BOUTIQUE WORKSPACE PRE-LAUNCH</span>
              <span>G V R NISHCHAL REDDY © 2026</span>
            </div>

            {/* Central glowing brand counter */}
            <div className="flex flex-col items-center justify-center space-y-4 my-auto select-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 rounded-full border border-dashed border-white/20 flex items-center justify-center p-3"
              >
                <Compass className="h-6 w-6 text-accent-pink" />
              </motion.div>
              <h2 className="font-syne font-extrabold text-2xl tracking-widest text-white leading-none uppercase">
                G V R NISHCHAL REDDY
              </h2>
              <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-accent-pink animate-pulse" /> Loading Client Assets
              </div>
            </div>

            {/* Bottom load percentage line metrics */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-end font-mono text-neutral-400">
                <span className="text-[10px] tracking-widest">ESTABLISHING MODULE ENTRANCE</span>
                <span className="text-2xl font-bold font-syne text-accent-pink">
                  {loadingProgress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div
                  className="h-full bg-gradient-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="portfolio-web-space"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-primary-dark text-white select-none relative"
          >
            {/* Top Floating Glass Header Nav integrations */}
            <Navbar activeSection={activeSection} toggles={toggles} />

            {/* Main structural list grids */}
            <main id="primary-portfolio-root">
              <Hero />
              <About toggles={toggles} />
              {/* <Portfolio /> */}
              {toggles.experience && <Services />}
              {toggles.projects && <Process />}
              {toggles.certifications && <Insights />}
              <BeyondCode />
              <AsteroidDodger />
              <Contact />
              <PortfolioChatbot />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/*" element={<MainPortfolio />} />
    </Routes>
  );
}
