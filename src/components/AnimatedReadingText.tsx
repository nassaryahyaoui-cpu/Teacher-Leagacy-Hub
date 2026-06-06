import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, FileText } from 'lucide-react';
import { findComplexWordInfoLocal } from '../data/complexWordsData';

export interface TextChunk {
  type: 'word' | 'separator';
  text: string;
  startIndex?: number;
  endIndex?: number;
  wordIndex?: number;
  syllablesCount?: number;
}

/**
 * Accurately estimates syllables in a French word.
 */
export const countFrenchSyllables = (word: string): number => {
  if (!word) return 0;
  // Normalize to remove accents for simple sound/vowel pattern calculations
  const clean = word.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/gi, ''); // remove punctuation

  if (clean.length === 0) return 0;

  // Let's count vowel clusters
  const vowelClusters = clean.match(/[aeiouy]+/g);
  if (!vowelClusters) return 1;
  let count = vowelClusters.length;

  // Adjust for silent e at the end (highly common in French)
  if (clean.endsWith('e') && count > 1) {
    if (!clean.endsWith('ee')) {
      count--;
    }
  }
  
  // Adjust for pleural silent 'es'
  if (clean.endsWith('es') && count > 1) {
    if (!clean.endsWith('ees')) {
      count--;
    }
  }

  // Adjust for silent 'ent' suffix at the end of French plural verbs (e.g., jouent, mangent, voient)
  if (clean.endsWith('ent') && clean.length > 4 && count > 1) {
    count--;
  }

  return Math.max(1, count);
};

/**
 * Splits a French word into its readable syllabic chunks for display.
 */
export const splitIntoSyllables = (word: string): string[] => {
  if (!word) return [];
  const cleanWord = word.trim();
  if (cleanWord.length <= 3) return [cleanWord];

  const syllables: string[] = [];
  let current = "";
  
  const isVowel = (char: string) => {
    return /[aeiouyàâäéèêëîïôöùûüçÂÀÉÈÇÎÏÔÖÛÜÙ]/i.test(char);
  };

  for (let i = 0; i < cleanWord.length; i++) {
    const char = cleanWord[i];
    current += char;

    const nextChar = cleanWord[i + 1];
    const nextNextChar = cleanWord[i + 2];

    if (nextChar) {
      // Rule 1: Vowel followed by single consonant and vowel -> break after vowel
      if (isVowel(char) && !isVowel(nextChar) && nextNextChar && isVowel(nextNextChar)) {
        syllables.push(current);
        current = "";
        continue;
      }

      // Rule 2: Double consonant of the same letter -> break between them
      if (!isVowel(char) && !isVowel(nextChar) && char.toLowerCase() === nextChar.toLowerCase()) {
        syllables.push(current);
        current = "";
        continue;
      }

      // Rule 3: Break between double consonants except cohesive combinations
      if (isVowel(char) && !isVowel(nextChar) && nextNextChar && !isVowel(nextNextChar)) {
        const doubleCons = (nextChar + nextNextChar).toLowerCase();
        const nonSplitCombinations = ['ch', 'tr', 'pl', 'br', 'cl', 'cr', 'dr', 'fr', 'gr', 'pr', 'vr', 'ph', 'bl', 'fl', 'gl'];
        if (nonSplitCombinations.includes(doubleCons)) {
          syllables.push(current + nextChar);
          current = "";
          i++; // skip nextChar
          continue;
        } else {
          syllables.push(current);
          current = "";
          continue;
        }
      }
    }
  }

  if (current) {
    syllables.push(current);
  }

  const result = syllables.filter(s => s.length > 0);
  return result.length > 0 ? result : [cleanWord];
};

/**
 * Parses full paragraph text into individual chunks (keeping punctuation and exact spacing).
 */
export const parseTextToChunks = (text: string): TextChunk[] => {
  if (!text) return [];
  const chunks: TextChunk[] = [];
  const regex = /([a-zA-Z0-9àâäéèêëîïôöùûüçÂÀÉÈÇÎÏÔÖÛÜÙ]+)|([^a-zA-Z0-9àâäéèêëîïôöùûüçÂÀÉÈÇÎÏÔÖÛÜÙ]+)/g;
  let match;
  let wordIndex = 0;
  
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      const wordStr = match[1];
      chunks.push({
        type: 'word',
        text: wordStr,
        startIndex: match.index,
        endIndex: match.index + wordStr.length,
        wordIndex: wordIndex,
        syllablesCount: countFrenchSyllables(wordStr)
      });
      wordIndex++;
    } else if (match[2]) {
      chunks.push({
        type: 'separator',
        text: match[2]
      });
    }
  }
  return chunks;
};

interface AnimatedReadingTextProps {
  text: string;
  activeCharIndex: number;
  ttsStatus: 'stopped' | 'playing' | 'paused';
  fontSize: number;
  textColor: string;
  lineHeight: string;
  fontClass: string;
  onWordClick?: (word: string) => void;
  onWordHover?: (word: string | null) => void;
}

export const AnimatedReadingText: React.FC<AnimatedReadingTextProps> = ({
  text,
  activeCharIndex,
  ttsStatus,
  fontSize,
  textColor,
  lineHeight,
  fontClass,
  onWordClick,
  onWordHover
}) => {
  const chunks = useMemo(() => parseTextToChunks(text), [text]);

  const wordChunks = useMemo(() => chunks.filter(c => c.type === 'word'), [chunks]);
  
  const totalWords = wordChunks.length;
  const totalSyllables = useMemo(() => {
    return wordChunks.reduce((acc, c) => acc + (c.syllablesCount || 0), 0);
  }, [wordChunks]);

  // Find currently active word
  const activeChunk = useMemo(() => {
    if (activeCharIndex < 0 || ttsStatus === 'stopped') return null;
    return chunks.find(c => c.type === 'word' && activeCharIndex >= c.startIndex! && activeCharIndex < c.endIndex!);
  }, [chunks, activeCharIndex, ttsStatus]);

  const activeWordIdx = activeChunk ? activeChunk.wordIndex : -1;

  // Calculate live progression values
  const textIsRunning = ttsStatus === 'playing' || ttsStatus === 'paused';
  const currentSpokenWords = textIsRunning && activeWordIdx !== undefined && activeWordIdx >= 0
    ? activeWordIdx + 1
    : (ttsStatus === 'stopped' ? 0 : 0);

  const currentSpokenSyllables = useMemo(() => {
    if (!textIsRunning || activeWordIdx === undefined || activeWordIdx < 0) return 0;
    return wordChunks.slice(0, activeWordIdx + 1).reduce((acc, c) => acc + (c.syllablesCount || 0), 0);
  }, [wordChunks, activeWordIdx, textIsRunning]);

  const progressPercentage = totalWords > 0 ? (currentSpokenWords / totalWords) * 100 : 0;

  // Split active word into syllables for prominent display
  const activeSyllables = useMemo(() => {
    if (!activeChunk) return [];
    return splitIntoSyllables(activeChunk.text);
  }, [activeChunk]);

  return (
    <div className="space-y-6">
      {/* 📊 Live Statistics Counter Panel (Compteur de mots et de syllabes de la lecture animée) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--accent)]/5 border-2 border-[var(--border)] p-4 rounded-3xl no-print">
        {/* Words Counter Badge */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-black/5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-650 flex items-center justify-center font-baloo font-bold">
            <FileText size={18} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Mots lus</p>
            <p className="font-baloo text-base font-black text-gray-800">
              <span className="text-blue-600 text-lg">{currentSpokenWords}</span>
              <span className="text-gray-300"> / {totalWords}</span>
            </p>
          </div>
        </div>

        {/* Syllables Counter Badge */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-black/5">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-650 flex items-center justify-center font-baloo font-bold">
            <Activity size={18} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Syllabes</p>
            <p className="font-baloo text-base font-black text-gray-800">
              <span className="text-indigo-600 text-lg">{currentSpokenSyllables}</span>
              <span className="text-gray-300"> / {totalSyllables}</span>
            </p>
          </div>
        </div>

        {/* Real-time Syllabic breakdown of the current spoken word */}
        <div className="col-span-2 md:col-span-1 flex items-center justify-center bg-white p-3 px-5 rounded-2xl shadow-sm border border-black/5 min-h-[58px]">
          {activeChunk ? (
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-amber-500 tracking-wider mb-0.5 flex items-center justify-center gap-1">
                <Sparkles size={10} className="animate-spin" /> Syllabes du mot :
              </p>
              <div className="flex justify-center items-center gap-1 font-baloo font-black text-sm uppercase tracking-wide text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100">
                {activeSyllables.map((syl, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <span className="hover:scale-115 transition-transform">{syl}</span>
                    {sIdx < activeSyllables.length - 1 && <span className="opacity-30 text-xs">-</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[10px] font-bold text-gray-400 italic text-center select-none">
              {ttsStatus === 'paused' ? "Lecture en pause ⏸️" : "En attente de la lecture... 🎙️"}
            </p>
          )}
        </div>
      </div>

      {/* 📈 Live Progress Slider */}
      {textIsRunning && (
        <div className="w-full bg-gray-200/60 h-2.5 rounded-full overflow-hidden border border-black/5 shadow-inner relative no-print">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-[var(--accent)] rounded-full shadow"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
        </div>
      )}

      {/* 📖 Text Container with live word spotlight highlighting */}
      <div className="relative leading-relaxed select-text text-left pt-2">
        <p style={{ fontSize: `${fontSize}px`, color: textColor }} className={`${lineHeight} ${fontClass}`}>
          {chunks.map((chunk, index) => {
            if (chunk.type === 'separator') {
              return <span key={index}>{chunk.text}</span>;
            }

            const isWordSpoken = textIsRunning && chunk.wordIndex! <= activeWordIdx!;
            const isWordActive = textIsRunning && chunk.wordIndex === activeWordIdx;
            const complexInfo = findComplexWordInfoLocal(chunk.text);
            const isComplex = !!complexInfo;

            return (
              <span
                key={index}
                onClick={() => onWordClick && onWordClick(chunk.text)}
                onMouseEnter={() => {
                  if (onWordHover && isComplex) {
                    onWordHover(chunk.text);
                  }
                }}
                className={`inline-block mx-0.5 cursor-pointer select-all transition-all duration-150 rounded px-1 group relative ${
                  isWordActive
                    ? 'bg-amber-300 text-amber-950 font-black scale-110 shadow-md shadow-amber-400/40 border-b-2 border-amber-600/50 ring-2 ring-amber-400/40'
                    : isWordSpoken
                    ? 'text-emerald-700 font-extrabold border-b border-dashed border-emerald-500/50 bg-emerald-500/5'
                    : isComplex
                    ? 'border-b-2 border-dashed border-purple-400 text-purple-950 font-medium hover:bg-purple-100/50 hover:text-purple-900'
                    : 'hover:bg-gray-100 hover:text-[var(--primary)]'
                }`}
                title={isComplex ? "Survole ce mot complexe pour voir l'Assistant Mot ! ✨" : "Clique pour voir la définition"}
              >
                {chunk.text}

                {/* Micro syllable count popup helper */}
                {isWordActive && chunk.syllablesCount && chunk.syllablesCount > 0 && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-baloo text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg border border-white flex items-center gap-0.5 z-25 whitespace-nowrap animate-bounce uppercase">
                    {chunk.syllablesCount} syl.
                  </span>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
