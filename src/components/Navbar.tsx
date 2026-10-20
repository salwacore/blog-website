import React from 'react';
import { PenSquare, Bookmark } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'reader' | 'studio' | 'manifesto';
  onNavigate: (view: 'home' | 'reader' | 'studio' | 'manifesto') => void;
  onOpenReadingList: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenReadingList,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={() => onNavigate('home')}
          className="text-2xl font-serif font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <span>Folio</span>
          <span className="text-xs font-sans font-normal tracking-widest text-stone-400 uppercase hidden sm:inline">
            Journal
          </span>
        </button>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('home')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors ${
              currentView === 'home' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-400' : ''
            }`}
          >
            Stories
          </button>
          <button
            onClick={() => {
              onNavigate('home');
              const filterEl = document.getElementById('topics-section');
              if (filterEl) filterEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors"
          >
            Themes
          </button>
          <button
            onClick={onOpenReadingList}
            className="whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors flex items-center gap-1.5"
          >
            <span>Reading List</span>
            {savedCount > 0 && (
              <span className="text-xs font-mono font-medium text-stone-500 tabular-nums">
                ({savedCount})
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate('manifesto')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors ${
              currentView === 'manifesto' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-stone-400' : ''
            }`}
          >
            Manifesto
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Write Story</span>
          </button>
        </div>
      </div>
    </header>
  );
};
