import { motion, AnimatePresence } from 'framer-motion';
import { X, Atom, Scale, Layers, Grid3X3, Thermometer, Wind, Zap, CircleDot, Lightbulb, User, Calendar, ExternalLink, Info, Beaker, Sparkles } from 'lucide-react';
import { Element, categoryColors, getIonChargeColor } from '@/data/elements';
import { BohrModel } from './BohrModel';

interface ElementModalProps {
  element: Element | null;
  onClose: () => void;
}

// Element introductions for learning
const getElementIntro = (element: Element): string => {
  const introductions: Record<number, string> = {
    1: "Welcome to Hydrogen - the simplest and most abundant element in the universe! It powers the Sun and stars through nuclear fusion.",
    2: "Meet Helium - the party balloon gas! It's so light it escapes Earth's gravity and floats into space.",
    3: "Say hello to Lithium - the lightest metal! It powers your phone, laptop, and electric cars.",
    4: "Beryllium is a rare, toxic metal that's incredibly strong and light - used in spacecraft and X-ray machines.",
    5: "Boron is a metalloid superstar used in everything from detergents to bulletproof vests!",
    6: "Carbon is the building block of life! Every living thing contains carbon, from you to the trees.",
    7: "Nitrogen makes up 78% of the air you breathe, but you can't use it directly - only certain bacteria can!",
    8: "Oxygen keeps you alive with every breath! It's the third most abundant element in the universe.",
    9: "Fluorine is the most reactive element - it will react with almost anything, even glass!",
    10: "Neon lights up the night in colorful signs. This noble gas is completely unreactive.",
    11: "Sodium explodes in water! Combined with chlorine (a toxic gas), it makes table salt.",
    12: "Magnesium burns with a brilliant white flame - so bright it was used in old camera flashes!",
    13: "Aluminum was once more valuable than gold! Now it's in cans, foil, and airplanes everywhere.",
    14: "Silicon powers the digital age! Computer chips and solar panels depend on this metalloid.",
    15: "Phosphorus glows in the dark! It's essential for life - found in DNA and your bones.",
    16: "Sulfur has been known since ancient times as 'brimstone.' It gives matches their smell.",
    17: "Chlorine keeps your swimming pool clean and your drinking water safe from bacteria.",
    18: "Argon is all around you - it makes up about 1% of the air you breathe right now!",
    19: "Potassium makes bananas healthy! Your body needs it for muscles and nerves to work.",
    20: "Calcium builds your bones and teeth! You have about 1 kg of calcium in your body.",
    26: "Iron is in your blood right now, carrying oxygen to every cell! It also forms Earth's core.",
    29: "Copper was the first metal used by humans! It conducts electricity in your home's wires.",
    47: "Silver is the best conductor of electricity! It's been used as money for thousands of years.",
    79: "Gold never rusts or tarnishes - that's why it's been treasured for 6,000 years!",
    80: "Mercury is the only metal that's liquid at room temperature! Ancient alchemists were fascinated by it.",
  };
  
  return introductions[element.number] || 
    `Discover ${element.name} (${element.symbol}) - element number ${element.number} on the periodic table. It belongs to the ${element.category} group and has ${element.shells.reduce((a, b) => a + b, 0)} electrons.`;
};

export const ElementModal: React.FC<ElementModalProps> = ({ element, onClose }) => {
  if (!element) return null;

  const colorClass = categoryColors[element.category] || categoryColors['unknown'];
  const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-gray-100';
  const borderClass = colorClass.split(' ').find(c => c.startsWith('border-')) || 'border-gray-400';

  return (
    <AnimatePresence>
      {element && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden my-2 sm:my-8"
          >
            {/* Header */}
            <div className={`${bgClass} p-4 sm:p-6`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className={`text-center bg-white/20 rounded-xl p-2 sm:p-3 ${borderClass} border-2`}>
                    <div className="text-4xl sm:text-6xl font-black">{element.symbol}</div>
                    <div className="text-xs sm:text-sm font-medium opacity-70">#{element.number}</div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold truncate">{element.name}</h2>
                    <p className="opacity-75 capitalize text-xs sm:text-sm">{element.category}</p>
                    
                    {/* Ion Charges */}
                    {element.ionCharge && element.ionCharge.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        <span className="text-xs opacity-60">Ions:</span>
                        {element.ionCharge.map((charge, i) => (
                          <span 
                            key={i} 
                            className={`text-xs font-bold px-1.5 py-0.5 rounded ${getIonChargeColor(charge)}`}
                          >
                            {element.symbol}<sup>{charge !== '0' ? charge : ''}</sup>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-black/10 transition-colors flex-shrink-0"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Introduction Section */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-800 mb-1 text-sm sm:text-base">Meet {element.name}!</h3>
                  <p className="text-indigo-700 text-sm leading-relaxed">{getElementIntro(element)}</p>
                </div>
              </div>
            </div>

            {/* Content - Responsive grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column - Atomic Structure */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Atom size={16} />
                  Atomic Structure (Bohr Model)
                </h3>
                
                {/* Bohr Model - Responsive size */}
                <div className="flex justify-center">
                  <BohrModel element={element} size={180} />
                </div>
                
                {/* Electron Shell Distribution */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Electron Shells</h4>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {element.shells.map((count, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm sm:text-base font-bold text-blue-700 border-2 border-blue-200">
                          {count}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-gray-400 mt-1">n={i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Total electrons: {element.shells.reduce((a, b) => a + b, 0)}
                  </p>
                </div>

                {/* Fun Fact */}
                {element.funFact && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-semibold text-amber-700 uppercase mb-1">Did You Know?</h4>
                        <p className="text-sm text-amber-800">{element.funFact}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Properties */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Properties
                </h3>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <Scale size={10} className="sm:w-3 sm:h-3" /> Atomic Mass
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{element.atomic_mass.toFixed(3)} u</div>
                  </div>
                  
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <Zap size={10} className="sm:w-3 sm:h-3" /> Electronegativity
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">
                      {element.electronegativity?.toFixed(2) ?? 'N/A'}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <Layers size={10} className="sm:w-3 sm:h-3" /> Period
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{element.period}</div>
                  </div>

                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <Grid3X3 size={10} className="sm:w-3 sm:h-3" /> Group
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{element.group}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <Thermometer size={10} className="sm:w-3 sm:h-3" /> Melting Pt.
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">
                      {element.melt ? `${element.melt.toFixed(0)} K` : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <Wind size={10} className="sm:w-3 sm:h-3" /> Boiling Pt.
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">
                      {element.boil ? `${element.boil.toFixed(0)} K` : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <CircleDot size={10} className="sm:w-3 sm:h-3" /> Atomic Radius
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">
                      {element.atomicRadius ? `${element.atomicRadius} pm` : 'N/A'}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-[10px] sm:text-xs uppercase font-semibold mb-1">
                      <Zap size={10} className="sm:w-3 sm:h-3" /> Ionization E.
                    </div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">
                      {element.ionizationEnergy ? `${element.ionizationEnergy}` : 'N/A'}
                      <span className="text-[10px] text-gray-400 ml-0.5">kJ/mol</span>
                    </div>
                  </div>
                </div>

                {/* Electron Configuration */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-semibold mb-1">
                    <Atom size={12} /> Electron Configuration
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-gray-800 break-all">{element.electron_configuration}</div>
                </div>

                {/* Discovery */}
                {(element.discoveredBy || element.yearDiscovered) && (
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <h4 className="text-xs font-semibold text-indigo-600 uppercase mb-2 flex items-center gap-1">
                      <Info size={12} /> Discovery
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                      {element.discoveredBy && (
                        <div className="flex items-center gap-1 text-indigo-700">
                          <User size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="truncate max-w-[150px]">{element.discoveredBy}</span>
                        </div>
                      )}
                      {element.yearDiscovered && (
                        <div className="flex items-center gap-1 text-indigo-700">
                          <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span>{element.yearDiscovered}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Common Uses */}
                {element.uses && element.uses.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="text-xs font-semibold text-green-600 uppercase mb-2 flex items-center gap-1">
                      <Beaker size={12} /> Common Uses
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {element.uses.map((use, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="px-4 sm:px-6 pb-3 sm:pb-4">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Summary</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{element.summary}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex justify-end">
              <a 
                href={`https://en.wikipedia.org/wiki/${element.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs sm:text-sm"
              >
                Learn more on Wikipedia
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
