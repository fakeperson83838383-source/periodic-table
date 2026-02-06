import { useState, useMemo } from 'react';
import { elements, Element, getStateAtTemperature } from '@/data/elements';
import { ElementCard } from './ElementCard';
import { ElementModal } from './ElementModal';
import { FilterBar } from './FilterBar';
import { ComparePanel } from './ComparePanel';
import { Search, Thermometer, ArrowLeftRight, Snowflake, Flame, BookOpen, Info, X } from 'lucide-react';

export const PeriodicTable: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<'solid' | 'liquid' | 'gas' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [temperature, setTemperature] = useState<number>(298);
  const [showTemperature, setShowTemperature] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareElements, setCompareElements] = useState<Element[]>([]);
  const [showIons, setShowIons] = useState(false);
  const [highlightTrend, setHighlightTrend] = useState<'electronegativity' | 'atomicRadius' | 'ionizationEnergy' | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCompare = (element: Element) => {
    setCompareElements(prev => {
      const exists = prev.find(e => e.number === element.number);
      if (exists) {
        return prev.filter(e => e.number !== element.number);
      }
      if (prev.length >= 4) return prev; // Max 4 elements
      return [...prev, element];
    });
  };

  const isElementFiltered = useMemo(() => {
    return (element: Element) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.number.toString() === searchTerm;

      // Category filter
      const matchesCategory = selectedCategory === null || element.category === selectedCategory;
      
      // State filter (at 298K for filtering, but display can use custom temp)
      const stateAt298K = getStateAtTemperature(element, 298);
      const matchesState = selectedState === null || stateAt298K === selectedState;

      return matchesSearch && matchesCategory && matchesState;
    };
  }, [searchTerm, selectedCategory, selectedState]);

  // Quick stats
  const stats = useMemo(() => {
    const filtered = elements.filter(isElementFiltered);
    return {
      total: filtered.length,
      solids: filtered.filter(e => getStateAtTemperature(e, 298) === 'solid').length,
      liquids: filtered.filter(e => getStateAtTemperature(e, 298) === 'liquid').length,
      gases: filtered.filter(e => getStateAtTemperature(e, 298) === 'gas').length,
    };
  }, [isElementFiltered]);

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
          Periodic Table of Elements
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Tap any element to learn more. Use filters to explore!
        </p>
      </div>

      {/* Quick Stats - Mobile optimized */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-100 shadow-sm text-center">
          <div className="text-lg sm:text-2xl font-bold text-indigo-600">{stats.total}</div>
          <div className="text-[9px] sm:text-xs text-gray-500 uppercase">Shown</div>
        </div>
        <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-100 shadow-sm text-center">
          <div className="text-lg sm:text-2xl font-bold text-slate-700">{stats.solids}</div>
          <div className="text-[9px] sm:text-xs text-gray-500 uppercase">Solid</div>
        </div>
        <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-100 shadow-sm text-center">
          <div className="text-lg sm:text-2xl font-bold text-blue-500">{stats.liquids}</div>
          <div className="text-[9px] sm:text-xs text-gray-500 uppercase">Liquid</div>
        </div>
        <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-100 shadow-sm text-center">
          <div className="text-lg sm:text-2xl font-bold text-orange-400">{stats.gases}</div>
          <div className="text-[9px] sm:text-xs text-gray-500 uppercase">Gas</div>
        </div>
      </div>

      {/* Search Bar - Always visible */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name, symbol, or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Mobile Tool Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Info size={14} />
          <span>Filters</span>
        </button>
        
        <button
          onClick={() => setShowTemperature(!showTemperature)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            showTemperature ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Thermometer size={14} />
          <span className="hidden sm:inline">Temperature</span>
          <span className="sm:hidden">Temp</span>
        </button>
        
        <button
          onClick={() => {
            setCompareMode(!compareMode);
            if (compareMode) setCompareElements([]);
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            compareMode ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <ArrowLeftRight size={14} />
          <span>Compare</span>
          {compareElements.length > 0 && (
            <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {compareElements.length}
            </span>
          )}
        </button>
        
        <button
          onClick={() => setShowIons(!showIons)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            showIons ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <span className="font-bold text-sm">±</span>
          <span>Ions</span>
        </button>
      </div>

      {/* Temperature Slider */}
      {showTemperature && (
        <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-3 sm:p-4 mb-4 border border-gray-200">
          <div className="flex items-center gap-2 sm:gap-4">
            <Snowflake size={18} className="text-blue-400 flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="6000"
              step="10"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gradient-to-r from-blue-200 via-green-200 to-orange-200 rounded-lg appearance-none cursor-pointer"
            />
            <Flame size={18} className="text-orange-400 flex-shrink-0" />
          </div>
          <div className="flex justify-between items-center mt-2 sm:mt-3 flex-wrap gap-2">
            <span className="bg-white px-2 sm:px-3 py-1 rounded-lg font-mono text-xs sm:text-sm shadow-sm">
              {temperature} K
            </span>
            <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span> Solid
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Liquid
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span> Gas
              </span>
            </div>
            <span className="text-gray-400 text-[10px] sm:text-sm">
              {(temperature - 273.15).toFixed(0)}°C
            </span>
          </div>
        </div>
      )}

      {/* Filter Bar - Collapsible on mobile */}
      {showFilters && (
        <div className="mb-4">
          <FilterBar 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory}
            selectedState={selectedState}
            onSelectState={setSelectedState}
            showIons={showIons}
            onToggleIons={() => setShowIons(!showIons)}
            highlightTrend={highlightTrend}
            onSelectTrend={setHighlightTrend}
          />
        </div>
      )}

      {/* Compare Mode Instructions */}
      {compareMode && compareElements.length === 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 mb-4 text-center">
          <p className="text-indigo-700 font-medium text-xs sm:text-sm">
            Tap the + button on elements to compare (max 4)
          </p>
        </div>
      )}

      {/* Learning Tip */}
      {highlightTrend && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <BookOpen size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1 text-sm">
                {highlightTrend === 'electronegativity' && 'Electronegativity Trend'}
                {highlightTrend === 'atomicRadius' && 'Atomic Radius Trend'}
                {highlightTrend === 'ionizationEnergy' && 'Ionization Energy Trend'}
              </h4>
              <p className="text-xs sm:text-sm text-blue-700">
                {highlightTrend === 'electronegativity' && 
                  'Increases left→right across periods, decreases down groups. F is highest (3.98).'}
                {highlightTrend === 'atomicRadius' && 
                  'Decreases left→right (more protons), increases down groups (more shells).'}
                {highlightTrend === 'ionizationEnergy' && 
                  'Increases left→right (electrons held tighter), decreases down groups.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Periodic Table Grid */}
      <div className="overflow-x-auto py-2 sm:py-4 -mx-2 px-2">
        <div 
          className="grid gap-0.5 sm:gap-1"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(32px, 1fr))',
            gridTemplateRows: 'repeat(10, minmax(44px, 1fr))',
            minWidth: '620px'
          }}
        >
          {elements.map((element) => (
            <ElementCard
              key={element.number}
              element={element}
              onClick={setSelectedElement}
              isFiltered={isElementFiltered(element)}
              temperature={showTemperature ? temperature : undefined}
              compareMode={compareMode}
              isComparing={compareElements.some(e => e.number === element.number)}
              onToggleCompare={toggleCompare}
              showIons={showIons}
              highlightTrend={highlightTrend}
            />
          ))}
        </div>
      </div>

      {/* Legend - Scrollable on mobile */}
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex gap-2 sm:gap-4 justify-start sm:justify-center text-[10px] sm:text-xs min-w-max">
          <span className="text-gray-500 font-medium">Legend:</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-100 border border-red-300"></span>
            <span>Alkali</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-orange-100 border border-orange-300"></span>
            <span>Alk. Earth</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-yellow-100 border border-yellow-300"></span>
            <span>Transition</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-cyan-100 border border-cyan-300"></span>
            <span>Nonmetal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-violet-100 border border-violet-300"></span>
            <span>Noble Gas</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-pink-100 border border-pink-300"></span>
            <span>Lanthanide</span>
          </div>
        </div>
      </div>

      {/* Helpful tip for mobile */}
      <div className="mt-4 text-center text-xs text-gray-400 sm:hidden">
        💡 Rotate your phone for a better view
      </div>

      {/* Element Modal */}
      <ElementModal 
        element={selectedElement} 
        onClose={() => setSelectedElement(null)} 
      />

      {/* Compare Panel */}
      {compareMode && (
        <ComparePanel 
          elements={compareElements}
          onRemove={(el) => setCompareElements(prev => prev.filter(e => e.number !== el.number))}
          onClear={() => setCompareElements([])}
        />
      )}

      {/* Spacer for compare panel */}
      {compareMode && compareElements.length > 0 && <div className="h-64 sm:h-80" />}
    </div>
  );
};
