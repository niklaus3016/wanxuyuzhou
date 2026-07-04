import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlossaryItem } from '../types';
import { BookOpen, X } from 'lucide-react';

interface TextWithGlossaryProps {
  text: string;
  glossary: GlossaryItem[];
  theme: 'dark' | 'light';
}

export default function TextWithGlossary({ text, glossary, theme }: TextWithGlossaryProps) {
  const [activeTerm, setActiveTerm] = useState<GlossaryItem | null>(null);

  if (!glossary || glossary.length === 0) {
    return <span className="leading-relaxed whitespace-pre-line">{text}</span>;
  }

  // Find all terms that exist in the text
  // We want to sort terms by length descending to avoid partial matches on nested words (if any)
  const sortedGlossary = [...glossary].sort((a, b) => b.term.length - a.term.length);
  
  // We want to replace only the *first* occurrence of each term to prevent UI clutter,
  // or we can replace all. Let's do a robust, non-overlapping replacement of terms.
  // To keep it highly reliable, we split the text and build React elements.
  let elements: React.ReactNode[] = [text];

  sortedGlossary.forEach((item) => {
    const term = item.term;
    const tempElements: React.ReactNode[] = [];
    let termReplaced = false;

    elements.forEach((node) => {
      if (typeof node !== 'string') {
        tempElements.push(node);
        return;
      }

      // If we already replaced this term in previous parts, or this string doesn't contain it, skip
      if (!node.includes(term) || termReplaced) {
        tempElements.push(node);
        return;
      }

      // Replace only the FIRST occurrence of this term in this chunk
      const index = node.indexOf(term);
      const before = node.slice(0, index);
      const after = node.slice(index + term.length);

      if (before) tempElements.push(before);
      
      // Wrap the matched term
      tempElements.push(
        <button
          key={`term-${term}-${index}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTerm(item);
          }}
          className="mx-0.5 px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border-b border-dashed border-amber-400 font-medium hover:bg-amber-500/20 active:scale-95 transition-all text-left inline-flex items-center cursor-pointer"
          title="点击查看名词释义"
          id={`glossary-btn-${term}`}
        >
          {term}
        </button>
      );

      if (after) tempElements.push(after);
      termReplaced = true; // Mark as replaced to only annotate the first occurrence
    });

    elements = tempElements;
  });

  return (
    <>
      <span className="leading-relaxed whitespace-pre-line">
        {elements.map((el, i) => (
          <React.Fragment key={i}>{el}</React.Fragment>
        ))}
      </span>

      {/* Pop-up explaining the term */}
      <AnimatePresence>
        {activeTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl relative border ${
                theme === 'dark' 
                  ? 'bg-slate-900/95 text-slate-100 border-slate-700/80' 
                  : 'bg-white/95 text-slate-900 border-slate-200'
              }`}
              onClick={(e) => e.stopPropagation()}
              id="glossary-popup-card"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveTerm(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-500/10 transition-colors"
                id="close-glossary-popup"
              >
                <X className="w-5 h-5 opacity-70" />
              </button>

              {/* Icon & Title */}
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold font-display tracking-tight text-amber-400">
                  {activeTerm.term}
                </h4>
              </div>

              {/* Definition */}
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {activeTerm.definition}
              </p>

              {/* Action Button */}
              <button
                onClick={() => setActiveTerm(null)}
                className="w-full mt-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-all shadow-md active:scale-98 cursor-pointer text-center"
                id="dismiss-glossary-popup"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
