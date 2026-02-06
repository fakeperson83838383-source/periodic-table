import { categories, categoryColors } from '@/data/elements';
import { RotateCcw, Snowflake, Droplets, Cloud, Zap, Circle, Activity } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  selectedState: 'solid' | 'liquid' | 'gas' | null;
  onSelectState: (state: 'solid' | 'liquid' | 'gas' | null) => void;
  showIons: boolean;
  onToggleIons: () => void;
  highlightTrend: 'electronegativity' | 'atomicRadius' | 'ionizationEnergy' | null;
  onSelectTrend: (trend: 'electronegativity' | 'atomicRadius' | 'ionizationEnergy' | null) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  selectedState,
  onSelectState,
  showIons,
  onToggleIons,
  highlightTrend,
  onSelectTrend
}) => {
  const hasActiveFilter = selectedCategory !== null || selectedState !== null || highlightTrend !== null;

  const resetAll = () => {
    onSelectCategory(null);
    onSelectState(null);
    onSelectTrend(null);
  };

  const trends = [
    { key: 'electronegativity' as const, label: 'Electronegativity', shortLabel: 'Electroneg.', icon: Zap, colors: 'from-yellow-200 to-red-400' },
    { key: 'atomicRadius' as const, label: 'Atomic Radius', shortLabel: 'Radius', icon: Circle, colors: 'from-blue-200 to-blue-600' },
    { key: 'ionizationEnergy' as const, label: 'Ionization Energy', shortLabel: 'Ionization', icon: Activity, colors: 'from-green-200 to-green-600' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-gray-600">Filter Options</span>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Show Ions Toggle */}
          <button 
            onClick={onToggleIons}
            className={`
              text-[10px] sm:text-xs flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium transition-colors
              ${showIons 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
            `}
          >
            <span className="font-bold">±</span>
            <span className="hidden sm:inline">Show</span> Ions
          </button>
          
          {hasActiveFilter && (
            <button 
              onClick={resetAll}
              className="text-[10px] sm:text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <RotateCcw size={10} className="sm:w-3 sm:h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* State of Matter Filter */}
      <div>
        <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2">
          State of Matter
        </div>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => onSelectState(selectedState === 'solid' ? null : 'solid')}
            className={`
              flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all
              ${selectedState === 'solid' 
                ? 'bg-slate-700 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            <Snowflake size={10} className="sm:w-3 sm:h-3" />
            Solid
          </button>
          <button
            onClick={() => onSelectState(selectedState === 'liquid' ? null : 'liquid')}
            className={`
              flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all
              ${selectedState === 'liquid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            <Droplets size={10} className="sm:w-3 sm:h-3" />
            Liquid
          </button>
          <button
            onClick={() => onSelectState(selectedState === 'gas' ? null : 'gas')}
            className={`
              flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all
              ${selectedState === 'gas' 
                ? 'bg-orange-400 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            <Cloud size={10} className="sm:w-3 sm:h-3" />
            Gas
          </button>
        </div>
      </div>

      {/* Periodic Trends */}
      <div>
        <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2">
          Periodic Trends
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {trends.map((trend) => {
            const Icon = trend.icon;
            const isSelected = highlightTrend === trend.key;
            
            return (
              <button
                key={trend.key}
                onClick={() => onSelectTrend(isSelected ? null : trend.key)}
                className={`
                  flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all
                  ${isSelected 
                    ? `bg-gradient-to-r ${trend.colors} text-white shadow-sm` 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                <Icon size={10} className="sm:w-3 sm:h-3" />
                <span className="sm:hidden">{trend.shortLabel}</span>
                <span className="hidden sm:inline">{trend.label}</span>
              </button>
            );
          })}
        </div>
        {highlightTrend && (
          <div className="mt-2 text-[10px] sm:text-xs text-gray-500 flex items-center gap-2">
            <span>Low</span>
            <div className={`h-1.5 sm:h-2 w-16 sm:w-24 rounded bg-gradient-to-r ${
              highlightTrend === 'electronegativity' ? 'from-yellow-200 to-red-400' :
              highlightTrend === 'atomicRadius' ? 'from-blue-200 to-blue-600' :
              'from-green-200 to-green-600'
            }`}></div>
            <span>High</span>
          </div>
        )}
      </div>
      
      {/* Category Filter */}
      <div>
        <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 sm:mb-2">
          Element Category
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {categories.map((category) => {
            const colorClass = categoryColors[category];
            const isSelected = selectedCategory === category;
            // Shorten category names for mobile
            const shortName = category
              .replace('alkaline earth metal', 'Alk. Earth')
              .replace('alkali metal', 'Alkali')
              .replace('transition metal', 'Transition')
              .replace('post-transition metal', 'Post-Trans.')
              .replace('diatomic nonmetal', 'Diatomic')
              .replace('polyatomic nonmetal', 'Polyatomic')
              .replace('noble gas', 'Noble Gas')
              .replace('lanthanide', 'Lanthanide')
              .replace('actinide', 'Actinide')
              .replace('metalloid', 'Metalloid')
              .replace('unknown', 'Unknown');
            
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(isSelected ? null : category)}
                className={`
                  px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium transition-all capitalize
                  ${isSelected 
                    ? `${colorClass} ring-1 sm:ring-2 ring-offset-1 ring-gray-300` 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <span className="sm:hidden">{shortName}</span>
                <span className="hidden sm:inline">{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
