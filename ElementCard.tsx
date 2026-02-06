import { motion } from 'framer-motion';
import { Element, categoryColors, getStateAtTemperature, getIonChargeColor } from '@/data/elements';
import { Plus, Check } from 'lucide-react';

interface ElementCardProps {
  element: Element;
  onClick: (element: Element) => void;
  isFiltered: boolean;
  temperature?: number;
  isComparing?: boolean;
  onToggleCompare?: (element: Element) => void;
  compareMode?: boolean;
  showIons?: boolean;
  highlightTrend?: 'electronegativity' | 'atomicRadius' | 'ionizationEnergy' | null;
}

export const ElementCard: React.FC<ElementCardProps> = ({ 
  element, 
  onClick, 
  isFiltered, 
  temperature,
  isComparing,
  onToggleCompare,
  compareMode,
  showIons = false,
  highlightTrend
}) => {
  const colorClass = categoryColors[element.category] || categoryColors['unknown'];
  
  const state = temperature !== undefined ? getStateAtTemperature(element, temperature) : null;
  
  // Get trend-based background color
  const getTrendStyle = () => {
    if (!highlightTrend || !isFiltered) return {};
    
    let value: number | undefined;
    let maxValue: number;
    let colorStart: string, colorEnd: string;
    
    switch (highlightTrend) {
      case 'electronegativity':
        value = element.electronegativity;
        maxValue = 4;
        colorStart = 'rgba(254, 240, 138, 0.8)'; // yellow
        colorEnd = 'rgba(239, 68, 68, 0.8)'; // red
        break;
      case 'atomicRadius':
        value = element.atomicRadius;
        maxValue = 350;
        colorStart = 'rgba(191, 219, 254, 0.8)'; // blue light
        colorEnd = 'rgba(30, 64, 175, 0.8)'; // blue dark
        break;
      case 'ionizationEnergy':
        value = element.ionizationEnergy;
        maxValue = 2500;
        colorStart = 'rgba(187, 247, 208, 0.8)'; // green light
        colorEnd = 'rgba(22, 163, 74, 0.8)'; // green dark
        break;
      default:
        return {};
    }
    
    if (value === undefined) return { opacity: 0.3 };
    
    const ratio = Math.min(value / maxValue, 1);
    return {
      background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
      opacity: 0.3 + ratio * 0.7
    };
  };

  const stateIndicator = state && state !== 'unknown' && (
    <span className={`
      w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/50 flex-shrink-0
      ${state === 'solid' ? 'bg-slate-700' : 
        state === 'liquid' ? 'bg-blue-500' : 
        'bg-orange-400'}
    `} title={state} />
  );

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare?.(element);
  };

  const primaryIon = element.ionCharge?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isFiltered ? 1 : 0.15, 
        scale: isFiltered ? 1 : 0.95,
      }}
      whileHover={isFiltered ? { scale: 1.15, zIndex: 50 } : {}}
      whileTap={isFiltered ? { scale: 0.95 } : {}}
      transition={{ duration: 0.15 }}
      onClick={() => isFiltered && onClick(element)}
      className={`
        relative flex flex-col items-center justify-between p-0.5 sm:p-1 
        border sm:border-2 cursor-pointer select-none rounded sm:rounded-md shadow-sm
        transition-shadow hover:shadow-lg active:shadow-md
        ${highlightTrend ? '' : colorClass}
        ${isComparing ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
      `}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
        minHeight: '44px',
        ...(highlightTrend ? getTrendStyle() : {})
      }}
    >
      {/* Compare button */}
      {compareMode && isFiltered && (
        <button
          onClick={handleCompareClick}
          className={`
            absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full 
            flex items-center justify-center text-white text-xs z-10
            ${isComparing ? 'bg-indigo-500' : 'bg-gray-400 hover:bg-indigo-500'}
          `}
        >
          {isComparing ? <Check size={8} className="sm:w-2.5 sm:h-2.5" /> : <Plus size={8} className="sm:w-2.5 sm:h-2.5" />}
        </button>
      )}
      
      {/* Ion charge badge */}
      {showIons && primaryIon && primaryIon !== '0' && (
        <span className={`
          absolute -top-0.5 -left-0.5 sm:-top-1 sm:-left-1 text-[6px] sm:text-[8px] font-bold px-0.5 sm:px-1 rounded
          ${getIonChargeColor(primaryIon)}
        `}>
          {primaryIon}
        </span>
      )}
      
      <div className="w-full flex justify-between items-center text-[6px] sm:text-[8px] leading-none font-medium opacity-70 px-0.5">
        <span>{element.number}</span>
        {stateIndicator}
      </div>
      <div className="text-sm sm:text-base md:text-lg font-bold leading-none">{element.symbol}</div>
      <div className="text-[5px] sm:text-[6px] md:text-[7px] leading-none truncate w-full text-center opacity-75 px-0.5">
        {element.name}
      </div>
    </motion.div>
  );
};
