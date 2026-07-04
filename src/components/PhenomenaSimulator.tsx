import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Orbit, Sparkles, HelpCircle, Sun, CloudRain } from 'lucide-react';

type PhenomenonType = 'eclipse' | 'seasons' | 'meteors';

export default function PhenomenaSimulator({ theme }: { theme: 'dark' | 'light' }) {
  const [activeTab, setActiveTab] = useState<PhenomenonType>('eclipse');

  // Eclipse specific states
  const [eclipseSlider, setEclipseSlider] = useState(30); // 0 (Moon behind Earth), 50 (Moon between Sun and Earth), 100 (Moon behind Sun)
  
  // Seasons specific states
  const [seasonAngle, setSeasonAngle] = useState(0); // 0 = Spring, 90 = Summer (North tilt to sun), 180 = Autumn, 270 = Winter

  // Meteor shower specific states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteorTimer = useRef<number | null>(null);

  useEffect(() => {
    if (activeTab !== 'meteors') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle Classes
    interface Meteor {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      color: string;
      alpha: number;
      fadeSpeed: number;
    }

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      size: number;
    }

    let meteors: Meteor[] = [];
    let sparks: Spark[] = [];

    // Trigger a meteor from the radiant point (top-right)
    const spawnMeteor = (clickX?: number, clickY?: number) => {
      const startX = clickX ?? (Math.random() * canvas.width * 0.5 + canvas.width * 0.5);
      const startY = clickY ?? (Math.random() * canvas.height * 0.2);
      
      // Speed downwards and leftwards
      const angle = Math.PI * 0.75 + (Math.random() * 0.15 - 0.075); // ~135 degrees
      const speed = 8 + Math.random() * 12;

      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 40 + Math.random() * 80,
        color: Math.random() > 0.5 ? '#f59e0b' : '#38bdf8', // Amber or sky blue
        alpha: 1,
        fadeSpeed: 0.015 + Math.random() * 0.01
      });
    };

    // Auto spawn meteors
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        spawnMeteor();
      }
    }, 150);

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Spawn meteor right there!
      spawnMeteor(x, y);
      
      // Add lots of sparks as a splash
      for (let i = 0; i < 15; i++) {
        sparks.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          color: '#f59e0b',
          alpha: 1,
          size: Math.random() * 2 + 1
        });
      }
    };

    canvas.addEventListener('mousedown', handleCanvasClick);

    // Render loop
    const render = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.25)'; // trail smear
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Radiant Point indicator
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(canvas.width * 0.85, canvas.height * 0.15, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.font = '9px var(--font-mono)';
      ctx.fillText("辐射源", canvas.width * 0.85 - 13, canvas.height * 0.15 + 3);

      // Render Meteors
      meteors = meteors.filter((m) => {
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= m.fadeSpeed;

        if (m.alpha <= 0 || m.x < -100 || m.y > canvas.height + 100) {
          // Spark splash on burnout
          if (m.alpha > 0) {
            for (let i = 0; i < 4; i++) {
              sparks.push({
                x: m.x,
                y: m.y,
                vx: m.vx * 0.2 + (Math.random() - 0.5) * 2,
                vy: m.vy * 0.2 + (Math.random() - 0.5) * 2,
                color: m.color,
                alpha: 1,
                size: Math.random() * 1.5 + 0.5
              });
            }
          }
          return false;
        }

        // Draw meteor trail gradient
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 3, m.y - m.vy * 3);
        grad.addColorStop(0, m.color);
        grad.addColorStop(0.3, `rgba(255, 255, 255, ${m.alpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 2, m.y - m.vy * 2);
        ctx.stroke();

        return true;
      });

      // Render Sparks
      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.02;

        if (s.alpha <= 0) return false;

        ctx.fillStyle = `rgba(245, 158, 11, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      meteorTimer.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleCanvasClick);
      clearInterval(interval);
      if (meteorTimer.current) cancelAnimationFrame(meteorTimer.current);
    };
  }, [activeTab]);

  // Eclipse calculations
  const isSolarEclipse = Math.abs(eclipseSlider - 50) < 6;
  const isLunarEclipse = Math.abs(eclipseSlider - 12) < 6;

  // Seasons calculations
  const getSeasonInfo = () => {
    // 0 = Spring, 90 = Summer, 180 = Autumn, 270 = Winter
    const angle = (seasonAngle % 360 + 360) % 360;
    if (angle >= 45 && angle < 135) {
      return {
        name: "夏季 (Summer)",
        explain: "此时地球北极朝向太阳倾斜，太阳光垂直照射北半球（北回归线）。北半球接收到最多光热，因此迎来炎热的夏季；相反，南半球斜射严重，正是寒冷的冬季。",
        tiltText: "北极面向太阳倾斜 23.5°",
        colorClass: "text-red-400 bg-red-500/10 border-red-500/20"
      };
    } else if (angle >= 135 && angle < 225) {
      return {
        name: "秋季 (Autumn)",
        explain: "地球运行至秋分点，太阳光直射赤道。南北半球获得的光热均匀对等。叶落归根，天气逐渐由热转凉，昼夜长度再次相等。",
        tiltText: "太阳直射赤道（南北均等）",
        colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20"
      };
    } else if (angle >= 225 && angle < 315) {
      return {
        name: "冬季 (Winter)",
        explain: "此时地球北极背向太阳倾斜，南极朝着太阳。太阳直射南半球（南回归线），北半球斜射极为严重，昼短夜长，迎来白雪皑皑的寒冬。",
        tiltText: "北极背向太阳倾斜 23.5°",
        colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20"
      };
    } else {
      return {
        name: "春季 (Spring)",
        explain: "地球运行至春分点，太阳光直射赤道，阳光均匀洒向地球两端。大地回春，万物复苏，南北半球温度宜人，昼夜几乎等长。",
        tiltText: "太阳直射赤道（南北均等）",
        colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      };
    }
  };

  const seasonInfo = getSeasonInfo();

  return (
    <div className="flex flex-col h-full bg-slate-900/30" id="phenomena-simulator-section">
      {/* Category Tabs */}
      <div className="flex border-b border-white/5 bg-slate-900/50 p-2 gap-1.5 shrink-0" id="phenomena-tabs-container">
        <button
          onClick={() => setActiveTab('eclipse')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'eclipse' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          id="tab-eclipse"
        >
          <Sun className="w-3.5 h-3.5" />
          日食与月食模拟
        </button>

        <button
          onClick={() => setActiveTab('seasons')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'seasons' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          id="tab-seasons"
        >
          <Orbit className="w-3.5 h-3.5" />
          四季更替成因
        </button>

        <button
          onClick={() => setActiveTab('meteors')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'meteors' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          id="tab-meteors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          流星雨连点器
        </button>
      </div>

      {/* Simulator Display Body */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col justify-between" id="phenomena-body-display">
        
        {/* ==================== 1. ECLIPSE SIMULATION ==================== */}
        {activeTab === 'eclipse' && (
          <div className="flex flex-col h-full justify-between gap-4" id="eclipse-simulator-view">
            <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-white/5">
              
              {/* Stars background */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_70%)] bg-[size:20px_20px]"></div>

              {/* Draw static Sun (Left side) */}
              <div className="absolute left-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-500 shadow-[0_0_50px_10px_rgba(245,158,11,0.6)] flex items-center justify-center">
                  <Sun className="w-8 h-8 text-white animate-pulse" />
                </div>
                <span className="text-[10px] text-amber-400 font-mono mt-1">太阳 (Sun)</span>
              </div>

              {/* Draw static Earth (Right side) */}
              <div className="absolute right-8 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 border border-blue-400 overflow-hidden relative shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  {/* Night side of Earth */}
                  <div className="absolute inset-y-0 left-1/2 right-0 bg-black/60"></div>
                </div>
                <span className="text-[10px] text-blue-400 font-mono mt-1">地球 (Earth)</span>
              </div>

              {/* Dynamic Moon (Moves horizontally with slider) */}
              {/* Range mapping: 0 to 100 on slider maps to Left=60px to Right=280px (adapted dynamically) */}
              <div 
                className="absolute flex flex-col items-center transition-all duration-100 ease-out z-10"
                style={{ 
                  left: `calc(50px + ${eclipseSlider}% * 0.58)`,
                  transform: 'translateX(-50%)',
                  top: '40%'
                }}
              >
                <div className={`w-6 h-6 rounded-full bg-slate-400 border border-slate-500 shadow-md relative ${isSolarEclipse ? 'shadow-[0_0_15px_#f59e0b]' : ''} ${isLunarEclipse ? 'bg-red-800 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}>
                  {/* Shadow overlay on moon */}
                  <div className="absolute inset-y-0 left-1/2 right-0 bg-black/50"></div>
                </div>
                <span className={`text-[9px] font-mono mt-1 ${isSolarEclipse ? 'text-amber-400 font-bold' : isLunarEclipse ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
                  月球
                </span>
              </div>

              {/* Ray Lines - Solar Eclipse Shadow Cones */}
              {isSolarEclipse && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Shadow cone from Moon to Earth */}
                    <polygon points="120,112 250,112 250,122 120,112" fill="rgba(0,0,0,0.8)" />
                    {/* Penumbra */}
                    <polygon points="120,112 250,95 250,135 120,112" fill="rgba(0,0,0,0.35)" />
                    {/* Glowing Sun Rays hitting Moon */}
                    <line x1="60" y1="112" x2="110" y2="112" stroke="rgba(245,158,11,0.4)" strokeWidth="1" strokeDasharray="3,3" />
                  </svg>
                </div>
              )}

              {/* Ray Lines - Lunar Eclipse Shadow Cones */}
              {isLunarEclipse && (
                <div className="absolute inset-0 pointer-events-none z-0">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Shadow cone from Earth to Moon */}
                    <polygon points="250,112 315,108 315,116 250,112" fill="rgba(220,38,38,0.3)" />
                    {/* Sun rays to Earth */}
                    <line x1="60" y1="112" x2="240" y2="112" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
                  </svg>
                </div>
              )}
            </div>

            {/* Dynamic Interactive Banner Indicator */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">滑动月球轨道位置:</span>
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  {isSolarEclipse ? "🌞 形成日食 (Solar Eclipse)" : isLunarEclipse ? "🌖 形成月食 (Lunar Eclipse)" : "🌕 正常公转轨道"}
                </span>
              </div>

              {/* Range Input Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={eclipseSlider}
                onChange={(e) => setEclipseSlider(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-800 accent-amber-500 cursor-pointer"
                id="eclipse-position-slider"
              />

              {/* Explanations */}
              <AnimatePresence mode="wait">
                {isSolarEclipse ? (
                  <motion.div
                    key="solar"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs leading-relaxed text-amber-200"
                  >
                    <strong className="block text-amber-400 mb-1">日全食成因 (月球挡住太阳):</strong>
                    当月球正好运行到太阳与地球的正中间时，月亮会把射向地球的阳光全部挡住，它投下的阴影（本影区）落在地球表面。在阴影里的人们就会看到太阳仿佛被咬掉一口，甚至完全黑掉！
                  </motion.div>
                ) : isLunarEclipse ? (
                  <motion.div
                    key="lunar"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs leading-relaxed text-red-200"
                  >
                    <strong className="block text-red-400 mb-1">月全食成因 (地球挡住月球):</strong>
                    当地球正好走到太阳和月球的正中间时，地球庞大的身体在太空中投下的巨大阴影会将月球完全吞没。月球失去了直接照射它的阳光，只有极少量折射红光打在上面，呈现出诡异好看的“红月亮”。
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-xl bg-slate-800/40 text-slate-400 text-xs leading-normal flex items-start gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
                    <span>
                      请左右拖动滑动块！当月球滑到<b>正中间 (数值 ~50)</b>时会触发日食；当月亮滑到<b>左侧 (数值 ~12)</b>进入地球影子时会触发红月亮月食。
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ==================== 2. SEASONS SIMULATION ==================== */}
        {activeTab === 'seasons' && (
          <div className="flex flex-col h-full justify-between gap-4" id="seasons-simulator-view">
            
            {/* Diagram of Orbit & Tilt */}
            <div className="relative w-full h-48 bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
              
              {/* Central Sun */}
              <div className="absolute w-12 h-12 rounded-full bg-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.5)] flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>

              {/* Earth Orbit circle */}
              <div className="absolute w-72 h-32 rounded-full border border-dashed border-white/10"></div>

              {/* Earth along orbit */}
              {/* We map angle to elliptical coordinates */}
              {(() => {
                const rX = 144;
                const rY = 64;
                const radians = (seasonAngle * Math.PI) / 180;
                // Offset around center
                const earthX = Math.cos(radians) * rX;
                const earthY = Math.sin(radians) * rY;

                return (
                  <div 
                    className="absolute z-10 flex flex-col items-center transition-all duration-150 ease-out"
                    style={{
                      transform: `translate(${earthX}px, ${earthY}px)`
                    }}
                  >
                    {/* Earth Sphere tilted 23.5 degrees */}
                    <div className="relative w-9 h-9 rounded-full bg-blue-500 shadow-md border border-blue-400 overflow-hidden flex items-center justify-center">
                      {/* Rotating tilt axis line */}
                      <div className="absolute w-12 h-[1px] bg-slate-200 rotate-[113.5deg]"></div>
                      
                      {/* Shadows relative to central sun */}
                      {/* The shadow side is always facing away from the center (0,0) */}
                      {/* We can approximate this by drawing an overlay shadow */}
                      <div 
                        className="absolute inset-0 bg-black/60 pointer-events-none"
                        style={{
                          transform: `rotate(${seasonAngle}deg)`,
                          transformOrigin: 'center',
                          clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                        }}
                      ></div>
                    </div>

                    <span className="text-[9px] font-mono bg-slate-900/80 px-1 py-0.5 rounded text-blue-300 mt-1 shadow-xs border border-white/5">
                      地球
                    </span>
                  </div>
                );
              })()}

              {/* Solar direct rays */}
              {/* spring/autumn direct to center, summer direct to right/left tilt etc */}
              <div className="absolute pointer-events-none w-full h-full flex items-center justify-center">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Arrow from sun towards orbit depending on position */}
                </svg>
              </div>
            </div>

            {/* Orbit rotate control */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">改变地球轨道位置 (公转):</span>
                <span className="text-xs text-indigo-400 font-semibold font-mono">
                  公转夹角: {seasonAngle}°
                </span>
              </div>

              {/* Rotation buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "春分 (0°)", val: 0 },
                  { name: "夏至 (90°)", val: 90 },
                  { name: "秋分 (180°)", val: 180 },
                  { name: "冬至 (270°)", val: 270 }
                ].map((pos) => (
                  <button
                    key={pos.val}
                    onClick={() => setSeasonAngle(pos.val)}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      seasonAngle === pos.val 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-xs' 
                        : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700/50'
                    }`}
                  >
                    {pos.name}
                  </button>
                ))}
              </div>

              {/* Explanation panel */}
              <div className={`p-3 rounded-xl border text-xs leading-relaxed transition-all duration-300 ${seasonInfo.colorClass}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <strong className="text-sm font-bold font-display">{seasonInfo.name}</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 font-mono uppercase">
                    {seasonInfo.tiltText}
                  </span>
                </div>
                {seasonInfo.explain}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. METEORS SHOWER SIMULATION ==================== */}
        {activeTab === 'meteors' && (
          <div className="flex flex-col h-full justify-between gap-4" id="meteors-simulator-view">
            
            {/* Interactive Canvas */}
            <div className="relative w-full h-56 bg-slate-950 rounded-2xl overflow-hidden border border-white/5 group">
              <canvas ref={canvasRef} className="block w-full h-full cursor-pointer" />
              
              {/* Interactive Floating Hover Prompt */}
              <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-900/85 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-purple-300 border border-purple-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>任意点击黑夜，可在该处点燃并滑落流星！</span>
              </div>
            </div>

            {/* Trivia Info */}
            <div className="flex-1 flex flex-col gap-2">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-purple-400" />
                流星雨形成科普：
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/35 p-3 rounded-xl border border-white/5">
                流星并不是真正的“天星坠落”！彗星（脏雪球）在接近太阳时会融化剥落大量沙尘颗粒留在轨道上。
                当生命力顽强的地球每年穿过这条碎屑带时，碎屑以超过<b>每秒30公里</b>的速度高速滑入大气层，剧烈摩擦生热、化为灰烬。那些一闪而过、炫目的长尾光带，其实大多只是一粒<b>绿豆甚至细沙大小</b>的冰晶和尘埃哦！
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
