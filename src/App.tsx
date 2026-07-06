import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, BookOpen, Compass, GraduationCap, Settings, 
  Search, ChevronRight, ChevronLeft, Bookmark, History, 
  Sun, Moon, RotateCcw, CheckCircle, Circle, ArrowRight,
  Sparkles, Award, Star, Info, ListFilter, Trash2, Shield,
  X, ShieldCheck
} from 'lucide-react';

// Datasets
import { articles } from './data/encyclopedia';
import { dailyFacts } from './data/dailyFacts';
import { quizzes } from './data/quiz';
import { CategoryType, Article } from './types';

// Components
import TextWithGlossary from './components/GlossaryTooltip';
import SolarSystemSimulator from './components/SolarSystemSimulator';
import PhenomenaSimulator from './components/PhenomenaSimulator';
import ScaleComparison from './components/ScaleComparison';

// ================================================================
// User Consent Flow Components (Startup Agreement & Privacy Modal)
// ================================================================

/** 1. 启动首页 — 用户协议与隐私政策同意弹窗 */
const PrivacyModal = ({
  onAccept,
  onDecline,
  onOpenAgreement,
  onOpenPrivacy,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onOpenAgreement: () => void;
  onOpenPrivacy: () => void;
}) => (
  <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[80]">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className="bg-slate-900 w-full max-w-sm shadow-2xl max-h-[80vh] overflow-y-auto rounded-[28px] border border-white/10 text-slate-200"
    >
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-amber-400" strokeWidth={1.8} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-100 mb-2 text-center pt-2 font-display">
          用户协议与隐私政策
        </h3>
        <p className="text-xs text-center text-slate-500 mb-6">
          欢迎使用「万序宇宙」，请先阅读以下条款
        </p>
        <div className="mb-5 space-y-2">
          <p className="text-sm text-slate-300 leading-relaxed">
            (1) <span className="text-amber-300 font-medium">《隐私政策》</span> 中关于
            您的本地学习数据（收藏、进度、答题记录等）存储与使用的说明。
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            (2) <span className="text-amber-300 font-medium">《隐私政策》</span> 中与
            第三方 SDK 类服务商数据共享、相关信息收集和使用说明。
          </p>
        </div>
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-2">用户协议和隐私政策说明：</p>
          <p className="text-sm text-slate-300 leading-relaxed">
            阅读完整的{' '}
            <span
              onClick={onOpenAgreement}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer font-medium"
            >
              《用户服务协议》
            </span>{' '}
            和{' '}
            <span
              onClick={onOpenPrivacy}
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer font-medium"
            >
              《隐私政策》
            </span>{' '}
            了解详细内容。
          </p>
        </div>
      </div>
      <div className="flex border-t border-white/10">
        <button
          onClick={onDecline}
          className="flex-1 py-4 text-base font-medium text-slate-300 bg-transparent border-r border-white/10 hover:bg-white/5 cursor-pointer transition-colors rounded-bl-[28px]"
        >
          不同意
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-4 text-base font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-br-[28px] cursor-pointer transition-all active:scale-[0.98] shadow-[0_0_24px_-4px_rgba(245,158,11,0.5)]"
        >
          同意并继续
        </button>
      </div>
    </motion.div>
  </div>
);

/** 2. 协议/隐私详情弹窗 */
const AgreementModal = ({
  onClose,
  title,
  content,
}: {
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}) => (
  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 z-[110]">
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className="bg-slate-900 rounded-[28px] w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col text-slate-200"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-900/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 text-amber-400 rounded-xl flex items-center justify-center">
            <ShieldCheck size={22} strokeWidth={1.8} />
          </div>
          <h2 className="text-lg font-bold text-slate-100 font-display">{title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭"
          className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 active:scale-90 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-950/60 p-5 md:p-8 no-scrollbar">{content}</div>
    </motion.div>
  </div>
);

/** 3. 隐私政策正文内容（适配万序宇宙，公司/邮箱保留参考值，生效日期 2026-07-04） */
const PrivacyPolicyContent = () => (
  <div className="max-w-none text-slate-300 leading-relaxed text-sm space-y-6">
    <h1 className="text-2xl font-bold text-amber-400 text-center mb-1 font-display">🔒 隐私政策</h1>
    <p className="text-center text-slate-500 text-xs mb-4">
      <strong className="text-slate-400">生效日期</strong>：2026年07月04日
    </p>

    <div className="bg-gradient-to-r from-amber-500/10 via-slate-800/40 to-indigo-500/10 p-5 rounded-2xl border-l-4 border-amber-500 mb-4">
      <p className="text-slate-300">
        欢迎使用「<span className="text-amber-300 font-semibold">万序宇宙</span>」（以下简称"本应用"）。
        本应用由 <strong className="text-slate-100">光年跃迁（温州）科技有限公司</strong>（以下简称"我们"）
        开发并运营。我们深知个人信息对您的重要性，将严格遵守
        《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。
      </p>
    </div>

    <p className="text-slate-300">
      本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，
      以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，
      尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。
    </p>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      一、我们收集的信息
    </h2>
    <p className="mb-3 text-slate-300">
      在您使用本应用的过程中，我们会收集以下信息，以提供、维护和改进我们的服务：
    </p>
    <ol className="list-decimal pl-6 space-y-3">
      <li className="text-slate-300">
        <strong className="text-slate-100">学习与进度数据</strong>：
        您在使用本应用过程中主动产生的所有
        <strong className="text-amber-300">知识收藏记录、新人必修课通关进度、学习足迹记录、答题测试成绩、3D 模拟器偏好设置</strong>
        等。这些数据是本应用的核心功能内容，用于为您提供连续的自学体验、成就展示与历史回顾服务。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">设备信息</strong>：
        为了保障应用的稳定运行和优化用户体验，我们会自动收集您的设备相关信息，包括但不限于
        <strong className="text-amber-300">设备型号、操作系统版本、设备标识符（如 IMEI / Android ID）、IP 地址</strong>
        等。
      </li>
    </ol>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      二、我们如何使用收集的信息
    </h2>
    <p className="mb-3 text-slate-300">我们仅会在以下合法、正当、必要的范围内使用您的个人信息：</p>
    <ol className="list-decimal pl-6 space-y-3">
      <li className="text-slate-300">
        <strong className="text-slate-100">提供和改进服务</strong>：
        使用您的学习与进度数据来实现百科检索、知识收藏、新人路线通关、3D 模拟可视化、答题测试、每日宇宙卡片等核心功能；
        通过分析设备信息和使用数据，优化应用性能，修复已知问题，提升用户体验。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">数据分析和统计</strong>：
        在对您的个人信息进行匿名化或去标识化处理后，进行内部数据分析和统计，以了解用户群体的使用习惯和需求，
        从而更好地规划和改进产品功能与科普内容。
      </li>
    </ol>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      三、我们如何共享、转让和公开披露信息
    </h2>
    <p className="mb-3 text-slate-300">
      我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：
    </p>
    <ol className="list-decimal pl-6 space-y-3">
      <li className="text-slate-300">
        <strong className="text-slate-100">法定情形</strong>：
        根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">获得明确同意</strong>：
        在获得您的明确书面同意后，我们才会向第三方共享您的个人信息。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">业务必要且合规</strong>：
        为了实现本政策第二条所述的目的，我们可能会与提供技术支持或其他必要服务的合作伙伴共享必要的信息，
        但我们会要求其严格遵守本政策及相关法律法规，并对您的信息承担保密义务。
      </li>
    </ol>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      四、我们如何存储和保护信息
    </h2>
    <ol className="list-decimal pl-6 space-y-3">
      <li className="text-slate-300">
        <strong className="text-slate-100">存储地点和期限</strong>：
        您的个人信息将存储于中华人民共和国境内的安全服务器上。我们会在实现本政策所述目的所必需的最短时间内保留您的信息，
        超出此期限后，我们将对您的信息进行删除或匿名化处理。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">安全措施</strong>：
        我们采用符合行业标准的技术手段和安全管理措施来保护您的个人信息，包括但不限于数据加密、访问控制、安全审计等，
        以防止信息泄露、丢失、篡改或被未经授权的访问。
      </li>
    </ol>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      五、您的权利
    </h2>
    <p className="mb-3 text-slate-300">根据相关法律法规，您对您的个人信息享有以下权利：</p>
    <ol className="list-decimal pl-6 space-y-3">
      <li className="text-slate-300">
        <strong className="text-slate-100">访问权</strong>：
        您可以随时在本应用的「收藏」「足迹」「答题」「设置」等栏目中查看和管理您的学习进度与历史记录。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">更正权</strong>：
        如您发现您的学习进度或记录存在错误，您可以在应用内进行修改和更正。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">删除权</strong>：
        您可以随时删除单条收藏、清除单条足迹记录，或通过设置页面中的清除功能一键删除答题测试记录，应用将立即处理相关数据。
      </li>
      <li className="text-slate-300">
        <strong className="text-slate-100">数据导出</strong>：
        本应用所有数据均以 LocalStorage 方式存储在您的设备本地，您可以通过设备备份或浏览器导出等方式获取您的数据。
      </li>
    </ol>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      六、未成年人保护
    </h2>
    <p className="text-slate-300">
      我们非常重视对未成年人个人信息的保护。如您是未满 14 周岁的未成年人，在使用本应用前，
      应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下
      收集了未成年人的个人信息，将立即删除相关数据。
    </p>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      七、本政策的更新
    </h2>
    <p className="text-slate-300">
      我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。
      修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。
      如您继续使用本应用，即表示您同意接受修订后的政策。
    </p>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 border-b border-white/10 pb-2 font-display">
      八、联系我们
    </h2>
    <p className="mb-3 text-slate-300">
      如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：
    </p>
    <div className="bg-slate-800/60 p-4 rounded-2xl border border-white/5">
      <p className="text-slate-300">
        <strong className="text-slate-100">电子邮箱</strong>：
        <span className="text-indigo-300">Jp112022@163.com</span>
      </p>
    </div>

    <div className="mt-8 pt-5 border-t border-white/10 text-center">
      <p className="mb-1 text-slate-500">感谢您使用万序宇宙！</p>
      <p className="mb-3 text-slate-500 text-xs">我们致力于为您提供安全、沉浸式的宇宙科普学习体验。</p>
      <p className="text-xs text-slate-600">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

/** 4. 用户服务协议正文内容（适配万序宇宙，公司保留参考值，更新日期 2026-07-04） */
const UserAgreementContent = () => (
  <div className="max-w-none text-slate-300 leading-relaxed text-sm space-y-5">
    <h1 className="text-2xl font-bold text-amber-400 text-center mb-1 font-display">用户服务协议</h1>
    <p className="text-center text-slate-500 text-xs mb-6">更新日期：2026年07月04日</p>

    <h2 className="text-lg font-semibold text-slate-100 mt-6 mb-3 font-display">1. 协议的接受</h2>
    <p className="mb-2">欢迎使用「<span className="text-amber-300 font-semibold">万序宇宙</span>」应用（以下简称「本应用」）。</p>
    <p className="mb-2">本协议是您与 <strong className="text-slate-100">光年跃迁（温州）科技有限公司</strong>（以下简称「我们」）之间关于使用本应用的法律协议。</p>
    <p>通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。</p>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 font-display">2. 服务内容</h2>
    <p className="mb-3">本应用提供以下科普学习与可视化服务：</p>
    <ul className="list-disc pl-6 space-y-2 text-slate-300">
      <li>宇宙百科文章的分类检索、阅读与知识悬停注解</li>
      <li>文章收藏、学习足迹记录与新人必修路线通关进度</li>
      <li>3D 可视化模拟器（太阳系运行、天文现象、天体尺度对比）</li>
      <li>新人教学路线（恒星行星、光年、大爆炸、黑洞、宜居带等）</li>
      <li>每日宇宙知识卡片与答题检测评测功能</li>
    </ul>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 font-display">3. 用户义务</h2>
    <p className="mb-3">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2 text-slate-300">
      <li>遵守本协议的所有条款</li>
      <li>不使用本应用进行任何非法活动</li>
      <li>不干扰本应用的正常运行，不尝试破解、篡改、逆向工程本应用</li>
      <li>保护您的设备安全，防止未授权访问</li>
      <li>在引用或传播本应用内容时，注明来源并尊重知识产权</li>
    </ul>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 font-display">4. 知识产权</h2>
    <p className="mb-2">
      本应用的所有内容，包括但不限于文字、图像、3D 模型、动画、音频、视频、软件、科普文章内容结构等，
      均受知识产权法律保护。
    </p>
    <p>未经我们的书面许可，您不得复制、修改、分发或商业使用本应用的任何内容。</p>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 font-display">5. 免责声明</h2>
    <p className="mb-2">本应用按「原样」提供，不做任何形式的保证。</p>
    <p className="mb-3">我们不保证：</p>
    <ul className="list-disc pl-6 space-y-2 text-slate-300">
      <li>本应用将符合您的要求</li>
      <li>本应用将无中断、及时、安全或无错误地运行</li>
      <li>本应用的科普内容绝对完整无误（科学前沿观点会随研究进展更新）</li>
      <li>本应用的使用结果将准确或可靠</li>
    </ul>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 font-display">6. 终止</h2>
    <p className="mb-2">我们有权在任何时候，出于任何原因，终止或暂停您对本应用的访问。</p>
    <p>您也可以随时停止使用本应用。</p>

    <h2 className="text-lg font-semibold text-slate-100 mt-8 mb-3 font-display">7. 适用法律</h2>
    <p className="mb-2">本协议受中华人民共和国法律管辖。</p>
    <p>任何与本协议相关的争议，应通过友好协商解决；协商不成的，应提交至温州市有管辖权的人民法院诉讼解决。</p>

    <div className="mt-10 pt-5 border-t border-white/10 text-center">
      <p className="text-xs text-slate-600">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

// Beginner Roadmap Steps
const BEGINNER_STEPS = [
  {
    id: "step-1",
    title: "恒星与行星的区别",
    difficulty: "入门",
    question: "太阳和地球，谁会自己发光发热？",
    answer: "恒星（如太阳）能够自己产生核聚变发光发热；而行星（如地球、火星）本身不发光，只能反射恒星的光芒。"
  },
  {
    id: "step-2",
    title: "光年是距离还是时间？",
    difficulty: "入门",
    question: "“一光年”代表多长的时间？",
    answer: "光年绝对不是时间！它是距离单位。代表光以每秒30万公里的速度飞行一整年所经过的漫长距离，约为9.46万亿公里。"
  },
  {
    id: "step-3",
    title: "宇宙的生日是哪天？",
    difficulty: "初学者",
    question: "宇宙诞生了多少年？",
    answer: "宇宙大约诞生于 138 亿年前。那是一个比针尖还小的极热、高密度的奇点突然发生暴胀膨胀（大爆炸），随后形成了所有的时空与物质。"
  },
  {
    id: "step-4",
    title: "黑洞里真的有洞吗？",
    difficulty: "初学者",
    question: "如果掉进黑洞，会从另一个洞掉出来吗？",
    answer: "黑洞不是空心的“洞”！它是一个密度无限大、体积无限小的极度压实的天体。因为引力太强连光都逃不掉，所以看起来是一片虚无黑色。"
  },
  {
    id: "step-5",
    title: "太空是绝对安静的吗？",
    difficulty: "普及",
    question: "在太空里说话，旁边的人能听见吗？",
    answer: "完全听不见！太空是一个接近完美的真空，没有传播声音所需的介质（如空气）。宇航员必须通过头盔内的无线电电波来通话。"
  },
  {
    id: "step-6",
    title: "为什么月亮在离我们而去？",
    difficulty: "普及",
    question: "月球每年在远离地球多少厘米？",
    answer: "大约 3.8 厘米。由于潮汐摩擦和地球自转能量流失，月球正缓慢退移，几十亿年后，地球上的人类将无法再看到完美的日全食。"
  },
  {
    id: "step-7",
    title: "流星雨是星星掉下来了吗？",
    difficulty: "普及",
    question: "流星有房子那么大吗？",
    answer: "其实流星非常渺小！大多数划破夜空的流星，只是彗星遗留下来的细沙、绿豆甚至尘埃般大小的碎屑，在撞击大气层时燃烧蒸发的视觉痕迹。"
  },
  {
    id: "step-8",
    title: "什么是宜居带？",
    difficulty: "进阶",
    question: "科学家寻找外星生命的黄金标准是什么？",
    answer: "恒星周围温度适中、允许液态水以稳定液体形式存在于行星表面的那条环形带，叫做‘宜居带’。地球正好在太阳系的宜居带正中。"
  }
];

export default function App() {
  // --- Persistent Storage State Keys ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('wanxu-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('wanxu-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [beginnerProgress, setBeginnerProgress] = useState<string[]>(() => {
    const saved = localStorage.getItem('wanxu-beginner-progress');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizScore, setQuizScore] = useState<{ [id: number]: number }>(() => {
    const saved = localStorage.getItem('wanxu-quiz-score');
    return saved ? JSON.parse(saved) : {};
  });

  const [showQuizResetConfirm, setShowQuizResetConfirm] = useState(false);

  // --- Startup Consent (用户协议与隐私政策) ---
  const [consentAccepted, setConsentAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wanxu-consent') === '1';
    } catch {
      return false;
    }
  });
  const [showAgreementModal, setShowAgreementModal] = useState<'agreement' | 'privacy' | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const handleConsentAccept = () => {
    try {
      localStorage.setItem('wanxu-consent', '1');
    } catch {
      /* ignore */
    }
    setConsentAccepted(true);
  };

  const handleConsentDecline = () => {
    setShowDeclineModal(true);
  };

  const handleDeclineCancel = () => {
    setShowDeclineModal(false);
  };

  const handleDeclineConfirm = () => {
    setShowDeclineModal(false);
    // 不允许使用，保持 consentAccepted = false，用户停留在被弹窗挡住的状态
    // 同时也不写入 localStorage，下次启动仍会再次询问
  };

  // --- UI Layout Navigation state ---
  const [activeTab, setActiveTab] = useState<'home' | 'encyclopedia' | 'visuals' | 'quiz' | 'settings'>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  
  // Visualizer Section subtab: 'solar' | 'phenomena' | 'scale'
  const [activeVisualTab, setActiveVisualTab] = useState<'solar' | 'phenomena' | 'scale'>('solar');

  // Search Engine states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Daily Fact Index logic: changes based on calendar day or manual randomize
  const [dailyFactIndex, setDailyFactIndex] = useState(0);

  // System time mock for Android top status bar
  const [sysTime, setSysTime] = useState('14:06');

  // --- Horizontal Drag-to-Scroll Refs & Handlers ---
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingTabs = useRef(false);
  const tabsStartX = useRef(0);
  const tabsScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const handleTabsMouseDown = (e: React.MouseEvent) => {
    if (!tabsScrollRef.current) return;
    isDraggingTabs.current = true;
    hasDragged.current = false;
    tabsStartX.current = e.pageX - tabsScrollRef.current.offsetLeft;
    tabsScrollLeft.current = tabsScrollRef.current.scrollLeft;
  };

  const handleTabsMouseLeave = () => {
    isDraggingTabs.current = false;
  };

  const handleTabsMouseUp = () => {
    isDraggingTabs.current = false;
  };

  const handleTabsMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTabs.current || !tabsScrollRef.current) return;
    const x = e.pageX - tabsScrollRef.current.offsetLeft;
    const walk = (x - tabsStartX.current) * 1.6;
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    e.preventDefault();
    tabsScrollRef.current.scrollLeft = tabsScrollLeft.current - walk;
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wanxu-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('wanxu-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('wanxu-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('wanxu-history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('wanxu-beginner-progress', JSON.stringify(beginnerProgress));
  }, [beginnerProgress]);

  useEffect(() => {
    localStorage.setItem('wanxu-quiz-score', JSON.stringify(quizScore));
  }, [quizScore]);

  // Handle Mock Clock ticking
  useEffect(() => {
    const updateMockClock = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setSysTime(`${hrs}:${mins}`);
    };
    updateMockClock();
    const interval = setInterval(updateMockClock, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync Daily Fact based on date
  useEffect(() => {
    const dayOfYear = new Date().getDate() % dailyFacts.length;
    setDailyFactIndex(dayOfYear);
  }, []);

  // Back button handler for Article details and Search results
  const handleBackToEncyclopedia = () => {
    setCurrentArticle(null);
  };

  // Select an article and save history
  const handleSelectArticle = (articleId: string) => {
    const art = articles.find(a => a.id === articleId);
    if (art) {
      setCurrentArticle(art);
      
      // Update history (move to top, prevent duplicates)
      setHistory(prev => {
        const filtered = prev.filter(id => id !== articleId);
        return [articleId, ...filtered].slice(0, 8); // Keep up to 8 history items
      });
      
      // Also open encyclopedias tab if we were elsewhere
      setActiveTab('encyclopedia');
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (articleId: string) => {
    setBookmarks(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  // Toggle beginner progress step
  const toggleBeginnerStep = (stepId: string) => {
    setBeginnerProgress(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      } else {
        return [...prev, stepId];
      }
    });
  };

  // Clear learning history
  const clearHistory = () => {
    setHistory([]);
  };

  // Font size multiplier mapping
  const getFontSizeClass = (part: 'body' | 'title' | 'sub') => {
    if (fontSize === 'small') {
      if (part === 'body') return 'text-xs leading-relaxed';
      if (part === 'sub') return 'text-sm font-bold font-display';
      return 'text-base font-extrabold font-display';
    }
    if (fontSize === 'large') {
      if (part === 'body') return 'text-base leading-relaxed';
      if (part === 'sub') return 'text-lg font-bold font-display';
      return 'text-2xl font-extrabold font-display';
    }
    // Normal / default
    if (part === 'body') return 'text-sm leading-relaxed';
    if (part === 'sub') return 'text-base font-bold font-display';
    return 'text-xl font-extrabold font-display';
  };

  // Filter articles based on Search Query
  const searchResults = isSearching && searchQuery.trim() !== ''
    ? articles.filter(art => {
        const query = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(query) ||
          art.summary.toLowerCase().includes(query) ||
          art.funFact.toLowerCase().includes(query) ||
          art.content.some(sec => sec.paragraph.toLowerCase().includes(query) || (sec.subtitle && sec.subtitle.toLowerCase().includes(query)))
        );
      })
    : [];

  const categoryLabels: { [key in CategoryType]: string } = {
    solar: "太阳系家族",
    deepspace: "深空天体",
    basics: "宇宙常识",
    phenomena: "天文现象",
    exploration: "航天与探索"
  };

  const currentDailyFact = dailyFacts[dailyFactIndex];

  return (
    <div className={`min-h-screen transition-colors duration-300 flex items-center justify-center p-0 md:p-6 relative overflow-hidden ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`} id="wanxu-root-wrapper">
      
      {/* Sleek Interface background celestial effects */}
      {theme === 'dark' && (
        <>
          <div className="nebula"></div>
          <div className="star-field"></div>
        </>
      )}

      {/* 
        SIMULATED ANDROID PHONE CONTAINER (Desktop-First precision, Native Mobile adaptation)
        Maintains fixed 400px width aspect-ratio shell on large desktops, 
        and fluid 100% full screen on actual mobile devices with beautiful sleek glass integration.
      */}
      <div className={`relative w-full max-w-md h-screen md:h-[840px] shadow-2xl overflow-hidden md:rounded-[36px] flex flex-col border transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-950/80 border-white/10 backdrop-blur-xl' 
          : 'bg-white/90 border-slate-200/80 backdrop-blur-xl'
      }`} id="android-device-simulator">
        
        {/* Android Device Glossy Top Camera Notch (Hides on mobile screens) */}
        <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-50 flex items-center justify-center" id="notch-camera">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-950"></div>
        </div>

        {/* ========================================================= */}
        {/* CORE SCREEN AREA (Scrollable, responsive, beautifully structured) */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col relative" id="android-screen-view">
          
          {/* Static subtle background stars for immersive deep-space feeling */}
          {theme === 'dark' && (
            <>
              <div className="nebula opacity-60"></div>
              <div className="star-field opacity-25"></div>
            </>
          )}

          {/* Core Header Navigation containing back controls or search inputs */}
          <header className={`px-4 py-3 shrink-0 flex items-center justify-between border-b relative z-30 transition-all ${
            theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-white/80 border-slate-100'
          }`} id="app-navigation-header">
            {currentArticle ? (
              <button 
                onClick={handleBackToEncyclopedia}
                className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 pr-3 pl-2 rounded-xl transition-all cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 text-indigo-200 border border-white/5' : 'hover:bg-slate-100 text-slate-700'
                }`}
                id="back-to-list-btn"
              >
                <ChevronLeft className="w-4 h-4" />
                返回百科
              </button>
            ) : selectedCategory ? (
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 pr-3 pl-2 rounded-xl transition-all cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 text-indigo-200 border border-white/5' : 'hover:bg-slate-100 text-slate-700'
                }`}
                id="back-to-categories-btn"
              >
                <ChevronLeft className="w-4 h-4" />
                全部分类
              </button>
            ) : (
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold font-display tracking-tight glow-text bg-gradient-to-br from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                  万序宇宙
                </span>
                <span className="text-[8px] tracking-[0.15em] uppercase opacity-50 font-mono text-indigo-300">
                  Ordered Universe
                </span>
              </div>
            )}

            {/* Offline Search Input Area */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索黑洞、光年、地球..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearching(e.target.value !== '');
                  }}
                  className={`w-36 sm:w-44 pl-7 pr-2.5 py-1.5 rounded-full text-[11px] font-medium border focus:w-48 transition-all duration-300 outline-none ${
                    theme === 'dark' 
                      ? 'bg-white/5 border-white/10 text-slate-100 focus:border-indigo-500/50 focus:bg-white/10' 
                      : 'bg-slate-100 border-slate-200 text-slate-900 focus:border-indigo-500/50'
                  }`}
                  id="search-input-field"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearching(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px] cursor-pointer"
                    id="clear-search-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* ========================================== */}
          {/* CONTENT DISPATCHER (BASED ON ACTIVE STATES) */}
          {/* ========================================== */}
          <div className="flex-1 p-4 flex flex-col relative z-10" id="screen-viewport-content">
            
            {/* SEARCH RESULTS VIEW OVERLAY */}
            {isSearching ? (
              <div className="flex flex-col gap-4" id="search-results-overlay">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold font-display text-amber-400">
                    搜索结果 ({searchResults.length})
                  </h3>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearching(false);
                    }}
                    className="text-xs text-slate-400 hover:text-amber-500 cursor-pointer"
                    id="exit-search-btn"
                  >
                    退出搜索
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <Search className="w-10 h-10 opacity-20 text-slate-400" />
                    <p className="text-xs text-slate-400">未找到匹配的宇宙概念，换个词试试吧！</p>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-[280px]">
                      {["黑洞", "光年", "太阳", "流星雨", "火星"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchQuery(tag);
                            setIsSearching(true);
                          }}
                          className="px-2.5 py-1 rounded-full text-[10px] bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3" id="search-results-list">
                    {searchResults.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          handleSelectArticle(art.id);
                          setSearchQuery('');
                          setIsSearching(false);
                        }}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                          theme === 'dark' 
                            ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                            {categoryLabels[art.category]}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            查阅 <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white font-display mb-1.5">{art.title}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{art.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              
              /* RENDER CORE TABS (HOME, WIKI, SIMULATOR, QUIZ, SETTINGS) */
              <AnimatePresence mode="wait">
                
                {/* 1. HOME TAB */}
                {activeTab === 'home' && (
                  <motion.div
                    key="home-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-5"
                    id="view-home"
                  >
                    {/* (1) Top Cosmic Rotating Slogan Banner */}
                    <div className="relative rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-indigo-950/50 via-slate-900/40 to-purple-950/50 border border-indigo-500/30 shadow-lg glow-purple" id="home-cosmic-banner">
                      {/* Abstract glowing planet graphics */}
                      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-purple-500/20 filter blur-xl animate-pulse"></div>
                      <div className="absolute right-12 top-4 w-4 h-4 rounded-full bg-amber-500/40 glow-amber animate-twinkle-medium"></div>

                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/30">
                        新人起航
                      </span>
                      <h2 className="text-lg font-black font-display text-white mt-3 leading-snug glow-text">
                        从零开始，<br />读懂浩瀚宇宙
                      </h2>
                      <p className="text-xs text-slate-300 mt-2 font-medium">
                        零前置要求、沉浸式自学。
                      </p>

                      <button
                        onClick={() => {
                          setActiveTab('visuals');
                          setActiveVisualTab('solar');
                        }}
                        className="mt-4 inline-flex items-center gap-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                        id="explore-sim-btn"
                      >
                        开启3D模拟沙盘
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* (2) 今日宇宙小知识 (Daily facts showcase) */}
                    {currentDailyFact && (
                      <div className={`p-4 rounded-3xl border text-left relative overflow-hidden transition-all ${
                        theme === 'dark' ? 'glass-card border-white/10' : 'glass-card-light'
                      }`} id="daily-fact-card">
                        
                        <div className="absolute -right-3 top-2 opacity-5 scale-150">
                          <Compass className="w-20 h-20 text-white animate-spin" style={{ animationDuration: '40s' }} />
                        </div>

                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                            今日宇宙知识卡片
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            {/* Force manual randomize */}
                            <button
                              onClick={() => setDailyFactIndex((prev) => (prev + 1) % dailyFacts.length)}
                              className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                              title="换一条小知识"
                              id="random-fact-btn"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-sm font-bold font-display text-white mb-1">{currentDailyFact.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3.5">
                          {currentDailyFact.fact}
                        </p>

                        <div className="flex justify-between items-center">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                            所属分类: {currentDailyFact.category}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* (3) 五大核心知识卡片入口 */}
                    <div className="flex flex-col gap-3" id="home-categories-grid">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">五大科普板块</h3>
                        <span className="text-[10px] text-slate-500">打包全量内容</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: 'solar', title: '太阳系家族', desc: '八大行星与小行星', color: 'from-amber-500/5 to-orange-500/5 border-orange-500/10 text-orange-400 hover:border-orange-500/30' },
                          { id: 'deepspace', title: '深空天体', desc: '黑洞、银河与星云', color: 'from-indigo-500/5 to-purple-500/5 border-purple-500/10 text-purple-400 hover:border-purple-500/30' },
                          { id: 'basics', title: '宇宙常识', desc: '大爆炸、光年与时空', color: 'from-blue-500/5 to-teal-500/5 border-teal-500/10 text-teal-400 hover:border-teal-500/30' },
                          { id: 'phenomena', title: '天文现象', desc: '极光、流星与日食', color: 'from-pink-500/5 to-rose-500/5 border-rose-500/10 text-rose-400 hover:border-rose-500/30' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id as CategoryType);
                              setActiveTab('encyclopedia');
                            }}
                            className={`p-3.5 rounded-2xl border bg-gradient-to-br text-left hover:scale-[1.02] active:scale-98 transition-all duration-200 cursor-pointer ${cat.color}`}
                            id={`category-card-${cat.id}`}
                          >
                            <h4 className="text-xs font-bold font-display">{cat.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1">{cat.desc}</p>
                          </button>
                        ))}

                        {/* Large 5th Category covering full bottom row */}
                        <button
                          onClick={() => {
                            setSelectedCategory('exploration');
                            setActiveTab('encyclopedia');
                          }}
                          className="col-span-2 p-3.5 rounded-2xl border bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/10 text-left hover:scale-[1.01] active:scale-98 transition-all duration-200 flex items-center justify-between cursor-pointer text-emerald-400 hover:border-emerald-500/30"
                          id="category-card-exploration"
                        >
                          <div>
                            <h4 className="text-xs font-bold font-display">航天与人类探索</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">人类航天史、韦布望远镜与星际使者旅行者号</p>
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>

                    {/* (4) 新手入门专区 (Progress Checked Roadmap) */}
                    <div className={`p-4 rounded-3xl text-left border ${
                      theme === 'dark' ? 'glass-card border-white/10' : 'glass-card-light'
                    }`} id="home-beginner-progress-section">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">0基础科普必修课</h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">循序渐进掌握 8 大核心通俗奥秘</p>
                        </div>
                        {/* Progress radial percentage */}
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-amber-500">
                            {beginnerProgress.length} / {BEGINNER_STEPS.length}
                          </span>
                          <span className="text-[9px] text-slate-500 block">已通关</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${(beginnerProgress.length / BEGINNER_STEPS.length) * 100}%` }}
                        ></div>
                      </div>

                      {/* Step-by-step collapse list */}
                      <div className="flex flex-col gap-2" id="beginner-steps-collapses">
                        {BEGINNER_STEPS.map((step) => {
                          const isDone = beginnerProgress.includes(step.id);
                          return (
                            <div 
                              key={step.id}
                              className={`p-3 rounded-xl border flex flex-col transition-all ${
                                isDone 
                                  ? 'bg-emerald-500/10 border-emerald-500/20' 
                                  : theme === 'dark' ? 'bg-white/3 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className="flex justify-between items-center gap-2">
                                <button
                                  onClick={() => toggleBeginnerStep(step.id)}
                                  className="p-0.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                                  id={`checkbox-beginner-${step.id}`}
                                >
                                  {isDone ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-500" />
                                  )}
                                </button>

                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-200 font-display">{step.title}</span>
                                    <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-slate-850 text-slate-400 font-mono">
                                      {step.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{step.question}</p>
                                </div>
                              </div>

                              {/* Answer card if completed */}
                              {isDone && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  className="mt-2.5 pt-2.5 border-t border-emerald-500/10 text-[11px] text-slate-300 leading-relaxed pl-1"
                                >
                                  <strong className="text-emerald-400 block mb-0.5">通俗解答：</strong>
                                  {step.answer}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* (5) Recent Study History */}
                    {history.length > 0 && (
                      <div className="flex flex-col gap-2 text-left" id="home-study-history-section">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">最近浏览记录</h3>
                          <button
                            onClick={clearHistory}
                            className="p-1 rounded text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                            id="clear-history-btn"
                          >
                            <Trash2 className="w-3 h-3" />
                            清除
                          </button>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          {history.map((id) => {
                            const art = articles.find(a => a.id === id);
                            if (!art) return null;
                            return (
                              <div
                                key={id}
                                onClick={() => handleSelectArticle(id)}
                                className={`flex justify-between items-center p-2.5 rounded-xl transition-all cursor-pointer ${
                                  theme === 'dark' ? 'bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10' : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
                                }`}
                              >
                                <span className="text-xs text-slate-300 font-medium font-display">{art.title}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Footer attribution */}
                    <div className="text-center py-4 text-[10px] text-slate-500">
                      万序宇宙 · 本地全量数据运行
                    </div>

                  </motion.div>
                )}

                {/* 2. ENCYCLOPEDIA TAB */}
                {activeTab === 'encyclopedia' && (
                  <motion.div
                    key="encyclopedia-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-4"
                    id="view-encyclopedia"
                  >
                    {/* ENCYCLOPEDIA DETAIL VIEW (When reading a specific article) */}
                    {currentArticle ? (
                      <div className="text-left flex flex-col gap-4 pb-8 animate-fadeIn" id="article-details-page">
                        
                        {/* Article Category and Title */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                              {categoryLabels[currentArticle.category]}
                            </span>
                            
                            {/* Bookmark Toggle */}
                            <button
                              onClick={() => toggleBookmark(currentArticle.id)}
                              className={`p-1.5 rounded-xl border cursor-pointer transition-all ${
                                theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                              id={`bookmark-toggle-${currentArticle.id}`}
                            >
                              <Bookmark className={`w-4 h-4 ${bookmarks.includes(currentArticle.id) ? 'fill-amber-500 text-amber-500 border-transparent' : 'text-slate-400'}`} />
                            </button>
                          </div>
                          
                          <h2 className={`${getFontSizeClass('title')} text-white font-extrabold tracking-tight glow-text`}>{currentArticle.title}</h2>
                        </div>

                        {/* "一句话通俗总结" - Mandatory Requirement (styled beautifully) */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 relative" id="article-one-sentence-summary">
                          <div className="absolute top-2 right-3 opacity-15">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                          </div>
                          <span className="text-[9px] font-bold text-amber-500 uppercase block mb-1">
                            3秒极简白话总结:
                          </span>
                          <p className="text-xs font-medium text-amber-300 leading-relaxed">
                            {currentArticle.summary}
                          </p>
                        </div>

                        {/* Physical Parameters grid if available */}
                        {currentArticle.parameters && (
                          <div className="grid grid-cols-2 gap-2" id="article-parameters-grid">
                            {currentArticle.parameters.map((p, idx) => (
                              <div key={idx} className={`p-2.5 rounded-xl text-left border ${
                                theme === 'dark' ? 'bg-white/3 border-white/5' : 'bg-slate-50 border-slate-100'
                              }`}>
                                <span className="text-[9px] text-slate-500 uppercase block font-medium">{p.label}</span>
                                <span className="text-xs text-slate-200 font-mono font-bold block mt-0.5">{p.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Body content with click-to-explain tooltips */}
                        <div className="flex flex-col gap-3" id="article-body-text-paragraphs">
                          {currentArticle.content.map((sec, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                              {sec.subtitle && (
                                <h4 className={`${getFontSizeClass('sub')} mt-2 text-white font-bold tracking-tight glow-text`}>{sec.subtitle}</h4>
                              )}
                              <p className={`${getFontSizeClass('body')} text-slate-300 leading-relaxed`}>
                                <TextWithGlossary 
                                  text={sec.paragraph} 
                                  glossary={currentArticle.glossary} 
                                  theme={theme} 
                                  />
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* "对比地球" (Compare to Earth) section if available */}
                        {currentArticle.compareToEarth && (
                          <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/25 text-xs" id="article-earth-comparison">
                            <span className="text-[10px] text-blue-400 font-bold block mb-1">🌍 与地球尺寸比例区别:</span>
                            <p className="text-slate-300 leading-relaxed">{currentArticle.compareToEarth}</p>
                          </div>
                        )}

                        {/* "趣味冷知识" - Mandatory Requirement */}
                        <div className="p-3.5 rounded-2xl bg-indigo-500/5 border border-indigo-500/25 text-xs" id="article-fun-fact">
                          <span className="text-[10px] text-indigo-400 font-bold block mb-1">💡 趣味冷知识:</span>
                          <p className="text-slate-300 leading-relaxed">{currentArticle.funFact}</p>
                        </div>

                        {/* "常见误区纠正" - Mandatory Requirement */}
                        <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/25 text-xs" id="article-misconceptions">
                          <span className="text-[10px] text-rose-400 font-bold block mb-1">❌ 常见误区纠正:</span>
                          <p className="text-slate-300 leading-relaxed">{currentArticle.misconception}</p>
                        </div>

                        {/* Completion checklist trigger */}
                        <div className="pt-4 border-t border-white/5 text-center">
                          <button
                            onClick={handleBackToEncyclopedia}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                              theme === 'dark' ? 'bg-indigo-600/80 hover:bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                            }`}
                            id="finish-reading-article-btn"
                          >
                            我读完了，返回列表
                          </button>
                        </div>

                      </div>
                    ) : (
                      
                      /* CATEGORY FILTERED LIST OR MAIN SELECTION VIEW */
                      <div className="flex flex-col gap-4 text-left animate-fadeIn" id="encyclopedia-lists-page">
                        {/* Category selection bar with desktop drag-to-scroll and click-to-scroll buttons */}
                        <div className="relative flex items-center w-full" id="encyclopedia-tabs-wrapper">
                          {/* Left scroll arrow */}
                          <button 
                            onClick={() => {
                              if (tabsScrollRef.current) {
                                tabsScrollRef.current.scrollBy({ left: -140, behavior: 'smooth' });
                              }
                            }}
                            className={`absolute -left-1.5 z-20 p-1.5 rounded-full shadow-lg border backdrop-blur-md cursor-pointer transition-all duration-200 flex items-center justify-center ${
                              theme === 'dark' 
                                ? 'bg-slate-900/90 text-indigo-300 border-white/10 hover:bg-slate-800' 
                                : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                            aria-label="Scroll Left"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>

                          <div 
                            ref={tabsScrollRef}
                            onMouseDown={handleTabsMouseDown}
                            onMouseLeave={handleTabsMouseLeave}
                            onMouseUp={handleTabsMouseUp}
                            onMouseMove={handleTabsMouseMove}
                            className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0 w-full select-none cursor-grab active:cursor-grabbing scroll-smooth px-6" 
                            id="encyclopedia-tabs-filter"
                          >
                            <button
                              onClick={() => {
                                if (hasDragged.current) return;
                                setSelectedCategory(null);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                                selectedCategory === null 
                                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                                  : theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-800'
                              }`}
                            >
                              全部
                            </button>
                            
                            {(['solar', 'deepspace', 'basics', 'phenomena', 'exploration'] as CategoryType[]).map((cat) => (
                              <button
                                key={cat}
                                onClick={() => {
                                  if (hasDragged.current) return;
                                  setSelectedCategory(cat);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                                  selectedCategory === cat 
                                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                                    : theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-800'
                                }`}
                                id={`tab-filter-${cat}`}
                              >
                                {categoryLabels[cat]}
                              </button>
                            ))}
                          </div>

                          {/* Right scroll arrow */}
                          <button 
                            onClick={() => {
                              if (tabsScrollRef.current) {
                                tabsScrollRef.current.scrollBy({ left: 140, behavior: 'smooth' });
                              }
                            }}
                            className={`absolute -right-1.5 z-20 p-1.5 rounded-full shadow-lg border backdrop-blur-md cursor-pointer transition-all duration-200 flex items-center justify-center ${
                              theme === 'dark' 
                                ? 'bg-slate-900/90 text-indigo-300 border-white/10 hover:bg-slate-800' 
                                : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                            aria-label="Scroll Right"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Listing Articles */}
                        <div className="flex flex-col gap-3 mt-1" id="articles-items-stack">
                          {articles
                            .filter(art => selectedCategory === null || art.category === selectedCategory)
                            .map((art) => (
                              <div
                                key={art.id}
                                onClick={() => handleSelectArticle(art.id)}
                                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-99 ${
                                  theme === 'dark' 
                                    ? 'glass-card border-white/5 hover:border-white/10 hover:bg-white/5' 
                                    : 'glass-card-light'
                                }`}
                                id={`article-item-card-${art.id}`}
                              >
                                <div className="flex justify-between items-start mb-1.5">
                                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                                    {categoryLabels[art.category]}
                                  </span>
                                  {bookmarks.includes(art.id) && (
                                    <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                  )}
                                </div>
                                <h3 className="text-sm font-bold text-white font-display mb-1">{art.title}</h3>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{art.summary}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. SIMULATORS TAB */}
                {activeTab === 'visuals' && (
                  <motion.div
                    key="visuals-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col h-full gap-4"
                    id="view-simulators"
                  >
                    {/* Top toggle bar inside simulator section */}
                    <div className="flex p-1 rounded-xl bg-slate-950/60 border border-white/5" id="simulators-inner-toggles">
                      {[
                        { id: 'solar', label: "3D 太阳系" },
                        { id: 'phenomena', label: "天文现象" },
                        { id: 'scale', label: "尺度对比" }
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveVisualTab(sub.id as 'solar' | 'phenomena' | 'scale')}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            activeVisualTab === sub.id 
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                              : 'text-slate-400 hover:text-white'
                          }`}
                          id={`simulator-subtab-${sub.id}`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    {/* Sub simulator content switcher */}
                    <div className="flex-1 min-h-[460px] rounded-2xl overflow-hidden border border-white/5 bg-slate-950" id="simulators-viewport-wrapper">
                      {activeVisualTab === 'solar' && (
                        <SolarSystemSimulator 
                          onSelectPlanet={(planetId) => {
                            handleSelectArticle(planetId);
                          }} 
                          theme={theme}
                        />
                      )}
                      {activeVisualTab === 'phenomena' && (
                        <PhenomenaSimulator theme={theme} />
                      )}
                      {activeVisualTab === 'scale' && (
                        <ScaleComparison theme={theme} />
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 4. QUIZ TAB */}
                {activeTab === 'quiz' && (
                  <motion.div
                    key="quiz-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-4 text-left"
                    id="view-quiz-practice"
                  >
                    {/* Quiz Hub Header */}
                    <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-white/5 flex items-center justify-between shadow-lg glow-purple" id="quiz-hub-hero">
                      <div>
                        <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5 glow-text">
                          <Award className="w-4 h-4 text-amber-500" />
                          零基础宇宙知识自测
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">边做题边掌握通俗原理</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 text-center shrink-0">
                        <span className="text-base font-bold font-mono">
                          {Object.keys(quizScore).length} / {quizzes.length}
                        </span>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-widest mt-0.5">已挑战</span>
                      </div>
                    </div>

                    {/* Quiz pool */}
                    <div className="flex flex-col gap-3.5" id="quizzes-container-list">
                      {quizzes.map((quiz, index) => {
                        const savedAnswer = quizScore[quiz.id]; // Saved answered index
                        const hasAnswered = savedAnswer !== undefined;

                        return (
                          <div
                            key={quiz.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              hasAnswered 
                                ? savedAnswer === quiz.answerIndex
                                  ? 'bg-emerald-500/10 border-emerald-500/20'
                                  : 'bg-rose-500/10 border-rose-500/20'
                                : theme === 'dark' ? 'glass-card border-white/5' : 'glass-card-light'
                            }`}
                            id={`quiz-card-${quiz.id}`}
                          >
                            <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1">
                              问题 第 {index + 1} 题
                            </span>
                            <h4 className="text-sm font-bold text-slate-200 font-display mb-3">
                              {quiz.question}
                            </h4>

                            {/* Option selections */}
                            <div className="flex flex-col gap-2" id={`quiz-options-${quiz.id}`}>
                              {quiz.options.map((opt, optIdx) => {
                                const isCorrectOpt = optIdx === quiz.answerIndex;
                                const isSelectedOpt = optIdx === savedAnswer;

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={hasAnswered}
                                    onClick={() => {
                                      setQuizScore(prev => ({
                                        ...prev,
                                        [quiz.id]: optIdx
                                      }));
                                    }}
                                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs text-left transition-all ${
                                      hasAnswered
                                        ? isCorrectOpt
                                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                                          : isSelectedOpt
                                            ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 opacity-90'
                                            : 'bg-slate-800/40 text-slate-500 opacity-60'
                                        : 'bg-slate-800/60 hover:bg-white/10 text-slate-300 border border-transparent hover:border-indigo-500/20 cursor-pointer'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Score feedback with explainer text */}
                            {hasAnswered && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-3.5 pt-3.5 border-t border-white/5 text-[11px] leading-relaxed text-slate-300 pl-1"
                              >
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  {savedAnswer === quiz.answerIndex ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-extrabold">
                                      ✓ 答对了！
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-extrabold">
                                      ✕ 答错了
                                    </span>
                                  )}
                                  <span className="text-slate-400 font-medium">官方通俗解析：</span>
                                </div>
                                <p className="text-slate-300 bg-white/2 px-2.5 py-2 rounded-lg border border-white/5">
                                  {quiz.explanation}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Reset quiz scores */}
                    {Object.keys(quizScore).length > 0 && (
                      <button
                        onClick={() => {
                          if (showQuizResetConfirm) {
                            setQuizScore({});
                            setShowQuizResetConfirm(false);
                          } else {
                            setShowQuizResetConfirm(true);
                            setTimeout(() => setShowQuizResetConfirm(false), 4000);
                          }
                        }}
                        className={`w-full mt-4 py-2 px-4 rounded-xl border text-xs text-center cursor-pointer transition-all duration-300 ${
                          showQuizResetConfirm 
                            ? 'bg-red-500/20 border-red-500/50 text-red-200 animate-pulse font-bold'
                            : 'border-dashed border-red-500/20 hover:border-red-500/40 text-red-400 hover:bg-red-500/5'
                        }`}
                        id="reset-quizzes-btn"
                      >
                        {showQuizResetConfirm ? '⚠️ 确认清除答题历史？(再次点击)' : '清除答题历史并重新挑战'}
                      </button>
                    )}

                  </motion.div>
                )}

                {/* 5. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex flex-col gap-5 text-left"
                    id="view-app-settings"
                  >
                    {/* Bookmarked articles list */}
                    <div className="flex flex-col gap-2" id="settings-bookmarks-list-section">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">我的知识收藏 ({bookmarks.length})</h4>
                      
                      {bookmarks.length === 0 ? (
                        <p className={`text-xs text-slate-500 p-4 rounded-2xl border border-dashed text-center ${theme === 'dark' ? 'border-white/5 bg-white/2' : 'border-slate-200 bg-slate-50'}`}>
                          尚未收藏任何天体或宇宙常识百科，前往阅读时点击“收藏”按钮即可保存到这里。
                        </p>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {bookmarks.map((id) => {
                            const art = articles.find(a => a.id === id);
                            if (!art) return null;
                            return (
                              <div
                                key={id}
                                onClick={() => handleSelectArticle(id)}
                                className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                                  theme === 'dark' ? 'bg-white/3 border-white/5 hover:bg-white/5' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                  <span className="text-xs text-slate-300 font-medium font-display">{art.title}</span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>



                    {/* About Us (App version details) */}
                    <div className={`p-4 rounded-3xl border text-slate-400 leading-normal ${theme === 'dark' ? 'glass-card border-white/5' : 'glass-card-light'}`} id="settings-about-us">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">关于应用</span>
                      <h4 className="text-xs font-bold text-slate-200 font-display mt-1 glow-text">万序宇宙</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        本应用为宇宙科普自学工具。内置全量太空多维百科、动态太阳系公转轨道模拟器、流星雨交互粒子画板、宇宙大爆炸和日食月食动态动画，致力于为天文初学者和小白提供最无压力、趣味沉浸的太空学习体验。
                      </p>
                    </div>

                    {/* Privacy Policy Trigger Button */}
                    <button
                      onClick={() => setShowAgreementModal('privacy')}
                      className={`w-full p-4 rounded-3xl border text-left flex items-center justify-between cursor-pointer transition-all duration-300 ${
                        theme === 'dark' ? 'glass-card border-white/5 hover:bg-white/5 hover:border-white/10' : 'glass-card-light'
                      }`}
                      id="settings-privacy-policy"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-400">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 font-display">隐私政策 (Privacy Policy)</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">查看个人数据保护与安全规范</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>

                  </motion.div>
                )}

              </AnimatePresence>
            )}

          </div>

        </div>

        {/* ========================================================= */}
        {/* CORE APPLICATION BOTTOM NAVIGATION BAR */}
        {/* ========================================================= */}
        <nav className={`px-4 py-2 shrink-0 border-t flex justify-between items-center z-40 relative ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800/80 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
        }`} id="android-bottom-nav">
          
          {[
            { id: 'home', label: "首页", icon: Home },
            { id: 'encyclopedia', label: "百科", icon: BookOpen },
            { id: 'visuals', label: "模拟", icon: Compass },
            { id: 'quiz', label: "答题", icon: GraduationCap },
            { id: 'settings', label: "设置", icon: Settings }
          ].map((nav) => {
            const isSel = activeTab === nav.id;
            const Icon = nav.icon;

            return (
              <button
                key={nav.id}
                onClick={() => {
                  setActiveTab(nav.id as 'home' | 'encyclopedia' | 'visuals' | 'quiz' | 'settings');
                  // Clear searching state when clicking tab
                  setIsSearching(false);
                  setSearchQuery('');
                  // If we click encyclopedia tab, reset back to listing if it was on detail
                  if (nav.id === 'encyclopedia') {
                    setCurrentArticle(null);
                  }
                }}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
                  isSel 
                    ? 'text-amber-500 font-extrabold scale-105' 
                    : 'hover:text-slate-200 opacity-70'
                }`}
                id={`nav-item-${nav.id}`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-150 ${isSel ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-medium font-display leading-none">{nav.label}</span>
              </button>
            );
          })}

        </nav>

        {/* Android Device Bottom Navigation Pill Line bar (Hides on native mobile) */}
        <div className={`hidden md:block py-2 select-none shrink-0 border-t ${
          theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-100'
        }`} id="android-device-virtual-pill">
          <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto"></div>
        </div>

        {/* =========================================================
            Startup Consent Flow: 用户协议 + 隐私政策 启动弹窗
            ========================================================= */}
        <AnimatePresence>
          {/* 1. 启动主弹窗（未同意时显示，覆盖全屏，pointer-events 阻止操作底层） */}
          {!consentAccepted && (
            <PrivacyModal
              onAccept={handleConsentAccept}
              onDecline={handleConsentDecline}
              onOpenAgreement={() => setShowAgreementModal('agreement')}
              onOpenPrivacy={() => setShowAgreementModal('privacy')}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* 2. 用户协议详情弹窗 */}
          {showAgreementModal === 'agreement' && (
            <AgreementModal
              onClose={() => setShowAgreementModal(null)}
              title="用户服务协议"
              content={<UserAgreementContent />}
            />
          )}

          {/* 3. 隐私政策详情弹窗 */}
          {showAgreementModal === 'privacy' && (
            <AgreementModal
              onClose={() => setShowAgreementModal(null)}
              title="隐私政策"
              content={<PrivacyPolicyContent />}
            />
          )}
        </AnimatePresence>

        {/* 4. 拒绝时的二次确认弹窗（参考代码第 5 段） */}
        <AnimatePresence>
          {showDeclineModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[120]">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                className="bg-slate-900 rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl border border-white/10 flex flex-col text-slate-200"
              >
                <div className="flex-1 p-6">
                  <h2 className="text-xl font-bold text-slate-100 mb-4 font-display">确认拒绝</h2>
                  <p className="text-slate-400 leading-relaxed">
                    您确定要拒绝用户协议与隐私政策吗？<br />
                    <span className="text-amber-300">拒绝后将无法进入并使用「万序宇宙」的服务。</span>
                  </p>
                </div>
                <div className="flex border-t border-white/10">
                  <button
                    onClick={handleDeclineCancel}
                    className="flex-1 py-4 text-center text-slate-300 font-medium hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    取消
                  </button>
                  <div className="w-px bg-white/10"></div>
                  <button
                    onClick={handleDeclineConfirm}
                    className="flex-1 py-4 text-center text-amber-400 font-medium hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    确定拒绝
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
