import { useState } from 'react';
import { PeriodicTable } from '@/components/PeriodicTable';
import { Quiz } from '@/components/Quiz';
import { Atom, GraduationCap, Github, BookOpen, Beaker } from 'lucide-react';

export function App() {
  const [view, setView] = useState<'table' | 'learn'>('table');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <Atom className="text-white" size={18} />
              </div>
              <div>
                <span className="text-base sm:text-xl font-bold text-gray-900">ElementWise</span>
                <span className="hidden md:inline text-xs text-gray-400 ml-2">Interactive Periodic Table</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setView('table')}
                className={`
                  flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm font-medium
                  ${view === 'table' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <Beaker size={16} />
                <span className="hidden xs:inline sm:inline">Table</span>
              </button>
              <button
                onClick={() => setView('learn')}
                className={`
                  flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm font-medium
                  ${view === 'learn' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <GraduationCap size={16} />
                <span className="hidden xs:inline sm:inline">Learn</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-8 sm:pb-16">
        {view === 'table' ? <PeriodicTable /> : <Quiz />}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Atom size={16} className="text-indigo-600" />
                About ElementWise
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                An interactive periodic table designed to help students learn chemistry effectively. 
                Explore all 118 elements with detailed information and ion charges.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <BookOpen size={16} className="text-indigo-600" />
                Features
              </h3>
              <ul className="text-xs sm:text-sm text-gray-500 space-y-1">
                <li>• Ion charges (+/-) for all elements</li>
                <li>• Periodic trends visualization</li>
                <li>• Temperature-based state view</li>
                <li>• Element comparison mode</li>
                <li>• Quiz, flashcards & memory game</li>
              </ul>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <GraduationCap size={16} className="text-indigo-600" />
                For Students
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Perfect for chemistry students at all levels. Learn element properties 
                and test your knowledge with interactive quizzes.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              Interactive Periodic Table • Made with ⚛️ for Learning
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg"
            >
              <Github size={14} />
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
