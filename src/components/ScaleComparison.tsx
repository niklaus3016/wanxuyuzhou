import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, Eye, ArrowRight, Sparkles, Scale } from 'lucide-react';

interface ScaleStep {
  id: number;
  title: string;
  leftName: string;
  leftSizeText: string;
  leftColor: string;
  rightName: string;
  rightSizeText: string;
  rightColor: string;
  ratioText: string;
  ratioDescription: string;
  mindBlowingFact: string;
}

const SCALE_STEPS: ScaleStep[] = [
  {
    id: 1,
    title: "1. 人类 vs 珠穆朗玛峰",
    leftName: "人类 (身高)",
    leftSizeText: "约 1.7 米",
    leftColor: "bg-amber-400",
    rightName: "珠穆朗玛峰 (高度)",
    rightSizeText: "8848.86 米",
    rightColor: "bg-slate-400",
    ratioText: "1 : 5200",
    ratioDescription: "珠穆朗玛峰的高度相当于将大约 5200 个成年人首尾相接、叠罗汉一样往上累积的高度！",
    mindBlowingFact: "对于人类来说高耸入云的世界屋脊，在地球本身的大小面前，甚至连一粒微尘的凹凸都算不上。"
  },
  {
    id: 2,
    title: "2. 珠穆朗玛峰 vs 地球",
    leftName: "珠穆朗玛峰 (高度)",
    leftSizeText: "约 8.8 千米",
    leftColor: "bg-slate-400",
    rightName: "地球 (直径)",
    rightSizeText: "12,742 千米",
    rightColor: "bg-blue-500",
    ratioText: "1 : 1440",
    ratioDescription: "地球的直径长度，相当于 1440 座珠穆朗玛峰叠在一起！",
    mindBlowingFact: "如果把地球缩小到台球大小，地球表面其实比台球还要光滑，珠穆朗玛峰和马里亚纳海沟只是肉眼几乎摸不出来的微小起伏。"
  },
  {
    id: 3,
    title: "3. 地球 vs 木星",
    leftName: "地球 (直径)",
    leftSizeText: "12,742 千米",
    leftColor: "bg-blue-500",
    rightName: "木星 (直径)",
    rightSizeText: "139,820 千米",
    rightColor: "bg-orange-400",
    ratioText: "1 : 11",
    ratioDescription: "木星的直径是地球的 11 倍多。这意味着，你可以将 11 个地球并排排成一列穿过木星的核心！",
    mindBlowingFact: "木星是如此庞大，它的体内可以轻而易举地塞下 1300 个地球。地球在木星面前就像一粒小弹珠放在排球旁边。"
  },
  {
    id: 4,
    title: "4. 木星 vs 太阳",
    leftName: "木星 (直径)",
    leftSizeText: "139,820 千米",
    leftColor: "bg-orange-400",
    rightName: "太阳 (直径)",
    rightSizeText: "1,392,700 千米",
    rightColor: "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    ratioText: "1 : 10",
    ratioDescription: "太阳系的老大太阳，直径是巨无霸木星的 10 倍！",
    mindBlowingFact: "太阳占整个太阳系全部质量的 99.86%。如果你把太阳比作一个西瓜，木星只是一颗葡萄，而我们的地球只是一粒极细的沙子。"
  },
  {
    id: 5,
    title: "5. 太阳 vs 盾牌座 UY (超大红巨星)",
    leftName: "太阳 (直径)",
    leftSizeText: "139 万千米",
    leftColor: "bg-red-500",
    rightName: "盾牌座 UY (红超巨星)",
    rightSizeText: "约 24 亿千米",
    rightColor: "bg-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.6)]",
    ratioText: "1 : 1700",
    ratioDescription: "盾牌座 UY 是人类已知体积最大的恒星之一，它的半径是太阳的 1700 倍左右！",
    mindBlowingFact: "如果把盾牌座 UY 放在太阳的位置，它的庞大身体将吞没水星、金星、地球、火星和木星的轨道，边缘逼近土星！它的体内能塞下约 50 亿个太阳！"
  },
  {
    id: 6,
    title: "6. 盾牌座 UY vs 银河系",
    leftName: "盾牌座 UY (直径)",
    leftSizeText: "24 亿千米",
    leftColor: "bg-rose-600",
    rightName: "银河系 (直径)",
    rightSizeText: "约 10 万光年 (95京公里)",
    rightColor: "bg-indigo-400/90 shadow-[0_0_20px_rgba(129,140,248,0.4)]",
    ratioText: "1 : 400万亿",
    ratioDescription: "在长达 10 万光年的银河系面前，即使是吞没半个太阳系的巨星盾牌座UY，比例也是无比绝望的 1 比 400万亿！",
    mindBlowingFact: "银河系里聚集着多达 2000亿 到 4000亿 颗像太阳一样发光发热的恒星。超级恒星在银河星河里，只是沧海一粟。"
  },
  {
    id: 7,
    title: "7. 银河系 vs 可观测宇宙",
    leftName: "银河系 (直径)",
    leftSizeText: "10 万光年",
    leftColor: "bg-indigo-400",
    rightName: "可观测宇宙 (直径)",
    rightSizeText: "约 930 亿光年",
    rightColor: "bg-purple-600 shadow-[0_0_35px_rgba(147,51,234,0.5)]",
    ratioText: "1 : 930,000",
    ratioDescription: "人类目前用最先进望远镜所能看见的“可观测宇宙”边界直径，大约是银河系的 93 万倍！",
    mindBlowingFact: "可观测宇宙里至少包含有 2 万亿个像银河系一样宏伟的星系。宇宙的浩瀚已经超越了人类数学与视觉能想象的物理极限。"
  }
];

export default function ScaleComparison({ theme }: { theme: 'dark' | 'light' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // Default at Earth vs Jupiter (very intuitive)

  const step = SCALE_STEPS[currentStepIndex];

  return (
    <div className="flex flex-col h-full bg-slate-900/10" id="scale-comparison-section">
      
      {/* Header and Step Name */}
      <div className="px-4 py-3 border-b border-white/5 bg-slate-900/30 shrink-0">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-display">
          <Scale className="w-4 h-4 text-amber-500 animate-pulse" />
          宇宙大小尺寸对比
        </h3>
        <p className="text-[11px] text-slate-400">滑动或切换步骤，直观感受不可思议的宇宙大小差距</p>
      </div>

      {/* Visualizer Frame */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-4" id="scale-visualizer-body">
        
        {/* Relative size sphere containers */}
        <div className="relative h-44 bg-slate-950 rounded-2xl flex items-center justify-around overflow-hidden border border-white/5" id="spheres-container">
          
          {/* Static starry glow backdrops */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,rgba(0,0,0,0)_80%)]"></div>

          <AnimatePresence mode="wait">
            {/* Left Small Object */}
            <motion.div 
              key={`left-${step.id}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex flex-col items-center z-10"
            >
              {/* Left Circle: Render fixed baseline size */}
              <div className="h-20 flex items-center justify-center">
                <div className={`w-6 h-6 rounded-full ${step.leftColor} flex items-center justify-center`}>
                  <span className="text-[6px] text-slate-950 font-bold">1</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-white mt-2 text-center font-display">{step.leftName}</p>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">{step.leftSizeText}</p>
            </motion.div>
          </AnimatePresence>

          {/* Scale signifier */}
          <div className="flex flex-col items-center justify-center py-2 px-3 rounded-lg bg-white/5 border border-white/5 shrink-0 z-10 max-w-[100px]">
            <span className="text-[9px] text-slate-400 font-mono">相对比例</span>
            <span className="text-xs font-bold text-amber-400 font-mono my-0.5">{step.ratioText}</span>
            <span className="text-[8px] text-slate-400 text-center leading-tight">相邻对比</span>
          </div>

          <AnimatePresence mode="wait">
            {/* Right Large Object */}
            <motion.div 
              key={`right-${step.id}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex flex-col items-center z-10"
            >
              {/* Right Circle: Render larger representation */}
              <div className="h-20 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full ${step.rightColor} flex items-center justify-center`}>
                  <span className="text-[9px] text-slate-950 font-extrabold font-mono">Max</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-white mt-2 text-center font-display">{step.rightName}</p>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">{step.rightSizeText}</p>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Step Slider Navigation */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">拖拽跨度游标:</span>
            <span className="text-amber-400 font-bold font-display">{step.title}</span>
          </div>

          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={currentStepIndex}
            onChange={(e) => setCurrentStepIndex(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 accent-amber-500 cursor-pointer"
            id="scale-comparison-slider"
          />

          {/* Quick buttons */}
          <div className="flex justify-between text-[9px] text-slate-400 font-mono font-semibold">
            <span>人类 🧔</span>
            <span>地球 🌍</span>
            <span>恒星 🌞</span>
            <span>星系 🌌</span>
          </div>

          {/* Comparison descriptions and mind-blowing facts */}
          <div className="flex flex-col gap-2.5">
            {/* Description card */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-white/5 text-xs text-slate-300 leading-relaxed">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold block mb-1">
                比例关系
              </span>
              {step.ratioDescription}
            </div>

            {/* Mind blowing fact card */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed flex items-start gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-400 block mb-0.5">颠覆认知的宇宙真相:</strong>
                {step.mindBlowingFact}
              </div>
            </div>
          </div>

        </div>

        {/* Next step prompt */}
        {currentStepIndex < 6 && (
          <button
            onClick={() => setCurrentStepIndex((prev) => prev + 1)}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 border border-white/5 cursor-pointer active:scale-98 transition-all"
            id="next-scale-step-btn"
          >
            迈入下一级尺度对比
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
}
