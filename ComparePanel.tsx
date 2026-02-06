import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight } from 'lucide-react';
import { Element, categoryColors, getIonChargeColor } from '@/data/elements';
import { BohrModel } from './BohrModel';

interface ComparePanelProps {
  elements: Element[];
  onRemove: (element: Element) => void;
  onClear: () => void;
}

export const ComparePanel: React.FC<ComparePanelProps> = ({ elements, onRemove, onClear }) => {
  if (elements.length === 0) return null;

  const properties = [
    { key: 'atomic_mass', label: 'Mass', unit: 'u', format: (v: number) => v.toFixed(2) },
    { key: 'electronegativity', label: 'Electroneg.', unit: '', format: (v: number | undefined) => v?.toFixed(2) ?? 'N/A' },
    { key: 'atomicRadius', label: 'Radius', unit: 'pm', format: (v: number | undefined) => v?.toString() ?? 'N/A' },
    { key: 'melt', label: 'Melt', unit: 'K', format: (v: number | undefined) => v?.toFixed(0) ?? 'N/A' },
    { key: 'boil', label: 'Boil', unit: 'K', format: (v: number | undefined) => v?.toFixed(0) ?? 'N/A' },
    { key: 'period', label: 'Period', unit: '', format: (v: number) => v.toString() },
    { key: 'group', label: 'Group', unit: '', format: (v: number) => v.toString() },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-indigo-500 shadow-2xl z-40 max-h-[55vh] sm:max-h-[60vh] overflow-auto"
      >
        <div className="max-w-7xl mx-auto p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 sticky top-0 bg-white py-1">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm sm:text-base">
              <ArrowLeftRight size={18} />
              <span>Comparing {elements.length}</span>
            </div>
            <button
              onClick={onClear}
              className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1"
            >
              Clear All
            </button>
          </div>

          {/* Comparison Grid - Horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 sm:px-3 text-gray-500 text-[10px] sm:text-xs font-medium w-20 sm:w-28">Property</th>
                  {elements.map((el) => {
                    const colorClass = categoryColors[el.category];
                    const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-gray-100';
                    return (
                      <th key={el.number} className="py-2 px-1 sm:px-3 text-center" style={{ minWidth: '90px' }}>
                        <div className={`${bgClass} rounded-lg p-1.5 sm:p-2 relative`}>
                          <button
                            onClick={() => onRemove(el)}
                            className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X size={10} />
                          </button>
                          <div className="text-lg sm:text-2xl font-bold">{el.symbol}</div>
                          <div className="text-[9px] sm:text-xs opacity-75 truncate">{el.name}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Bohr Model Row */}
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2 sm:px-3 text-gray-500 text-[10px] sm:text-xs font-medium">Structure</td>
                  {elements.map((el) => (
                    <td key={el.number} className="py-2 px-1 sm:px-3 text-center">
                      <div className="flex justify-center">
                        <BohrModel element={el} size={70} showLabels={false} />
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Ion Charges Row */}
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2 sm:px-3 text-gray-500 text-[10px] sm:text-xs font-medium">Ions</td>
                  {elements.map((el) => (
                    <td key={el.number} className="py-2 px-1 sm:px-3 text-center">
                      <div className="flex gap-0.5 justify-center flex-wrap">
                        {el.ionCharge?.slice(0, 2).map((charge, i) => (
                          <span 
                            key={i} 
                            className={`text-[9px] sm:text-xs font-bold px-1 py-0.5 rounded ${getIonChargeColor(charge)}`}
                          >
                            {el.symbol}<sup>{charge !== '0' ? charge : ''}</sup>
                          </span>
                        )) || <span className="text-gray-400 text-xs">N/A</span>}
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Shells Row */}
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2 sm:px-3 text-gray-500 text-[10px] sm:text-xs font-medium">Shells</td>
                  {elements.map((el) => (
                    <td key={el.number} className="py-2 px-1 sm:px-3 text-center">
                      <div className="flex gap-0.5 justify-center flex-wrap">
                        {el.shells.map((count, i) => (
                          <span key={i} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 text-blue-700 text-[9px] sm:text-xs font-bold flex items-center justify-center">
                            {count}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Property Rows */}
                {properties.map((prop) => (
                  <tr key={prop.key} className="border-b border-gray-100">
                    <td className="py-2 px-2 sm:px-3 text-gray-500 text-[10px] sm:text-xs font-medium">{prop.label}</td>
                    {elements.map((el) => {
                      const value = el[prop.key as keyof Element];
                      return (
                        <td key={el.number} className="py-2 px-1 sm:px-3 text-center font-semibold text-gray-800 text-xs sm:text-sm">
                          {prop.format(value as number)}
                          {prop.unit && <span className="text-gray-400 text-[9px] ml-0.5">{prop.unit}</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Category Row */}
                <tr>
                  <td className="py-2 px-2 sm:px-3 text-gray-500 text-[10px] sm:text-xs font-medium">Category</td>
                  {elements.map((el) => (
                    <td key={el.number} className="py-2 px-1 sm:px-3 text-center">
                      <span className="text-[9px] sm:text-xs capitalize bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {el.category.split(' ')[0]}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
