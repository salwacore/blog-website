import React from 'react';
import { PenSquare, Feather, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

interface ManifestoViewProps {
  onStartWriting: () => void;
  onBackToStories: () => void;
}

export const ManifestoView: React.FC<ManifestoViewProps> = ({
  onStartWriting,
  onBackToStories,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest font-sans text-stone-500 font-semibold mb-3 block">
          Editorial Manifesto · Vol. I
        </span>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-stone-900 mb-6 leading-[1.15]"
          style={{ textWrap: 'balance' }}
        >
          A Sanctuary for Enduring Thoughts
        </h1>
        <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed">
          Folio was founded upon a straightforward proposition: that long-form prose, deliberate contemplation, and typographic beauty deserve an uncorrupted digital home.
        </p>
      </div>

      {/* 3 Core Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 bg-white rounded-xl border border-stone-200 shadow-xs">
          <Feather className="w-6 h-6 text-stone-800 mb-4" />
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
            01. Tactile Slowness
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            We reject the frantic compulsion to publish hot takes within minutes. We champion the multi-week essay, the tested hypothesis, and prose seasoned by reflection.
          </p>
        </div>

        <div className="p-8 bg-white rounded-xl border border-stone-200 shadow-xs">
          <BookOpen className="w-6 h-6 text-stone-800 mb-4" />
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
            02. Zero Algorithmic Rage
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            No dopamine feeds, no manufactured controversy counters, and no clickbait rewards. Articles are discovered through curatorial judgment and intellectual resonance.
          </p>
        </div>

        <div className="p-8 bg-white rounded-xl border border-stone-200 shadow-xs">
          <ShieldCheck className="w-6 h-6 text-stone-800 mb-4" />
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
            03. The Reader’s Peace
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            Distraction-free reading canvas with bespoke typography, audio narration, and ambient illumination modes designed to preserve cognitive clarity.
          </p>
        </div>
      </div>

      {/* Long-form editorial letter */}
      <div className="p-8 sm:p-12 bg-white rounded-2xl border border-stone-200 shadow-xs mb-16 font-serif text-stone-800 leading-relaxed text-base sm:text-lg space-y-6">
        <p className="drop-cap">
          When Johannes Gutenberg set movable metal types along his wooden press in Mainz, he did not just invent mass reproduction; he bestowed physical gravity upon human thought. An author had to deliberate every sentence, knowing molten metal would carry their voice across centuries.
        </p>
        <p>
          Over the past twenty years, the internet replaced this gravity with infinite velocity. Articles shrunk into fragments; paragraphs dissolved into tweets; headlines transformed into clickbait traps engineered to harvest attention for programmatic ad auctions.
        </p>
        <p>
          Folio is an antidote. Here, writers write without pop-up paywalls or spam ads. Readers read without notification banners flashing in their eyes. We celebrate craftsmanship, architecture, essays, philosophy, and future systems.
        </p>
        <div className="pt-6 border-t border-stone-200 flex items-center justify-between font-sans text-xs text-stone-500">
          <span>Published from the Editorial Desk</span>
          <span className="font-serif italic font-medium text-stone-700">The Editors of Folio</span>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartWriting}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write Your First Essay</span>
          </button>
          <button
            onClick={onBackToStories}
            className="px-6 py-3 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Explore Stories
          </button>
        </div>
      </div>
    </div>
  );
};
