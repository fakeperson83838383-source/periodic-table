import { useState, useEffect, useCallback } from 'react';
import { elements, Element, categoryColors, getIonChargeColor } from '@/data/elements';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trophy, ArrowRight, HelpCircle, Lightbulb, Zap, Target, BookOpen, RotateCcw, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { BohrModel } from './BohrModel';

type QuestionType = 'symbol_to_name' | 'name_to_symbol' | 'atomic_number' | 'category' | 'ion_charge' | 'shells';
type Difficulty = 'easy' | 'medium' | 'hard';
type Mode = 'quiz' | 'flashcards' | 'memory';

interface QuizStats {
  correct: number;
  wrong: number;
  streak: number;
  bestStreak: number;
}

interface FlashCard {
  element: Element;
  isFlipped: boolean;
}

interface MemoryCard {
  id: number;
  element: Element;
  type: 'symbol' | 'name';
  isFlipped: boolean;
  isMatched: boolean;
}

export const Quiz: React.FC = () => {
  const [mode, setMode] = useState<Mode>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState<Element | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType>('symbol_to_name');
  const [options, setOptions] = useState<Element[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [stats, setStats] = useState<QuizStats>({ correct: 0, wrong: 0, streak: 0, bestStreak: 0 });
  
  // Flashcard state
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  
  // Memory game state
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryMatches, setMemoryMatches] = useState(0);

  const getDifficultyElements = useCallback(() => {
    switch (difficulty) {
      case 'easy':
        return elements.filter(e => e.number <= 20);
      case 'medium':
        return elements.filter(e => e.number <= 54);
      case 'hard':
        return elements.filter(e => e.number <= 86);
    }
  }, [difficulty]);

  const initFlashcards = useCallback(() => {
    const availableElements = getDifficultyElements();
    const shuffled = [...availableElements].sort(() => Math.random() - 0.5).slice(0, 20);
    setFlashcards(shuffled.map(e => ({ element: e, isFlipped: false })));
    setCurrentFlashcardIndex(0);
  }, [getDifficultyElements]);

  const initMemoryGame = useCallback(() => {
    const availableElements = getDifficultyElements();
    const selected = [...availableElements].sort(() => Math.random() - 0.5).slice(0, 6);
    
    const cards: MemoryCard[] = [];
    selected.forEach((el, i) => {
      cards.push({ id: i * 2, element: el, type: 'symbol', isFlipped: false, isMatched: false });
      cards.push({ id: i * 2 + 1, element: el, type: 'name', isFlipped: false, isMatched: false });
    });
    
    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMemoryMoves(0);
    setMemoryMatches(0);
  }, [getDifficultyElements]);

  const generateQuestion = useCallback(() => {
    const availableElements = getDifficultyElements();
    const randomIndex = Math.floor(Math.random() * availableElements.length);
    const correctElement = availableElements[randomIndex];
    
    const easyTypes: QuestionType[] = ['symbol_to_name', 'name_to_symbol'];
    const mediumTypes: QuestionType[] = [...easyTypes, 'atomic_number', 'category'];
    const hardTypes: QuestionType[] = [...mediumTypes, 'ion_charge', 'shells'];
    
    const types = difficulty === 'easy' ? easyTypes : difficulty === 'medium' ? mediumTypes : hardTypes;
    const type = types[Math.floor(Math.random() * types.length)];
    setQuestionType(type);

    const wrongOptions: Element[] = [];
    const optionCount = difficulty === 'easy' ? 3 : 4;
    
    while (wrongOptions.length < optionCount) {
      const rand = Math.floor(Math.random() * availableElements.length);
      const candidate = availableElements[rand];
      if (candidate.number !== correctElement.number && 
          !wrongOptions.find(e => e.number === candidate.number)) {
        wrongOptions.push(candidate);
      }
    }
    
    const allOptions = [...wrongOptions, correctElement].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion(correctElement);
    setOptions(allOptions);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowHint(false);
  }, [difficulty, getDifficultyElements]);

  useEffect(() => {
    if (mode === 'quiz') {
      generateQuestion();
    } else if (mode === 'flashcards') {
      initFlashcards();
    } else if (mode === 'memory') {
      initMemoryGame();
    }
  }, [mode, generateQuestion, initFlashcards, initMemoryGame]);

  const handleOptionClick = (element: Element) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(element.number);
    const correct = element.number === currentQuestion?.number;
    setIsCorrect(correct);
    
    setStats(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        correct: prev.correct + (correct ? 1 : 0),
        wrong: prev.wrong + (correct ? 0 : 1),
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak)
      };
    });
  };

  const handleMemoryCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = memoryCards.find(c => c.id === cardId);
    if (!card || card.isMatched || flippedCards.includes(cardId)) return;
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      
      const [first, second] = newFlipped.map(id => memoryCards.find(c => c.id === id)!);
      
      if (first.element.number === second.element.number) {
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => 
            c.element.number === first.element.number ? { ...c, isMatched: true } : c
          ));
          setMemoryMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const getQuestionText = () => {
    switch (questionType) {
      case 'symbol_to_name': return "What element is this?";
      case 'name_to_symbol': return "What's the symbol?";
      case 'atomic_number': return "Which element has this atomic number?";
      case 'category': return "Which element is in this category?";
      case 'ion_charge': return "Which element forms this ion?";
      case 'shells': return "Which element has these shells?";
    }
  };

  const getQuestionContent = () => {
    if (!currentQuestion) return null;
    switch (questionType) {
      case 'symbol_to_name': 
        return <div className="text-5xl sm:text-7xl font-black text-indigo-600">{currentQuestion.symbol}</div>;
      case 'name_to_symbol': 
        return <div className="text-2xl sm:text-4xl font-bold">{currentQuestion.name}</div>;
      case 'atomic_number': 
        return <div className="text-6xl sm:text-8xl font-black text-indigo-600">{currentQuestion.number}</div>;
      case 'category': 
        return (
          <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-xl font-bold capitalize ${categoryColors[currentQuestion.category]}`}>
            {currentQuestion.category}
          </div>
        );
      case 'ion_charge':
        const ion = currentQuestion.ionCharge?.[0] || '+1';
        return (
          <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xl sm:text-2xl font-bold ${getIonChargeColor(ion)}`}>
            X<sup>{ion}</sup>
          </div>
        );
      case 'shells':
        return (
          <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
            {currentQuestion.shells.map((count, i) => (
              <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-base sm:text-lg font-bold text-blue-700">
                {count}
              </div>
            ))}
          </div>
        );
    }
  };

  const getOptionLabel = (option: Element) => {
    switch (questionType) {
      case 'symbol_to_name': return option.name;
      case 'name_to_symbol': return option.symbol;
      default: return `${option.symbol} - ${option.name}`;
    }
  };

  // Flashcard component
  const renderFlashcards = () => {
    if (flashcards.length === 0) return null;
    const currentCard = flashcards[currentFlashcardIndex];
    
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <span className="text-gray-500 text-sm">
            {currentFlashcardIndex + 1} / {flashcards.length}
          </span>
          <button
            onClick={initFlashcards}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
          >
            <Shuffle size={14} />
            Shuffle
          </button>
        </div>
        
        <div
          onClick={() => {
            setFlashcards(prev => prev.map((c, i) => 
              i === currentFlashcardIndex ? { ...c, isFlipped: !c.isFlipped } : c
            ));
          }}
          className="relative w-full aspect-[4/3] cursor-pointer perspective-1000"
        >
          <motion.div
            animate={{ rotateY: currentCard.isFlipped ? 180 : 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl border-2 border-gray-100 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-6xl sm:text-8xl font-black text-indigo-600">{currentCard.element.symbol}</div>
              <div className="text-gray-400 mt-4 text-sm">Tap to flip</div>
            </div>
            
            {/* Back */}
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-xl p-4"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="text-2xl sm:text-3xl font-bold">{currentCard.element.name}</div>
              <div className="text-indigo-200 mt-2">#{currentCard.element.number}</div>
              <div className="text-indigo-200 text-sm capitalize">{currentCard.element.category}</div>
              {currentCard.element.ionCharge && (
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  {currentCard.element.ionCharge.map((charge, i) => (
                    <span key={i} className="bg-white/20 px-2 py-1 rounded text-sm">
                      {currentCard.element.symbol}<sup>{charge !== '0' ? charge : ''}</sup>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={() => setCurrentFlashcardIndex(prev => Math.max(0, prev - 1))}
            disabled={currentFlashcardIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <ChevronLeft size={18} />
            Prev
          </button>
          <button
            onClick={() => setCurrentFlashcardIndex(prev => Math.min(flashcards.length - 1, prev + 1))}
            disabled={currentFlashcardIndex === flashcards.length - 1}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Memory game component
  const renderMemoryGame = () => {
    const isComplete = memoryMatches === 6;
    
    return (
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex gap-2 sm:gap-4">
            <span className="bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm">
              Moves: {memoryMoves}
            </span>
            <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm">
              {memoryMatches}/6
            </span>
          </div>
          <button
            onClick={initMemoryGame}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
          >
            <RotateCcw size={14} />
            New
          </button>
        </div>
        
        {isComplete ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8 sm:py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl"
          >
            <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
            <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">Great Job!</h3>
            <p className="text-green-600 text-sm sm:text-base">Completed in {memoryMoves} moves!</p>
            <button
              onClick={initMemoryGame}
              className="mt-4 sm:mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
            >
              Play Again
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
            {memoryCards.map((card) => {
              const isFlipped = flippedCards.includes(card.id) || card.isMatched;
              
              return (
                <motion.div
                  key={card.id}
                  onClick={() => handleMemoryCardClick(card.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    aspect-square rounded-xl cursor-pointer flex items-center justify-center text-center p-1 sm:p-2
                    ${card.isMatched 
                      ? 'bg-green-100 border-2 border-green-400' 
                      : isFlipped 
                        ? 'bg-indigo-100 border-2 border-indigo-400'
                        : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-300'}
                  `}
                >
                  {isFlipped ? (
                    <div>
                      {card.type === 'symbol' ? (
                        <div className="text-xl sm:text-2xl font-black text-indigo-600">{card.element.symbol}</div>
                      ) : (
                        <div className="text-[10px] sm:text-sm font-semibold text-indigo-600">{card.element.name}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl sm:text-3xl text-gray-400">?</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (!currentQuestion && mode === 'quiz') return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Mode Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex gap-1 sm:gap-2 justify-center">
          {[
            { key: 'quiz' as Mode, label: 'Quiz', icon: Target },
            { key: 'flashcards' as Mode, label: 'Cards', icon: BookOpen },
            { key: 'memory' as Mode, label: 'Memory', icon: Shuffle },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`
                  flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm
                  ${mode === m.key 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                <Icon size={16} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center gap-2 mb-4 sm:mb-6">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`
              px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors
              ${difficulty === d 
                ? d === 'easy' ? 'bg-green-100 text-green-700 ring-2 ring-green-300' 
                : d === 'medium' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300'
                : 'bg-red-100 text-red-700 ring-2 ring-red-300'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
            `}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Mode Content */}
      {mode === 'flashcards' && renderFlashcards()}
      {mode === 'memory' && renderMemoryGame()}
      
      {mode === 'quiz' && currentQuestion && (
        <>
          {/* Stats Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.correct}</div>
                <div className="text-[10px] sm:text-xs text-gray-400">Correct</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-red-500">{stats.wrong}</div>
                <div className="text-[10px] sm:text-xs text-gray-400">Wrong</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-indigo-600 flex items-center justify-center gap-1">
                  <Zap size={14} className="sm:w-4 sm:h-4" /> {stats.streak}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">Streak</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-amber-500 flex items-center justify-center gap-1">
                  <Trophy size={14} className="sm:w-4 sm:h-4" /> {stats.bestStreak}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">Best</div>
              </div>
            </div>
          </div>

          {/* Quiz Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
              <div className="flex items-center gap-2">
                <Target size={20} />
                <h2 className="text-lg sm:text-xl font-bold">Element Quiz</h2>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8">
              {/* Question */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-500 font-medium mb-3 sm:mb-4 text-sm">
                  <Lightbulb size={14} />
                  <span>{getQuestionText()}</span>
                </div>
                
                <motion.div 
                  key={currentQuestion.number + questionType}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex justify-center items-center min-h-[80px] sm:min-h-[100px]"
                >
                  {getQuestionContent()}
                </motion.div>

                {/* Hint */}
                <AnimatePresence>
                  {showHint && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-amber-50 text-amber-800 p-3 sm:p-4 rounded-lg text-xs sm:text-sm mt-4 max-w-sm mx-auto"
                    >
                      <div className="flex items-start gap-2">
                        <HelpCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                          <p><strong>Period:</strong> {currentQuestion.period} | <strong>Group:</strong> {currentQuestion.group}</p>
                          <p><strong>Mass:</strong> {currentQuestion.atomic_mass.toFixed(2)} u</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showHint && selectedOption === null && (
                  <button 
                    onClick={() => setShowHint(true)}
                    className="mt-4 text-xs sm:text-sm text-indigo-500 hover:text-indigo-700 flex items-center gap-1 mx-auto"
                  >
                    <HelpCircle size={14} />
                    Need a hint?
                  </button>
                )}
              </div>
              
              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {options.map((option) => {
                  let buttonClass = "p-3 sm:p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ";
                  
                  if (selectedOption === null) {
                    buttonClass += "border-gray-100 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer active:bg-indigo-100";
                  } else {
                    if (option.number === currentQuestion.number) {
                      buttonClass += "border-green-500 bg-green-50";
                    } else if (option.number === selectedOption) {
                      buttonClass += "border-red-500 bg-red-50";
                    } else {
                      buttonClass += "border-gray-100 opacity-40";
                    }
                  }

                  return (
                    <button
                      key={option.number}
                      disabled={selectedOption !== null}
                      onClick={() => handleOptionClick(option)}
                      className={buttonClass}
                    >
                      <div>
                        <span className="font-bold text-sm sm:text-lg">{getOptionLabel(option)}</span>
                        <span className="block text-[10px] sm:text-xs text-gray-400 capitalize truncate">
                          {option.category}
                        </span>
                      </div>
                      {selectedOption !== null && option.number === currentQuestion.number && (
                        <Check className="text-green-600 flex-shrink-0" size={20} />
                      )}
                      {selectedOption !== null && option.number === selectedOption && option.number !== currentQuestion.number && (
                        <X className="text-red-600 flex-shrink-0" size={20} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result & Next */}
              <AnimatePresence>
                {selectedOption !== null && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 sm:mt-8"
                  >
                    {/* Show correct answer details */}
                    <div className={`p-3 sm:p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50' : 'bg-blue-50'}`}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <BohrModel element={currentQuestion} size={60} showLabels={false} />
                        <div className="min-w-0">
                          <div className="font-bold text-sm sm:text-lg">{currentQuestion.name} ({currentQuestion.symbol})</div>
                          <div className="text-xs sm:text-sm text-gray-600">Atomic Number: {currentQuestion.number}</div>
                          {currentQuestion.ionCharge && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {currentQuestion.ionCharge.slice(0, 3).map((charge, i) => (
                                <span key={i} className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded ${getIonChargeColor(charge)}`}>
                                  {currentQuestion.symbol}<sup>{charge !== '0' ? charge : ''}</sup>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={generateQuestion}
                      className={`
                        w-full flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl font-bold text-white text-base sm:text-lg
                        ${isCorrect ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'}
                      `}
                    >
                      {isCorrect ? 'Correct! ' : 'Next '}
                      <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
