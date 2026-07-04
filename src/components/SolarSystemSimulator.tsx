import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Info, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface PlanetConfig {
  id: string;
  name: string;
  engName: string;
  distance: number; // Orbit radius
  size: number;
  speed: number;
  color: string;
  details: string;
  features: string[];
}

const PLANETS_DATA: PlanetConfig[] = [
  {
    id: "mercury",
    name: "水星",
    engName: "Mercury",
    distance: 55,
    size: 4,
    speed: 0.04,
    color: "#9ca3af",
    details: "最靠近太阳的行星，温差极大，没有大气保护，半边冰山半边火焰。",
    features: ["温差超 600℃", "最快的公转速度", "布满环形山"]
  },
  {
    id: "venus",
    name: "金星",
    engName: "Venus",
    distance: 80,
    size: 7,
    speed: 0.02,
    color: "#f59e0b",
    details: "浓厚二氧化碳引发恐怖的温室效应，地表温度超过460℃，是极热地狱。",
    features: ["温室效应地狱", "倒着自转", "夜空中最亮的星"]
  },
  {
    id: "earth",
    name: "地球",
    engName: "Earth",
    distance: 110,
    size: 8,
    speed: 0.012,
    color: "#3b82f6",
    details: "我们唯一的蔚蓝家园，拥有丰富的液态水、氧气和繁茂生命。",
    features: ["完美磁场防护", "液态水海洋", "活跃的板块运动"]
  },
  {
    id: "mars",
    name: "火星",
    engName: "Mars",
    distance: 145,
    size: 6,
    speed: 0.008,
    color: "#ef4444",
    details: "砖红色铁锈沙尘覆盖的荒漠世界，人类星际探索和移居的最热焦点。",
    features: ["拥有太阳系最高火山", "极度稀薄大气", "两极存在干冰冰盖"]
  },
  {
    id: "jupiter",
    name: "木星",
    engName: "Jupiter",
    distance: 190,
    size: 14,
    speed: 0.004,
    color: "#f59e0b",
    details: "太阳系行星之王，超级气态巨无霸，表面刮着数百年不息的超级风暴大红斑。",
    features: ["体积极其庞大", "超级风暴大红斑", "强劲的地球防弹保镖"]
  },
  {
    id: "saturn",
    name: "土星",
    engName: "Saturn",
    distance: 240,
    size: 12,
    speed: 0.002,
    color: "#fbbf24",
    details: "拥有太阳系最宽广、最壮丽星环的气态巨行星，密度比水还低，可漂在水面。",
    features: ["梦幻宽阔星环", "密度小于水", "由氢和氦气体构成"]
  },
  {
    id: "uranus",
    name: "天王星",
    engName: "Uranus",
    distance: 285,
    size: 9,
    speed: 0.0009,
    color: "#22d3ee",
    details: "冰巨星，全身呈美丽的青蓝色。它像滚动的保龄球一样“躺着”绕太阳转。",
    features: ["躺着自转的奇葩", "极寒冰巨星", "微弱的行星环"]
  },
  {
    id: "neptune",
    name: "海王星",
    engName: "Neptune",
    distance: 330,
    size: 9,
    speed: 0.0006,
    color: "#2563eb",
    details: "深邃蔚蓝的太阳系边疆使者，表面刮着时速高达2100公里的超音速狂风。",
    features: ["深蓝色甲烷大气", "太阳系风速之王", "轨道被冥王星交叉"]
  }
];

interface SolarSystemSimulatorProps {
  onSelectPlanet: (id: string) => void;
  theme: 'dark' | 'light';
}

export default function SolarSystemSimulator({ onSelectPlanet, theme }: SolarSystemSimulatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1x, 2x, 4x
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetConfig | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetConfig | null>(null);

  // Keep tracking positions for clicking
  const planetsPositionsRef = useRef<{ [key: string]: { x: number; y: number } }>({});
  const animationFrameId = useRef<number | null>(null);
  const anglesRef = useRef<{ [key: string]: number }>({
    mercury: Math.random() * Math.PI * 2,
    venus: Math.random() * Math.PI * 2,
    earth: Math.random() * Math.PI * 2,
    mars: Math.random() * Math.PI * 2,
    jupiter: Math.random() * Math.PI * 2,
    saturn: Math.random() * Math.PI * 2,
    uranus: Math.random() * Math.PI * 2,
    neptune: Math.random() * Math.PI * 2,
  });

  // Handle ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Compensate for display scaling
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate static background stars once
    const starCount = 100;
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: 0.01 + Math.random() * 0.015
      });
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear Screen
      if (theme === 'dark') {
        ctx.fillStyle = '#030712'; // Deep space dark
      } else {
        ctx.fillStyle = '#f8fafc'; // Clean light sky
      }
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Twinkling Background Stars (only in dark mode for immersion)
      if (theme === 'dark') {
        stars.forEach((star) => {
          star.alpha += star.speed;
          if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.2, Math.min(1, star.alpha))})`;
          ctx.beginPath();
          ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw Sun Glow and Sun
      const sunRadius = 20;
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, sunRadius * 2.5);
      if (theme === 'dark') {
        sunGradient.addColorStop(0, '#ffffff');
        sunGradient.addColorStop(0.2, '#fef08a'); // Amber-100
        sunGradient.addColorStop(0.5, '#f59e0b'); // Amber-500
        sunGradient.addColorStop(1, 'rgba(245, 158, 11, 0)');
      } else {
        sunGradient.addColorStop(0, '#fef08a');
        sunGradient.addColorStop(0.5, '#f59e0b');
        sunGradient.addColorStop(1, 'rgba(245, 158, 11, 0.15)');
      }
      ctx.fillStyle = sunGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Core Sun Sphere
      ctx.fillStyle = '#f97316'; // Orange-500
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic scale adaptation based on container size
      // We want to fit 330px distance of Neptune inside the canvas width/height.
      // So scale factor = Min(width, height) / 720
      const sizeScale = Math.min(width, height) / 740;

      // Render Orbits & Update Angles
      PLANETS_DATA.forEach((planet) => {
        const orbitRadius = planet.distance * sizeScale;

        // Draw Orbit Line
        if (showOrbits) {
          ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          // Draw circular orbits (can also draw subtle perspective ellipse if tilted, let's keep circular for pristine clarity)
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Update angle if playing
        if (isPlaying) {
          anglesRef.current[planet.id] += planet.speed * speedMultiplier * 0.5;
        }

        const angle = anglesRef.current[planet.id];
        const planetX = centerX + Math.cos(angle) * orbitRadius;
        const planetY = centerY + Math.sin(angle) * orbitRadius;

        // Save current positions for clicking / interaction
        planetsPositionsRef.current[planet.id] = { x: planetX, y: planetY };

        // Highlight Orbit / glow if hovered or selected
        const isSel = selectedPlanet?.id === planet.id;
        const isHov = hoveredPlanet?.id === planet.id;

        if (isSel || isHov) {
          ctx.strokeStyle = isSel ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.2)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Moon for Earth
        if (planet.id === 'earth') {
          const moonOrbit = 14 * sizeScale;
          const moonAngle = angle * 4.5; // Rotate faster
          const moonX = planetX + Math.cos(moonAngle) * moonOrbit;
          const moonY = planetY + Math.sin(moonAngle) * moonOrbit;
          
          ctx.fillStyle = theme === 'dark' ? '#9ca3af' : '#64748b';
          ctx.beginPath();
          ctx.arc(moonX, moonY, 2, 0, Math.PI * 2);
          ctx.fill();

          // Dotted moon orbit
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(planetX, planetY, moonOrbit, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Saturn Rings
        if (planet.id === 'saturn') {
          ctx.save();
          ctx.translate(planetX, planetY);
          ctx.rotate(0.3); // Ring tilt
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(0, 0, planet.size * 1.8, planet.size * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Draw Planet Sphere
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(planetX, planetY, planet.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw Selection Glow
        if (isSel) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(planetX, planetY, planet.size + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw Labels
        if (showLabels) {
          ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.8)';
          ctx.font = '500 10px var(--font-display)';
          ctx.textAlign = 'center';
          ctx.fillText(planet.name, planetX, planetY - planet.size - 6);
        }
      });

      ctx.restore();
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, speedMultiplier, showOrbits, showLabels, selectedPlanet, hoveredPlanet, theme]);

  // Handle Mouse Hover / Move to detect planet hits
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hit: PlanetConfig | null = null;
    const sizeScale = Math.min(rect.width, rect.height) / 740;

    for (let planet of PLANETS_DATA) {
      const pos = planetsPositionsRef.current[planet.id];
      if (pos) {
        // Larger touch target on mobile/smaller screen for usability
        const touchRadius = Math.max(planet.size + 12, 22 * sizeScale);
        const dist = Math.hypot(x - pos.x, y - pos.y);
        if (dist < touchRadius) {
          hit = planet;
          break;
        }
      }
    }

    setHoveredPlanet(hit);
    canvas.style.cursor = hit ? 'pointer' : 'default';
  };

  // Handle Canvas Tap / Click to Select
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let clicked: PlanetConfig | null = null;
    const sizeScale = Math.min(rect.width, rect.height) / 740;

    for (let planet of PLANETS_DATA) {
      const pos = planetsPositionsRef.current[planet.id];
      if (pos) {
        const touchRadius = Math.max(planet.size + 15, 25 * sizeScale);
        const dist = Math.hypot(x - pos.x, y - pos.y);
        if (dist < touchRadius) {
          clicked = planet;
          break;
        }
      }
    }

    setSelectedPlanet(clicked);
  };

  return (
    <div className="flex flex-col h-full select-none" id="solar-system-simulation-container">
      {/* Title & Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-slate-900/40">
        <div>
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            3D 太阳系模拟沙盘
          </h3>
          <p className="text-xs text-slate-400">支持拖动缩放或点击星球查看通俗百科卡片</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl transition-all ${
              isPlaying ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            } cursor-pointer`}
            title={isPlaying ? "暂停运行" : "开始运行"}
            id="control-play-pause"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Speed Multiplier */}
          <button
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
            id="control-speed-multiplier"
          >
            <RotateCcw className="w-3 h-3 animate-spin" style={{ animationDuration: isPlaying ? `${6 / speedMultiplier}s` : '0s' }} />
            {speedMultiplier}x 速度
          </button>

          {/* Orbits path toggling */}
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`p-2 rounded-xl transition-all ${
              showOrbits ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-slate-800 text-slate-400'
            } cursor-pointer`}
            title="开关轨道线"
            id="control-toggle-orbits"
          >
            {showOrbits ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Labels toggling */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-2 rounded-xl transition-all ${
              showLabels ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30' : 'bg-slate-800 text-slate-400'
            } cursor-pointer`}
            title="开关星体标签"
            id="control-toggle-labels"
          >
            <span className="text-xs font-semibold px-1">{showLabels ? "词" : "空"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Stage */}
      <div ref={containerRef} className="relative flex-1 bg-slate-950 overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          className="block w-full h-full"
        />

        {/* Initial helper tip */}
        {!selectedPlanet && (
          <div className="absolute top-4 left-4 pointer-events-none glass-panel px-3 py-2 rounded-xl max-w-[200px] border-slate-700/50">
            <p className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              交互提示：
            </p>
            <p className="text-[11px] text-slate-300 mt-1 leading-normal">
              点击轨道上的任意星球，可自动锁定制动，并展开趣味知识卡片。
            </p>
          </div>
        )}

        {/* Floating Planet Detail Panel on selection */}
        <AnimatePresence>
          {selectedPlanet && (
            <motion.div
              initial={{ opacity: 0, x: 100, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100, y: 10 }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-4 bottom-4 left-4 md:left-auto md:w-80 glass-panel rounded-2xl p-5 border-slate-700/80 shadow-2xl overflow-hidden"
              id="planet-detail-floating-card"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl opacity-10" style={{ backgroundColor: selectedPlanet.color }}></div>

              {/* Close Card */}
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer text-xs"
                id="close-planet-floating-card"
              >
                ✕
              </button>

              {/* Planet Title */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-3.5 h-3.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: selectedPlanet.color }}></span>
                <div>
                  <h4 className="text-lg font-bold font-display text-white">{selectedPlanet.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{selectedPlanet.engName}</p>
                </div>
              </div>

              {/* Plain introduction */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {selectedPlanet.details}
              </p>

              {/* Feature Tags */}
              <div className="flex flex-col gap-1.5 mb-4">
                {selectedPlanet.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-white/5 px-2 py-1 rounded-lg">
                    <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                    {feat}
                  </div>
                ))}
              </div>

              {/* Action Link to encyclopedia details */}
              <button
                onClick={() => {
                  onSelectPlanet(selectedPlanet.id);
                  setSelectedPlanet(null);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-semibold shadow-lg active:scale-98 transition-all cursor-pointer"
                id="go-to-planet-wiki-btn"
              >
                进入星体百科详情
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
