import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Gamepad2, Play, RotateCcw, ArrowRight } from "lucide-react";

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
}

const OBS_TYPES = [
  { label: 'Bug', short: 'BUG', color: '#ff4455', baseHp: 1 },
  { label: 'Deadline', short: 'DL', color: '#ff6600', baseHp: 1 },
  { label: 'Crash', short: 'ERR', color: '#cc2244', baseHp: 2 },
  { label: 'Error', short: '404', color: '#ff3388', baseHp: 2 },
  { label: 'Failure', short: 'FAIL', color: '#ff2200', baseHp: 3 },
];

const PU_TYPES = [
  { label: 'AI', short: 'AI', color: '#00cfff', desc: '+50 AMMO', effect: 'ai' },
  { label: 'Blockchain', short: 'BLK', color: '#a855f7', desc: 'SHIELD 5s', effect: 'shield' },
  { label: 'Leadership', short: 'LDR', color: '#22c55e', desc: '+30 SCORE', effect: 'score' },
  { label: 'Innovation', short: 'INN', color: '#f97316', desc: 'RAPID FIRE', effect: 'rapid' },
  { label: 'Football', short: 'GOL', color: '#FFD700', desc: '+20 AMMO', effect: 'football' },
];

export default function AsteroidDodger() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cwRef = useRef<HTMLDivElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // DOM Refs for high-speed HUD manipulation (bypassing React re-renders)
  const scoreSpanRef = useRef<HTMLDivElement | null>(null);
  const killsSpanRef = useRef<HTMLDivElement | null>(null);
  const bestSpanRef = useRef<HTMLDivElement | null>(null);
  const ammoBarRef = useRef<HTMLDivElement | null>(null);
  const livesBarRef = useRef<HTMLDivElement | null>(null);

  // Refs for tracking mutable game engine state without triggering re-renders
  const keys = useRef<Record<string, boolean>>({});
  const playerRef = useRef({ x: 350, y: 360, vx: 0, vy: 0, trail: [] as { x: number; y: number }[] });
  const bulletsRef = useRef<any[]>([]);
  const obstaclesRef = useRef<any[]>([]);
  const powerupsRef = useRef<any[]>([]);
  const particlesRef = useRef<any[]>([]);
  const starsRef = useRef<Star[]>([]);

  const shootCDRef = useRef(0);
  const obsTimerRef = useRef(0);
  const puTimerRef = useRef(0);
  const aiTimerRef = useRef(0);
  const shieldActiveRef = useRef(0);
  const rapidActiveRef = useRef(0);
  const invincibleFramesRef = useRef(0);
  const frameRef = useRef(0);
  
  const scoreRef = useRef(0);
  const killsRef = useRef(0);
  const livesRef = useRef(3);
  const ammoRef = useRef(100);
  const bestScoreRef = useRef(0);

  // Load best score
  useEffect(() => {
    const saved = localStorage.getItem("dodger_best_score");
    if (saved) {
      const parsed = parseInt(saved, 10);
      setBestScore(parsed);
      bestScoreRef.current = parsed;
    }
  }, []);

  // Ensure canvas width matches container width immediately on mount to prevent size jumps
  useEffect(() => {
    if (isPlaying && canvasRef.current && cwRef.current) {
      const W = cwRef.current.offsetWidth || 700;
      canvasRef.current.width = W;
      canvasRef.current.height = 440;
    }
  }, [isPlaying]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      keys.current[e.key] = true;
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Smooth scroll to contact
  const handleContinueToContact = () => {
    const contactSec = document.getElementById("contact");
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Star background initializer
  const initStars = () => {
    starsRef.current = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * 0.5 + 0.15,
      tw: Math.random() * Math.PI * 2
    }));
  };

  const emitP = (x: number, y: number, color: string, n: number, spd = 1) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = (1.5 + Math.random() * 3.5) * spd;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        a: 1,
        color,
        r: 1.5 + Math.random() * 2.5,
        life: 0.025 + Math.random() * 0.02
      });
    }
  };

  // DOM manipulation helpers (highly efficient, bypasses React render tree)
  const updateAmmoDOM = (currentAmmo: number) => {
    if (!ammoBarRef.current) return;
    ammoBarRef.current.innerHTML = "";
    const pips = 20;
    const filled = Math.round((currentAmmo / 100) * pips);
    for (let i = 0; i < pips; i++) {
      const pip = document.createElement("div");
      pip.className = `w-1 h-2.5 rounded-[1px] ${i < filled ? "bg-[#FFD700]" : "bg-neutral-800"}`;
      ammoBarRef.current.appendChild(pip);
    }
  };

  const updateLivesDOM = (currentLives: number) => {
    if (!livesBarRef.current) return;
    livesBarRef.current.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const container = document.createElement("div");
      container.className = `inline-block transition-opacity duration-300 ${i >= currentLives ? "opacity-15" : "opacity-100"}`;
      container.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 16 16">
          <polygon
            points="8,1 10,6 15,6 11,9.5 12.5,15 8,11.5 3.5,15 5,9.5 1,6 6,6"
            fill="${i < currentLives ? "#FFD700" : "#333"}"
          />
        </svg>
      `;
      livesBarRef.current.appendChild(container);
    }
  };

  const rRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, sp: number, oR: number, iR: number) => {
    let rot = -Math.PI / 2;
    let step = Math.PI / sp;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rot) * oR, cy + Math.sin(rot) * oR);
    for (let i = 0; i < sp; i++) {
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * iR, cy + Math.sin(rot) * iR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * oR, cy + Math.sin(rot) * oR);
    }
    ctx.closePath();
  };

  const drawRocket = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    if (invincibleFramesRef.current > 0 && Math.floor(frameRef.current / 3) % 2 === 0) {
      ctx.restore();
      return;
    }

    if (shieldActiveRef.current > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,207,255,${0.3 + 0.2 * Math.sin(frameRef.current * 0.15)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,207,255,0.05)';
      ctx.fill();
    }

    const eg = ctx.createRadialGradient(0, 26, 1, 0, 32, 18);
    eg.addColorStop(0, 'rgba(255,180,30,0.7)');
    eg.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.fillStyle = eg;
    ctx.beginPath();
    ctx.ellipse(0, 30, 11, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, 14);
    ctx.lineTo(-22, 24);
    ctx.lineTo(-14, 7);
    ctx.closePath();
    const wg1 = ctx.createLinearGradient(-22, 0, -8, 0);
    wg1.addColorStop(0, '#aa8800');
    wg1.addColorStop(1, '#FFD700');
    ctx.fillStyle = wg1;
    ctx.fill();
    ctx.strokeStyle = '#e6c200';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, 14);
    ctx.lineTo(22, 24);
    ctx.lineTo(14, 7);
    ctx.closePath();
    const wg2 = ctx.createLinearGradient(8, 0, 22, 0);
    wg2.addColorStop(0, '#FFD700');
    wg2.addColorStop(1, '#aa8800');
    ctx.fillStyle = wg2;
    ctx.fill();
    ctx.strokeStyle = '#e6c200';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.bezierCurveTo(10, -20, 12, 2, 10, 15);
    ctx.lineTo(-10, 15);
    ctx.bezierCurveTo(-12, 2, -10, -20, 0, -28);
    ctx.closePath();
    const bg = ctx.createLinearGradient(-10, 0, 10, 0);
    bg.addColorStop(0, '#b0b0cc');
    bg.addColorStop(0.45, '#eaeaf8');
    bg.addColorStop(1, '#8888aa');
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = '#777799';
    ctx.lineWidth = 0.7;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.bezierCurveTo(6, -22, 8, -10, 7, -5);
    ctx.lineTo(-7, -5);
    ctx.bezierCurveTo(-8, -10, -6, -22, 0, -28);
    ctx.closePath();
    const ng = ctx.createLinearGradient(-7, 0, 7, 0);
    ng.addColorStop(0, '#bb8800');
    ng.addColorStop(0.5, '#FFD700');
    ng.addColorStop(1, '#996600');
    ctx.fillStyle = ng;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(0, 1, 5, 7, 0, 0, Math.PI * 2);
    const wnd = ctx.createRadialGradient(-1, -2, 1, 0, 1, 6);
    wnd.addColorStop(0, '#aaeeff');
    wnd.addColorStop(1, '#0055aa');
    ctx.fillStyle = wnd;
    ctx.fill();
    ctx.strokeStyle = '#88ccff';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-1.5, -0.5, 1.2, 2.5, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    [-5, 5].forEach(ox => {
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(ox - 2.5, 13, 5, 7, 2);
      } else {
        ctx.rect(ox - 2.5, 13, 5, 7);
      }
      ctx.fillStyle = '#444466';
      ctx.fill();
      ctx.strokeStyle = '#666688';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    const fl = 5 + Math.random() * 7;
    [-5, 5].forEach(ox => {
      ctx.beginPath();
      ctx.moveTo(ox - 2.5, 20);
      ctx.lineTo(ox, 20 + fl);
      ctx.lineTo(ox + 2.5, 20);
      ctx.closePath();
      const ff = ctx.createLinearGradient(0, 20, 0, 20 + fl);
      ff.addColorStop(0, 'rgba(255,220,50,0.95)');
      ff.addColorStop(1, 'rgba(255,80,0,0)');
      ctx.fillStyle = ff;
      ctx.fill();
    });

    ctx.restore();
  };

  const drawObs = (ctx: CanvasRenderingContext2D, o: any) => {
    ctx.save();
    ctx.translate(o.x, o.y);
    const bob = Math.sin(frameRef.current * 0.07 + o.phase) * 2.5;
    ctx.translate(0, bob);
    ctx.strokeStyle = o.color;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = o.color + '1a';
    rRect(ctx, -18, -18, 36, 36, 7);
    ctx.fill();
    ctx.stroke();

    const hw = 34 * (o.hp / o.maxHp);
    ctx.fillStyle = '#111122';
    rRect(ctx, -17, -25, 34, 4, 2);
    ctx.fill();
    ctx.fillStyle = o.color;
    rRect(ctx, -17, -25, hw, 4, 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(o.short, 0, -2);
    ctx.font = '7px Courier New';
    ctx.fillStyle = o.color + 'cc';
    ctx.fillText(o.label, 0, 9);
    ctx.restore();
  };

  const drawPU = (ctx: CanvasRenderingContext2D, p: any) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    p.pulse = (p.pulse || 0) + 0.07;
    const sc = 1 + Math.sin(p.pulse) * 0.1;
    ctx.scale(sc, sc);
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fillStyle = p.color + '18';
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawStar(ctx, 0, 0, 5, 10, 4);
    ctx.fillStyle = p.color;
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.font = 'bold 7px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.short, 0, 0);
    ctx.restore();

    ctx.fillStyle = p.color + 'cc';
    ctx.font = '8px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(p.label, p.x, p.y + 26);
    ctx.fillStyle = '#444';
    ctx.font = '7px Courier New';
    ctx.fillText(p.desc, p.x, p.y + 35);
  };

  const drawBullet = (ctx: CanvasRenderingContext2D, b: any) => {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-2, -8, 4, 14, 2);
    } else {
      ctx.rect(-2, -8, 4, 14);
    }
    ctx.fill();

    const tg = ctx.createLinearGradient(0, -8, 0, 6);
    tg.addColorStop(0, '#ffffff');
    tg.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.fillStyle = tg;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(-1, -8, 2, 10, 1);
    } else {
      ctx.rect(-1, -8, 2, 10);
    }
    ctx.fill();
    ctx.restore();
  };

  const drawStars = (ctx: CanvasRenderingContext2D, W: number, H: number) => {
    starsRef.current.forEach(s => {
      s.tw += 0.012;
      const a = s.a * (0.7 + 0.3 * Math.sin(s.tw));
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(s.x * W, s.y * H, s.r * 2, s.r * 2);
    });
  };

  const spawnObs = (W: number) => {
    const t = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
    const diff = Math.min(1, frameRef.current / 4000);
    const spd = 0.9 + diff * 2.2;
    const hp = t.baseHp + (diff > 0.6 ? 1 : 0);
    obstaclesRef.current.push({
      x: 38 + Math.random() * (W - 76),
      y: -40,
      w: 36,
      h: 36,
      vy: spd * (0.75 + Math.random() * 0.5),
      phase: Math.random() * Math.PI * 2,
      ...t,
      hp,
      maxHp: hp
    });
  };

  const spawnPU = (W: number, forceType?: any) => {
    const t = forceType || PU_TYPES[Math.floor(Math.random() * PU_TYPES.length)];
    const diff = Math.min(1, frameRef.current / 4000);
    powerupsRef.current.push({
      x: 38 + Math.random() * (W - 76),
      y: -40,
      w: 34,
      h: 34,
      vy: 0.8 + diff * 0.5,
      pulse: 0,
      ...t
    });
  };

  const shoot = () => {
    const cd = rapidActiveRef.current > 0 ? 4 : 12;
    if (ammoRef.current <= 0 || shootCDRef.current > 0) return;
    bulletsRef.current.push({
      x: playerRef.current.x,
      y: playerRef.current.y - 22,
      vy: -13,
      alive: true
    });
    ammoRef.current = Math.max(0, ammoRef.current - 1);
    updateAmmoDOM(ammoRef.current);
    shootCDRef.current = cd;
    emitP(playerRef.current.x, playerRef.current.y - 12, '#FFD700', 4);
  };

  const applyPU = (p: any) => {
    switch (p.effect) {
      case 'ai':
        ammoRef.current = Math.min(100, ammoRef.current + 50);
        updateAmmoDOM(ammoRef.current);
        break;
      case 'football':
        ammoRef.current = Math.min(100, ammoRef.current + 20);
        updateAmmoDOM(ammoRef.current);
        break;
      case 'shield':
        shieldActiveRef.current = 300;
        break;
      case 'score':
        scoreRef.current += 30;
        if (scoreSpanRef.current) scoreSpanRef.current.textContent = String(scoreRef.current);
        break;
      case 'rapid':
        rapidActiveRef.current = 240;
        break;
    }
    triggerToast(`⚡ ${p.label} — ${p.desc}`);
    emitP(p.x, p.y, p.color, 22, 1.3);
  };

  const loseLife = () => {
    livesRef.current--;
    updateLivesDOM(livesRef.current);
    invincibleFramesRef.current = 120;
    emitP(playerRef.current.x, playerRef.current.y, '#ff4444', 30, 1.5);
    
    if (livesRef.current <= 0) {
      if (scoreRef.current > bestScoreRef.current) {
        bestScoreRef.current = scoreRef.current;
        localStorage.setItem("dodger_best_score", String(scoreRef.current));
        setBestScore(scoreRef.current);
      }
      setScore(scoreRef.current);
      setKills(killsRef.current);
      setGameState("gameover");
      return true;
    }
    triggerToast(`LIFE LOST! ${livesRef.current} REMAINING`);
    return false;
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setKills(0);

    scoreRef.current = 0;
    killsRef.current = 0;
    livesRef.current = 3;
    ammoRef.current = 100;
    frameRef.current = 0;
    shootCDRef.current = 0;
    obsTimerRef.current = 0;
    puTimerRef.current = 0;
    aiTimerRef.current = 0;
    shieldActiveRef.current = 0;
    rapidActiveRef.current = 0;
    invincibleFramesRef.current = 0;

    bulletsRef.current = [];
    obstaclesRef.current = [];
    powerupsRef.current = [];
    particlesRef.current = [];

    initStars();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = cwRef.current?.offsetWidth || 700;
    canvas.width = W;
    canvas.height = 440;

    playerRef.current = {
      x: W / 2,
      y: 440 - 80,
      vx: 0,
      vy: 0,
      trail: []
    };

    // Initial HUD setup
    if (scoreSpanRef.current) scoreSpanRef.current.textContent = "0";
    if (killsSpanRef.current) killsSpanRef.current.textContent = "0";
    if (bestSpanRef.current) bestSpanRef.current.textContent = String(bestScoreRef.current);
    updateAmmoDOM(100);
    updateLivesDOM(3);

    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);

    const update = () => {
      frameRef.current++;
      const curW = canvas.width;
      const curH = canvas.height;

      // Inputs physics - Snappy and fast response
      const sp = 1.85;
      if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A']) playerRef.current.vx -= sp;
      if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D']) playerRef.current.vx += sp;
      if (keys.current['ArrowUp'] || keys.current['w'] || keys.current['W']) playerRef.current.vy -= sp;
      if (keys.current['ArrowDown'] || keys.current['s'] || keys.current['S']) playerRef.current.vy += sp;
      if (keys.current[' '] || keys.current['z'] || keys.current['Z']) shoot();

      playerRef.current.vx *= 0.82;
      playerRef.current.vy *= 0.82;
      playerRef.current.x = Math.max(26, Math.min(curW - 26, playerRef.current.x + playerRef.current.vx));
      playerRef.current.y = Math.max(36, Math.min(curH - 26, playerRef.current.y + playerRef.current.vy));

      if (shootCDRef.current > 0) shootCDRef.current--;
      if (shieldActiveRef.current > 0) shieldActiveRef.current--;
      if (rapidActiveRef.current > 0) rapidActiveRef.current--;
      if (invincibleFramesRef.current > 0) invincibleFramesRef.current--;

      const diff = Math.min(1, frameRef.current / 4000);
      
      const nextScore = Math.floor(frameRef.current / 6) + killsRef.current * 15;
      if (nextScore !== scoreRef.current) {
        scoreRef.current = nextScore;
        if (scoreSpanRef.current) {
          scoreSpanRef.current.textContent = String(scoreRef.current);
        }
      }

      // Spawners logic
      obsTimerRef.current++;
      const obsRate = Math.max(45, 130 - Math.floor(diff * 90));
      if (obsTimerRef.current >= obsRate) {
        spawnObs(curW);
        obsTimerRef.current = 0;
      }

      aiTimerRef.current++;
      if (aiTimerRef.current >= 900) {
        spawnPU(curW, PU_TYPES[0]);
        aiTimerRef.current = 0;
      }

      puTimerRef.current++;
      const puRate = Math.max(320, 480 - Math.floor(diff * 140));
      if (puTimerRef.current >= puRate) {
        const nonAi = PU_TYPES.slice(1);
        spawnPU(curW, nonAi[Math.floor(Math.random() * nonAi.length)]);
        puTimerRef.current = 0;
      }

      // Render
      ctx.clearRect(0, 0, curW, curH);
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, curW, curH);
      drawStars(ctx, curW, curH);

      // Particles - Optimized using high-performance fillRect and globalAlpha
      particlesRef.current = particlesRef.current.filter(p => p.a > 0);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.a -= p.life;
        p.vy += 0.07;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.a));
        ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      });
      ctx.globalAlpha = 1.0;

      // Trail
      playerRef.current.trail.push({ x: playerRef.current.x, y: playerRef.current.y });
      if (playerRef.current.trail.length > 18) playerRef.current.trail.shift();
      playerRef.current.trail.forEach((t, i) => {
        const a = (i / playerRef.current.trail.length) * 0.35;
        ctx.beginPath();
        ctx.arc(t.x, t.y + 18, 2.5 * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,160,20,${a})`;
        ctx.fill();
      });

      // Bullets
      bulletsRef.current = bulletsRef.current.filter(b => b.y > -20 && b.alive);
      bulletsRef.current.forEach(b => {
        b.y += b.vy;
        drawBullet(ctx, b);
      });

      // Obstacles
      for (let oi = obstaclesRef.current.length - 1; oi >= 0; oi--) {
        const o = obstaclesRef.current[oi];
        o.y += o.vy;
        let destroyed = false;

        for (let bi = bulletsRef.current.length - 1; bi >= 0; bi--) {
          const b = bulletsRef.current[bi];
          if (!b.alive) continue;
          if (Math.abs(b.x - o.x) < 20 && Math.abs(b.y - o.y) < 22) {
            b.alive = false;
            o.hp--;
            emitP(b.x, b.y, o.color, 7);
            if (o.hp <= 0) {
              emitP(o.x, o.y, o.color, 20, 1.2);
              killsRef.current++;
              if (killsSpanRef.current) killsSpanRef.current.textContent = String(killsRef.current);
              obstaclesRef.current.splice(oi, 1);
              destroyed = true;
              break;
            }
          }
        }
        if (destroyed) continue;
        if (o.y > curH + 60) {
          obstaclesRef.current.splice(oi, 1);
          continue;
        }

        const playerHit = Math.abs(playerRef.current.x - o.x) < 26 && Math.abs(playerRef.current.y - o.y) < 26;
        if (invincibleFramesRef.current <= 0 && playerHit) {
          if (shieldActiveRef.current > 0) {
            emitP(o.x, o.y, o.color, 18, 1.2);
            obstaclesRef.current.splice(oi, 1);
            shieldActiveRef.current = 0;
            triggerToast('SHIELD BLOCKED IT!');
            continue;
          }
          const dead = loseLife();
          obstaclesRef.current.splice(oi, 1);
          if (dead) return;
          continue;
        }

        drawObs(ctx, o);
      }

      // Powerups
      for (let pi = powerupsRef.current.length - 1; pi >= 0; pi--) {
        const p = powerupsRef.current[pi];
        p.y += p.vy;
        if (p.y > curH + 60) {
          powerupsRef.current.splice(pi, 1);
          continue;
        }

        const collected = Math.abs(playerRef.current.x - p.x) < 34 && Math.abs(playerRef.current.y - p.y) < 34;
        if (collected) {
          applyPU(p);
          powerupsRef.current.splice(pi, 1);
          continue;
        }
        drawPU(ctx, p);
      }

      // Player Rocket
      drawRocket(ctx, playerRef.current.x, playerRef.current.y);

      // HUD overlay duration timers
      if (shieldActiveRef.current > 0) {
        ctx.fillStyle = 'rgba(0,207,255,0.6)';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`SHIELD ${Math.ceil(shieldActiveRef.current / 60)}s`, 8, curH - 10);
      }
      if (rapidActiveRef.current > 0) {
        ctx.fillStyle = 'rgba(249,115,22,0.6)';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'right';
        ctx.fillText(`RAPID ${Math.ceil(rapidActiveRef.current / 60)}s`, curW - 8, curH - 10);
      }

      if (livesRef.current > 0) {
        gameLoopRef.current = requestAnimationFrame(update);
      }
    };

    gameLoopRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  return (
    <section className="relative py-20 border-t border-white/5 bg-primary-dark select-none overflow-hidden">
      
      {/* Toast alert HUD */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 bg-neutral-950/90 border border-[#FFD700]/30 rounded-2xl shadow-[0_0_35px_rgba(255,215,0,0.15)] backdrop-blur-xl flex items-center gap-3 pointer-events-none"
          >
            <Sparkles className="w-5 h-5 text-[#FFD700] animate-pulse" />
            <span className="font-mono text-sm text-white font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        
        {!isPlaying ? (
          <div className="space-y-6 py-12 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <Gamepad2 className="text-[#FFD54F] w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="font-syne font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Need a break from reading?
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light">
                Embark on a quick retro-arcade trip navigating the challenges of software engineering.
              </p>
            </div>
            <button
              onClick={() => setIsPlaying(true)}
              className="inline-flex items-center gap-2.5 bg-[#FFD54F] hover:bg-[#e5c100] text-black font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,213,79,0.2)] active:scale-95 cursor-pointer"
            >
              🎮 Play a quick game
            </button>
          </div>
        ) : (
          <div 
            ref={cwRef} 
            className="relative bg-[#07070f] border border-[#1e1e30] rounded-3xl max-w-3xl mx-auto overflow-hidden font-mono shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* HUD */}
            <div className="flex justify-between items-center bg-[#07070f] border-b border-[#1e1e30] px-4 md:px-6 py-3.5">
              <div className="text-center">
                <div className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">Score</div>
                <div ref={scoreSpanRef} className="text-sm md:text-base font-bold text-[#FFD700]">0</div>
              </div>
              <div className="text-center">
                <div className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Lives</div>
                <div ref={livesBarRef} className="flex gap-1 items-center justify-center" />
              </div>
              <div className="text-center">
                <div className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Ammo</div>
                <div ref={ammoBarRef} className="flex gap-0.5 items-center justify-center" />
              </div>
              <div className="text-center">
                <div className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">Kills</div>
                <div ref={killsSpanRef} className="text-sm md:text-base font-bold text-[#FFD700]">0</div>
              </div>
              <div className="text-center">
                <div className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5">Best</div>
                <div ref={bestSpanRef} className="text-sm md:text-base font-bold text-[#FFD700]">0</div>
              </div>
            </div>

            {/* Play Screen */}
            <div className="relative">
              <canvas 
                ref={canvasRef} 
                className="block w-full bg-[#050508] cursor-crosshair touch-none"
                height="440"
                onTouchStart={(e) => {
                  e.preventDefault();
                  const canvas = canvasRef.current;
                  if (!canvas || e.touches.length === 0) return;
                  const rect = canvas.getBoundingClientRect();
                  const touch = e.touches[0];
                  const scaleX = canvas.width / rect.width;
                  const scaleY = canvas.height / rect.height;
                  playerRef.current.x = Math.max(26, Math.min(canvas.width - 26, (touch.clientX - rect.left) * scaleX));
                  playerRef.current.y = Math.max(36, Math.min(canvas.height - 26, (touch.clientY - rect.top - 20) * scaleY));
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const canvas = canvasRef.current;
                  if (!canvas || e.touches.length === 0) return;
                  const rect = canvas.getBoundingClientRect();
                  const touch = e.touches[0];
                  const scaleX = canvas.width / rect.width;
                  const scaleY = canvas.height / rect.height;
                  playerRef.current.x = Math.max(26, Math.min(canvas.width - 26, (touch.clientX - rect.left) * scaleX));
                  playerRef.current.y = Math.max(36, Math.min(canvas.height - 26, (touch.clientY - rect.top - 20) * scaleY));
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  shoot();
                }}
              />

              {/* Game state overlay */}
              {gameState !== "playing" && (
                <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 z-20 text-center">
                  
                  {gameState === "idle" ? (
                    <>
                      <h4 className="text-sm md:text-base font-bold text-[#FFD700] tracking-[3px] uppercase mb-1">
                        MISSION: NAVIGATE THE JOURNEY
                      </h4>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-6">
                        YOUR MISSION BRIEFING
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl w-full text-left font-sans mb-6">
                        <div className="border border-[#1e1e30] rounded-xl p-3 bg-[#0a0a14]/60">
                          <h5 className="text-[9px] text-[#ff4455] font-mono tracking-widest uppercase mb-2">OBSTACLES — DESTROY OR DIE</h5>
                          <div className="space-y-1 text-[10px] text-neutral-400">
                            <div><span className="bg-[#ff4455]/10 border border-[#ff4455]/20 text-[#ff4455] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">BUG</span> Bug — 1 hit</div>
                            <div><span className="bg-[#ff6600]/10 border border-[#ff6600]/20 text-[#ff6600] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">DL</span> Deadline — 1 hit</div>
                            <div><span className="bg-[#cc2244]/10 border border-[#cc2244]/20 text-[#cc2244] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">ERR</span> Crash — 2 hits</div>
                            <div><span className="bg-[#ff3388]/10 border border-[#ff3388]/20 text-[#ff3388] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">404</span> Error — 2 hits</div>
                            <div><span className="bg-[#ff2200]/10 border border-[#ff2200]/20 text-[#ff2200] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">FAIL</span> Failure — 3 hits</div>
                          </div>
                        </div>

                        <div className="border border-[#1e1e30] rounded-xl p-3 bg-[#0a0a14]/60">
                          <h5 className="text-[9px] text-[#00cfff] font-mono tracking-widest uppercase mb-2">POWERUPS — COLLECT THEM</h5>
                          <div className="space-y-1 text-[10px] text-neutral-400">
                            <div><span className="bg-[#00cfff]/10 border border-[#00cfff]/20 text-[#00cfff] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">AI</span> <span className="text-[#00cfff]">+50 Ammo</span></div>
                            <div><span className="bg-[#a855f7]/10 border border-[#a855f7]/20 text-[#a855f7] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">BLK</span> <span className="text-[#a855f7]">Shield 5s</span></div>
                            <div><span className="bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">LDR</span> <span className="text-[#22c55e]">+30 Score</span></div>
                            <div><span className="bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">INN</span> <span className="text-[#f97316]">Rapid Fire</span></div>
                            <div><span className="bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-[8px] font-bold px-1.5 py-0.5 rounded mr-1.5 font-mono">GOL</span> <span className="text-[#FFD700]">+20 Ammo</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center gap-6 text-[9px] text-neutral-500 tracking-wider mb-6 font-mono">
                        <div>MOVE: <span className="text-white">WASD / ARROWS</span></div>
                        <div>SHOOT: <span className="text-white">SPACE / Z</span></div>
                        <div>LIVES: <span className="text-white">3 CHANCES</span></div>
                      </div>

                      <button
                        onClick={startGame}
                        className="bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold font-mono text-xs px-8 py-3 rounded-xl uppercase tracking-widest cursor-pointer shadow-[0_0_20px_rgba(255,215,0,0.25)]"
                      >
                        LAUNCH MISSION
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className="text-sm md:text-base font-bold text-red-500 tracking-[3px] uppercase mb-1">
                        MISSION COMPLETE
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-sans max-w-sm leading-relaxed mb-6">
                        "You've survived the same challenges that shaped my journey as a developer."
                      </p>

                      <div className="flex gap-8 justify-center items-center bg-[#0a0a14]/60 border border-[#1e1e30] rounded-xl px-8 py-4 mb-6">
                        <div className="text-center">
                          <div className="text-lg md:text-xl font-bold text-[#FFD700]">{score}</div>
                          <div className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">Score</div>
                        </div>
                        <div className="text-center border-x border-[#1e1e30] px-6">
                          <div className="text-lg md:text-xl font-bold text-[#FFD700]">{bestScore}</div>
                          <div className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">Best</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg md:text-xl font-bold text-[#FFD700]">{kills}</div>
                          <div className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">Kills</div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={startGame}
                          className="bg-[#FFD700] hover:bg-[#e6c200] text-black font-bold font-mono text-xs px-6 py-3 rounded-xl uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(255,215,0,0.15)]"
                        >
                          Play Again
                        </button>
                        <button
                          onClick={handleContinueToContact}
                          className="bg-white/5 hover:bg-white/10 text-white font-bold font-mono text-xs px-6 py-3 rounded-xl border border-white/10 uppercase tracking-widest cursor-pointer transition-colors flex items-center gap-1.5"
                        >
                          Continue <ArrowRight size={12} />
                        </button>
                      </div>
                    </>
                  )}

                </div>
              )}
            </div>

            {/* Instruction footer */}
            <div className="bg-[#07070f] border-t border-[#1e1e30] px-4 py-2 flex justify-center gap-4 text-[8px] md:text-[9px] text-neutral-600 tracking-wider">
              <span>WASD/ARROWS — MOVE</span>
              <span>|</span>
              <span>SPACE/Z — SHOOT</span>
              <span>|</span>
              <span>TOUCH — DRAG+TAP</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
