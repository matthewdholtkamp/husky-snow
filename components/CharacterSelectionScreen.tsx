import React, { useState } from 'react';
import Snowfall from './Snowfall';
import StatBar from './StatBar';
import { CHARACTERS } from '../src/constants';
import type { Character, Player } from '../src/types';
import { Sparkles, Shield, Zap, Brain, Users, Clipboard, LogIn, RotateCcw } from './icons';

interface CharacterSelectionScreenProps {
  onSelectChar: (char: Character) => void;
  onLeaveGame: () => void;
  isLoading: boolean;
  error: string | null;
  gameId: string | null;
  playersInGame: Player[];
  modeNotice?: string | null;
}

interface QuizQuestion {
  text: string;
  options: {
    text: string;
    points: { charName: string; weight: number }[];
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    text: "What is your ideal pack role during a trek through the snow?",
    options: [
      {
        text: "🌲 Running ahead to scout the trail and climbing trees for high ground.",
        points: [{ charName: "Spruce", weight: 2 }, { charName: "Storm", weight: 1 }]
      },
      {
        text: "🛡️ Standing guard to protect the team and check for danger.",
        points: [{ charName: "Glacier", weight: 2 }, { charName: "Oak", weight: 1 }]
      },
      {
        text: "🧠 Checking the map, calculating resources, and correcting anyone who gets lost.",
        points: [{ charName: "Shiver", weight: 2 }]
      },
      {
        text: "💖 Gathering warm berries, soothing scratches, and keeping spirits high.",
        points: [{ charName: "Flurry", weight: 2 }]
      }
    ]
  },
  {
    text: "Pick a cool elemental power you would love to control!",
    options: [
      {
        text: "❄️ Ice Shields & Frost Magic",
        points: [{ charName: "Shiver", weight: 1.5 }, { charName: "Glacier", weight: 1.5 }]
      },
      {
        text: "⚡ Crackling Thunder & Red Lightning",
        points: [{ charName: "Storm", weight: 2 }]
      },
      {
        text: "🔥 Cozy Fire & Solar Embers",
        points: [{ charName: "Spruce", weight: 2 }]
      },
      {
        text: "🍃 Whispering Wind & Healing Plants",
        points: [{ charName: "Flurry", weight: 1.5 }, { charName: "Oak", weight: 1.5 }]
      }
    ]
  },
  {
    text: "How do you solve a locked stone door blocking your path?",
    options: [
      {
        text: "🤸 Scout for a high window to sneak through or pick the lock.",
        points: [{ charName: "Spruce", weight: 2 }]
      },
      {
        text: "💥 Charge and smash it down with a heavy tail-swipe!",
        points: [{ charName: "Storm", weight: 1.5 }, { charName: "Glacier", weight: 1.5 }]
      },
      {
        text: "🧩 Read the runes and solve the logic puzzle on the lock.",
        points: [{ charName: "Shiver", weight: 2 }]
      },
      {
        text: "✨ Call upon the forest spirits or seek a key hidden in the moss.",
        points: [{ charName: "Flurry", weight: 1.5 }, { charName: "Oak", weight: 1.5 }]
      }
    ]
  },
  {
    text: "What is your absolute favorite thing to do on a snow day?",
    options: [
      {
        text: "🏂 Climbing high snowdrifts and telling funny winter stories.",
        points: [{ charName: "Spruce", weight: 2 }]
      },
      {
        text: "⚔️ Starting an epic, fast-paced snowball battle!",
        points: [{ charName: "Storm", weight: 2 }]
      },
      {
        text: "🏰 Building a sturdy, warm snow castle fort.",
        points: [{ charName: "Glacier", weight: 1.5 }, { charName: "Shiver", weight: 1.5 }]
      },
      {
        text: "🐾 Spotting hidden animal tracks and helping a chilly bird.",
        points: [{ charName: "Oak", weight: 1.5 }, { charName: "Flurry", weight: 1.5 }]
      }
    ]
  }
];

const CharacterSelectionScreen: React.FC<CharacterSelectionScreenProps> = ({
  onSelectChar,
  onLeaveGame,
  isLoading,
  error,
  gameId,
  playersInGame,
  modeNotice
}) => {
  const [copied, setCopied] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [recommendedCharName, setRecommendedCharName] = useState<string | null>(null);

  const takenCharNames = playersInGame.map(p => p.charName);

  const handleCopy = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAnswerSelect = (option: typeof QUIZ_QUESTIONS[number]['options'][number]) => {
    const updatedScores = { ...quizScores };
    option.points.forEach(p => {
      updatedScores[p.charName] = (updatedScores[p.charName] || 0) + p.weight;
    });
    setQuizScores(updatedScores);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      let highestScore = -1;
      let recommended = '';
      CHARACTERS.forEach(char => {
        const score = updatedScores[char.name] || 0;
        if (score > highestScore) {
          highestScore = score;
          recommended = char.name;
        }
      });
      setRecommendedCharName(recommended);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 overflow-y-auto">
      <Snowfall />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-cyan-100">Choose Your Pup</h2>
            <p className="text-slate-400 mt-2">The pack awaits your decision...</p>
            {!quizActive && (
              <button
                onClick={() => {
                  setQuizActive(true);
                  setCurrentQuestion(0);
                  setQuizScores({});
                  setRecommendedCharName(null);
                }}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-500/25 transition-all active:scale-95 border border-indigo-400/30 flex items-center gap-2 mx-auto"
              >
                <Sparkles size={16} className="animate-pulse" />
                🔮 Find Your Match: Take the Pup Quiz!
              </button>
            )}
        </div>

        {gameId && (
            <div className="max-w-2xl mx-auto bg-slate-950/50 border border-slate-800 rounded-2xl p-4 mb-6 text-center">
                <div className="mb-3">
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Share Game ID</label>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <input type="text" readOnly value={gameId} className="bg-slate-800 text-center text-cyan-300 font-mono rounded-md px-2 py-1 select-all" />
                        <button onClick={handleCopy} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-colors">
                            <Clipboard size={16} />
                        </button>
                    </div>
                    {copied && <p className="text-emerald-400 text-xs mt-2">Copied to clipboard!</p>}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                    <h3 className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center justify-center gap-2 mb-2"><Users size={14} /> Players in Lobby ({playersInGame.length})</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {playersInGame.length > 0 ? playersInGame.map(p => (
                            <span key={p.userId} className="bg-slate-700 text-slate-200 text-sm font-bold px-3 py-1 rounded-full">{p.charName || 'Choosing...'}</span>
                        )) : (
                            <span className="text-slate-600 italic text-sm">You are the first one here!</span>
                        )}
                    </div>
                </div>
            </div>
        )}
         <button onClick={onLeaveGame} className="absolute top-0 left-0 m-2 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
            <LogIn size={20} className="rotate-180" />
            <span className="sr-only">Leave Game</span>
         </button>

        {error && <p className="text-red-400 mb-4 text-center bg-red-900/50 p-3 rounded-lg border border-red-700 max-w-md mx-auto">{error}</p>}
        {modeNotice && <p className="text-amber-200 mb-4 text-center bg-amber-950/60 p-3 rounded-lg border border-amber-700/60 max-w-2xl mx-auto">{modeNotice}</p>}

        {quizActive ? (
          <div className="max-w-2xl mx-auto bg-slate-950/70 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} /> Pup Match Quiz
              </span>
              <button
                onClick={() => {
                  setQuizActive(false);
                  setRecommendedCharName(null);
                }}
                className="text-xs text-slate-500 hover:text-white underline transition-colors"
              >
                Cancel Quiz
              </button>
            </div>

            {recommendedCharName === null ? (
              <div>
                <div className="w-full bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 font-mono">
                  Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-white mb-6 leading-snug">
                  {QUIZ_QUESTIONS[currentQuestion].text}
                </h3>

                <div className="space-y-4">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      className="w-full text-left px-5 py-4 bg-slate-900/60 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/40 rounded-2xl text-slate-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between group"
                    >
                      <span className="text-sm md:text-base font-medium pr-4">{option.text}</span>
                      <span className="w-6 h-6 rounded-full border border-slate-700 group-hover:border-indigo-500 flex items-center justify-center shrink-0 text-indigo-400 transition-colors text-xs">
                        ➔
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex p-3.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-4 animate-bounce">
                  <Sparkles className="w-10 h-10 text-indigo-400" />
                </div>
                
                <h3 className="text-xs text-indigo-300 uppercase tracking-widest font-extrabold mb-1 font-mono">
                  The Spirits Have Spoken!
                </h3>
                <h4 className="text-3xl font-serif font-extrabold text-white mb-4">
                  Your Perfect Match is {recommendedCharName}!
                </h4>

                {(() => {
                  const recommendedChar = CHARACTERS.find(c => c.name === recommendedCharName);
                  if (!recommendedChar) return null;
                  const isTaken = takenCharNames.includes(recommendedCharName);
                  
                  return (
                    <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden p-6 mb-6 text-left shadow-lg relative">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-xl ${recommendedChar.color} flex items-center justify-center text-white`}>
                          <recommendedChar.icon size={36} />
                        </div>
                        <div>
                          <h5 className="text-xl font-bold text-white leading-none">{recommendedChar.name}</h5>
                          <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{recommendedChar.role}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300 leading-relaxed mb-4">
                        {recommendedChar.description}
                      </p>

                      <div className="text-xs text-slate-500 flex justify-between border-t border-slate-800 pt-3">
                        <span>Special Ability</span>
                        <span className="font-bold text-cyan-300">{recommendedChar.ability}</span>
                      </div>

                      {isTaken && (
                        <div className="mt-4 p-3 bg-red-950/40 border border-red-500/20 rounded-lg text-rose-400 text-xs flex gap-2">
                          <span>⚠️</span>
                          <span><strong>{recommendedCharName}</strong> is taken in this lobby by another player. You can select another character from the list below!</span>
                        </div>
                      )}

                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => {
                            setQuizActive(false);
                          }}
                          className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-700"
                        >
                          View All Pups
                        </button>
                        <button
                          disabled={isTaken || isLoading}
                          onClick={() => onSelectChar(recommendedChar)}
                          className={`flex-1 px-4 py-2.5 text-xs font-bold rounded-lg font-serif transition-all flex items-center justify-center gap-2 ${
                            isTaken 
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
                          }`}
                        >
                          Choose {recommendedCharName}
                        </button>
                      </div>
                    </div>
                  );
                })()}
                
                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setQuizScores({});
                    setRecommendedCharName(null);
                  }}
                  className="text-xs text-slate-500 hover:text-white underline transition-colors flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw size={12} /> Retake Quiz
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {CHARACTERS.map(char => {
              const isTaken = takenCharNames.includes(char.name);
              const isRecommended = recommendedCharName === char.name;
              return (
                <div
                  key={char.id}
                  onClick={() => !isLoading && !isTaken && onSelectChar(char)}
                  className={`
                    group bg-slate-800/90 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full relative
                    ${isTaken ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan-400 cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:-translate-y-2'}
                    ${isRecommended && !isTaken ? 'ring-4 ring-indigo-500/70 border-indigo-400 shadow-indigo-500/30 animate-pulse' : 'border-slate-700'}
                  `}
                >
                  {isRecommended && !isTaken && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-indigo-500 to-purple-600 border border-indigo-400/30 text-[10px] font-extrabold text-white px-2.5 py-0.5 rounded-full shadow-md z-20 flex items-center gap-1.5">
                      <Sparkles size={8} /> MATCH
                    </div>
                  )}
                  <div className={`h-40 ${char.color} relative flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <char.icon size={80} className="text-white/90 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
                    {isTaken && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold uppercase tracking-widest">Taken</div>}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-1">{char.name}</h3>
                    <p className="text-cyan-400 text-xs font-bold mb-4 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={10} /> {char.role}
                    </p>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed flex-1">{char.description}</p>

                    <div className="space-y-3 mt-auto bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                      <StatBar label="STR" value={char.stats.strength} icon={Shield} color="bg-rose-500" />
                      <StatBar label="AGI" value={char.stats.agility} icon={Zap} color="bg-amber-500" />
                      <StatBar label="INT" value={char.stats.smart} icon={Brain} color="bg-blue-500" />
                      <StatBar label="SPR" value={char.stats.spirit} icon={Sparkles} color="bg-violet-500" />
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                      <span className="text-xs text-slate-500 uppercase tracking-wide">Special Ability</span>
                      <span className="text-xs font-bold text-cyan-300 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/30">{char.ability}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelectionScreen;
