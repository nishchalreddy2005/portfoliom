import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Dna } from "lucide-react";
import { API_BASE } from "../config";

// Language → color mapping (curated palette)
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Java: "#ED8B00",
  "C++": "#00599C",
  C: "#555555",
  "C#": "#239120",
  Go: "#00ADD8",
  Rust: "#CE412B",
  Ruby: "#CC342D",
  PHP: "#777BB4",
  Swift: "#FA7343",
  Kotlin: "#7F52FF",
  Dart: "#0175C2",
  Solidity: "#363636",
  HTML: "#E34F26",
  CSS: "#1572B6",
  SCSS: "#CC6699",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  Unknown: "#888888",
};

interface CommitNode {
  sha: string;
  message: string;
  repo: string;
  date: string;
  language: string;
}

function getColor(lang: string): string {
  return LANG_COLORS[lang] || LANG_COLORS.Unknown;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function CodingDNA() {
  const [commits, setCommits] = useState<CommitNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const scrollRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/github/events`)
      .then((res) => res.json())
      .then((data) => {
        if (data.commits && Array.isArray(data.commits)) {
          setCommits(data.commits);
        }
      })
      .catch((err) => console.error("CodingDNA fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Canvas DNA helix animation
  const drawHelix = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || commits.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    ctx.clearRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;
    const amplitude = Math.min(W * 0.32, 180);
    const nodeSpacing = 28;
    const totalNodes = Math.min(commits.length, 50);
    const t = scrollRef.current;

    // Draw connecting backbone lines first (behind nodes)
    for (let strand = 0; strand < 2; strand++) {
      ctx.beginPath();
      ctx.strokeStyle = strand === 0 ? "rgba(255,213,79,0.08)" : "rgba(49,120,198,0.08)";
      ctx.lineWidth = 1.5;

      for (let i = 0; i < totalNodes; i++) {
        const phase = strand === 0 ? 0 : Math.PI;
        const yPos = centerY + (i - totalNodes / 2) * nodeSpacing;
        const angle = (i * 0.4) + t * 0.008 + phase;
        const xPos = centerX + Math.sin(angle) * amplitude;

        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();
    }

    // Draw cross-links (rungs of the DNA ladder)
    for (let i = 0; i < totalNodes; i += 2) {
      const yPos = centerY + (i - totalNodes / 2) * nodeSpacing;
      const angle1 = (i * 0.4) + t * 0.008;
      const angle2 = (i * 0.4) + t * 0.008 + Math.PI;
      const x1 = centerX + Math.sin(angle1) * amplitude;
      const x2 = centerX + Math.sin(angle2) * amplitude;

      const depth = Math.cos(angle1);
      const opacity = 0.03 + Math.abs(depth) * 0.07;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.moveTo(x1, yPos);
      ctx.lineTo(x2, yPos);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw nodes on both strands
    for (let strand = 0; strand < 2; strand++) {
      for (let i = 0; i < totalNodes; i++) {
        const commit = commits[i];
        const phase = strand === 0 ? 0 : Math.PI;
        const yPos = centerY + (i - totalNodes / 2) * nodeSpacing;
        const angle = (i * 0.4) + t * 0.008 + phase;
        const xPos = centerX + Math.sin(angle) * amplitude;

        // Depth-based sizing (3D effect)
        const depth = Math.cos(angle);
        const size = 4 + Math.abs(depth) * 4;
        const alpha = 0.3 + Math.abs(depth) * 0.7;

        const color = getColor(commit.language);

        // Glow effect
        const gradient = ctx.createRadialGradient(xPos, yPos, 0, xPos, yPos, size * 3);
        gradient.addColorStop(0, color + Math.round(alpha * 60).toString(16).padStart(2, "0"));
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(xPos, yPos, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
        ctx.arc(xPos, yPos, size, 0, Math.PI * 2);
        ctx.fill();

        // Bright center dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`;
        ctx.arc(xPos, yPos, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    scrollRef.current += 1;
    animationRef.current = requestAnimationFrame(drawHelix);
  }, [commits]);

  useEffect(() => {
    if (commits.length > 0) {
      animationRef.current = requestAnimationFrame(drawHelix);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [commits, drawHelix]);

  // Compute unique languages for legend
  const uniqueLangs: string[] = [...new Set(commits.map((c) => c.language))].filter(Boolean) as string[];

  if (loading) {
    return (
      <section className="relative py-24 bg-primary-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-3 text-neutral-500 font-mono text-xs">
          <Dna className="w-4 h-4 animate-spin" />
          Sequencing developer DNA...
        </div>
      </section>
    );
  }

  if (commits.length === 0) return null;

  return (
    <section className="relative py-20 md:py-28 bg-primary-dark overflow-hidden cursor-default" ref={containerRef}>
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD54F]/3 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#3178C6]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center gap-2 justify-center mb-4">
            <span className="h-px w-8 bg-accent-pink" />
            <span className="font-mono text-[10px] text-accent-pink uppercase tracking-widest flex items-center gap-1.5">
              <Dna className="w-3 h-3" /> Live Developer DNA
            </span>
            <span className="h-px w-8 bg-accent-pink" />
          </div>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            My Coding <span className="text-gradient-gold">Blueprint</span>
          </h2>
          <p className="font-sans text-sm text-neutral-400 mt-4 max-w-xl mx-auto leading-relaxed">
            A real-time visualization of my recent GitHub activity. Each node represents a commit, colored by the primary language of the repository.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* DNA Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ height: `${Math.min(commits.length, 50) * 28 + 80}px`, maxHeight: "700px" }}
            />
            {/* Fade gradients top/bottom */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary-dark to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary-dark to-transparent pointer-events-none" />
          </motion.div>

          {/* Sidebar: Language Legend + Recent Commits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Language Legend */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
                Language Spectrum
              </h3>
              <div className="flex flex-wrap gap-2">
                {uniqueLangs.map((lang) => (
                  <div
                    key={lang}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-lg"
                      style={{
                        backgroundColor: getColor(lang),
                        boxShadow: `0 0 8px ${getColor(lang)}80`,
                      }}
                    />
                    <span className="text-[11px] font-mono text-neutral-300">{lang}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Commits Feed */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-4">
                Recent Mutations
              </h3>
              <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                {commits.slice(0, 15).map((commit, idx) => (
                  <div
                    key={`${commit.sha}-${idx}`}
                    className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/5 cursor-default"
                    onMouseEnter={() => setHoveredNode(idx)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0 transition-transform duration-300 group-hover:scale-150"
                      style={{
                        backgroundColor: getColor(commit.language),
                        boxShadow: hoveredNode === idx ? `0 0 12px ${getColor(commit.language)}` : "none",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-200 truncate font-medium leading-snug">
                        {commit.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-neutral-500">{commit.repo}</span>
                        <span className="text-neutral-700">·</span>
                        <span className="text-[10px] font-mono text-neutral-600">{commit.sha}</span>
                        <span className="text-neutral-700">·</span>
                        <span className="text-[10px] font-mono text-neutral-600">{timeAgo(commit.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center backdrop-blur-sm">
                <p className="text-2xl font-syne font-bold text-white">{commits.length}</p>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">Commits</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center backdrop-blur-sm">
                <p className="text-2xl font-syne font-bold text-white">{uniqueLangs.length}</p>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mt-1">Languages</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
