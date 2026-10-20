import React, { useState, useEffect } from 'react';
import { Article, ReaderSettings, Comment } from '../types/blog';
import { narrationService } from '../utils/speech';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bookmark,
  Share2,
  Heart,
  Type,
  Sun,
  Moon,
  Coffee,
  Copy,
  Check,
  Send,
  SlidersHorizontal,
  X,
  Printer
} from 'lucide-react';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
  onClap: (articleId: string) => void;
  onAddComment: (articleId: string, comment: Comment) => void;
  onOpenAuthor: (author: Article['author']) => void;
  onOpenShare: (article: Article) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  article,
  onBack,
  onToggleBookmark,
  isBookmarked,
  onClap,
  onAddComment,
  onOpenAuthor,
  onOpenShare,
  onShowToast,
}) => {
  // Reader display settings
  const [settings, setSettings] = useState<ReaderSettings>({
    theme: 'alabaster',
    font: 'serif',
    fontSize: 'base',
    columnWidth: 'prose',
  });
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio Narration State
  const [narrationState, setNarrationState] = useState({
    isPlaying: false,
    isPaused: false,
    progress: 0,
  });
  const [narrationSpeed, setNarrationSpeed] = useState(1.0);
  const [showAudioBar, setShowAudioBar] = useState(false);

  // Claps local burst animation
  const [userClapCount, setUserClapCount] = useState(0);
  const [clapBubble, setClapBubble] = useState<number | null>(null);

  // Comments state
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Register narration callback
  useEffect(() => {
    narrationService.registerCallback((state) => {
      setNarrationState(state);
    });

    return () => {
      narrationService.stop();
    };
  }, []);

  const handleToggleNarration = () => {
    if (!narrationService.isSupported()) {
      onShowToast('Audio narration is not supported by your browser', 'info');
      return;
    }

    if (narrationState.isPlaying) {
      narrationService.pause();
    } else if (narrationState.isPaused) {
      narrationService.resume();
    } else {
      setShowAudioBar(true);
      narrationService.start(`${article.title}. ${article.subtitle}. ${article.content}`, narrationSpeed);
      onShowToast('Reading aloud article', 'info');
    }
  };

  const handleStopNarration = () => {
    narrationService.stop();
    setShowAudioBar(false);
  };

  const handleSpeedChange = (speed: number) => {
    setNarrationSpeed(speed);
    narrationService.setRate(speed);
  };

  const handleClapClick = () => {
    onClap(article.id);
    setUserClapCount((prev) => prev + 1);
    setClapBubble(userClapCount + 1);
    setTimeout(() => setClapBubble(null), 1000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: commentAuthor.trim() || 'Guest Reader',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      time: 'Just now',
      text: commentText.trim(),
      likes: 0,
    };

    onAddComment(article.id, newComment);
    setCommentText('');
    onShowToast('Your comment was published', 'success');
  };

  const handleCopyQuote = (quote: string) => {
    navigator.clipboard.writeText(quote);
    onShowToast('Quote copied to clipboard', 'success');
  };

  // Theme container classes
  const themeClasses = {
    alabaster: 'bg-[#faf8f5] text-[#1c1917]',
    sepia: 'bg-[#f4eee1] text-[#2c251e]',
    ink: 'bg-[#0e1117] text-[#e2e8f0]',
  }[settings.theme];

  const fontClass = settings.font === 'serif' ? 'font-serif' : 'font-sans';
  const widthClass = settings.columnWidth === 'wide' ? 'max-w-4xl' : 'max-w-2xl';

  const fontSizes = {
    sm: 'text-base sm:text-lg leading-relaxed',
    base: 'text-lg sm:text-xl leading-relaxed',
    lg: 'text-xl sm:text-2xl leading-relaxed',
    xl: 'text-2xl sm:text-3xl leading-relaxed',
  }[settings.fontSize];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div
          className="h-full bg-stone-800 transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: settings.theme === 'ink' ? '#e2e8f0' : '#292524',
          }}
        />
      </div>

      {/* Reader Utility Bar */}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-200 backdrop-blur-md ${
        settings.theme === 'ink'
          ? 'bg-[#0e1117]/90 border-stone-800 text-stone-200'
          : settings.theme === 'sepia'
          ? 'bg-[#f4eee1]/90 border-[#e2d8c3] text-[#2c251e]'
          : 'bg-[#faf8f5]/90 border-stone-200 text-stone-900'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-medium hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Stories</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            {/* Audio narration toggle */}
            <button
              onClick={handleToggleNarration}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all ${
                narrationState.isPlaying
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : settings.theme === 'ink'
                  ? 'border-stone-700 hover:border-stone-500'
                  : 'border-stone-300 hover:border-stone-400'
              }`}
              title="Listen to audio narration"
            >
              {narrationState.isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-amber-800" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              <span className="font-medium">{narrationState.isPlaying ? 'Listening' : 'Listen'}</span>
            </button>

            {/* Typography & Theme popover button */}
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className={`p-2 rounded-md border transition-colors ${
                showSettingsMenu
                  ? 'bg-stone-200/50'
                  : settings.theme === 'ink'
                  ? 'border-stone-700 hover:border-stone-500'
                  : 'border-stone-300 hover:border-stone-400'
              }`}
              title="Reading display settings"
              aria-label="Display settings"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className={`p-2 rounded-md border transition-colors ${
                isBookmarked
                  ? 'text-amber-700 border-amber-300 bg-amber-50/50'
                  : settings.theme === 'ink'
                  ? 'border-stone-700 hover:border-stone-500'
                  : 'border-stone-300 hover:border-stone-400'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={() => onOpenShare(article)}
              className={`p-2 rounded-md border transition-colors ${
                settings.theme === 'ink'
                  ? 'border-stone-700 hover:border-stone-500'
                  : 'border-stone-300 hover:border-stone-400'
              }`}
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Typography & Theme Customizer Bar */}
        {showSettingsMenu && (
          <div className={`border-t px-6 py-4 animate-in fade-in slide-in-from-top-1 ${
            settings.theme === 'ink'
              ? 'bg-[#151921] border-stone-800'
              : settings.theme === 'sepia'
              ? 'bg-[#ece4d2] border-[#dfd4bd]'
              : 'bg-white border-stone-200'
          }`}>
            <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-6 text-xs">
              {/* Theme Selector */}
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium">Theme</span>
                <div className="flex items-center gap-1 p-1 bg-stone-200/40 rounded-lg">
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'alabaster' })}
                    className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                      settings.theme === 'alabaster' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Alabaster</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                    className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                      settings.theme === 'sepia' ? 'bg-[#f4eee1] text-[#2c251e] shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Sepia</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'ink' })}
                    className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-all ${
                      settings.theme === 'ink' ? 'bg-stone-900 text-stone-100 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Ink</span>
                  </button>
                </div>
              </div>

              {/* Font Family Selector */}
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium">Typeface</span>
                <div className="flex items-center gap-1 p-1 bg-stone-200/40 rounded-lg">
                  <button
                    onClick={() => setSettings({ ...settings, font: 'serif' })}
                    className={`px-3 py-1 rounded font-serif transition-all ${
                      settings.font === 'serif' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600'
                    }`}
                  >
                    Serif
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, font: 'sans' })}
                    className={`px-3 py-1 rounded font-sans transition-all ${
                      settings.font === 'sans' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600'
                    }`}
                  >
                    Sans
                  </button>
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium">Size</span>
                <div className="flex items-center gap-1 p-1 bg-stone-200/40 rounded-lg">
                  {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSettings({ ...settings, fontSize: size })}
                      className={`px-2.5 py-1 rounded uppercase font-mono transition-all ${
                        settings.fontSize === size ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column Width */}
              <div className="flex items-center gap-2">
                <span className="text-stone-400 font-medium">Width</span>
                <div className="flex items-center gap-1 p-1 bg-stone-200/40 rounded-lg">
                  <button
                    onClick={() => setSettings({ ...settings, columnWidth: 'prose' })}
                    className={`px-3 py-1 rounded transition-all ${
                      settings.columnWidth === 'prose' ? 'bg-white text-stone-900 shadow-xs font-medium' : 'text-stone-600'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, columnWidth: 'wide' })}
                    className={`px-3 py-1 rounded transition-all ${
                      settings.columnWidth === 'wide' ? 'bg-white text-stone-900 shadow-xs font-medium' : 'text-stone-600'
                    }`}
                  >
                    Wide
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Audio Player Ribbon */}
        {showAudioBar && (
          <div className="bg-amber-900 text-amber-50 px-6 py-2.5 shadow-md flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleNarration}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-amber-900 hover:bg-amber-100 transition-colors"
                aria-label={narrationState.isPlaying ? 'Pause speech' : 'Resume speech'}
              >
                {narrationState.isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>

              <div>
                <span className="font-semibold tracking-wide">Audio Narration</span>
                <span className="text-amber-200 ml-2 hidden sm:inline">
                  {narrationState.isPlaying ? 'Streaming natural voice' : 'Paused'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Narration speed options */}
              <div className="flex items-center gap-1 bg-amber-950/50 p-0.5 rounded">
                {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleSpeedChange(rate)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      narrationSpeed === rate ? 'bg-amber-200 text-amber-950 font-bold' : 'text-amber-200/70 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              <button
                onClick={handleStopNarration}
                className="text-amber-200 hover:text-white p-1"
                aria-label="Stop and close audio narration"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Reading Canvas */}
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Unboxed Metadata (NO PILLS) */}
        <div className="flex items-center gap-2 text-xs tracking-wider text-stone-500 font-sans uppercase mb-4">
          <span className="font-semibold text-stone-700">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>{article.publishedAt}</span>
        </div>

        {/* Title */}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-[1.18] mb-6"
          style={{ textWrap: 'balance' }}
        >
          {article.title}
        </h1>

        {/* Subtitle / Deck */}
        <p className="text-lg sm:text-xl font-sans text-stone-600 leading-relaxed mb-8">
          {article.subtitle}
        </p>

        {/* Author Byline Block */}
        <div className="flex items-center justify-between py-6 border-y border-stone-200/60 mb-10">
          <div
            onClick={() => onOpenAuthor(article.author)}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-stone-300 group-hover:scale-105 transition-transform"
            />
            <div>
              <h3 className="text-sm font-semibold text-stone-900 group-hover:underline">
                {article.author.name}
              </h3>
              <p className="text-xs text-stone-500 line-clamp-1">{article.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuthor(article.author)}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-stone-300 hover:bg-stone-100 transition-colors"
            >
              Author Dossier
            </button>
          </div>
        </div>

        {/* Featured Cover Image */}
        {article.coverImage && (
          <div className="mb-12">
            <div className="overflow-hidden rounded-lg bg-stone-200 aspect-[16/9]">
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs font-serif italic text-stone-500 mt-2.5 text-center">
              Figure 1. Visual study accompanying &ldquo;{article.title}&rdquo;
            </p>
          </div>
        )}

        {/* Article Body Content */}
        <article className={`mx-auto ${widthClass} ${fontClass}`}>
          {article.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();

            // Headings
            if (trimmed.startsWith('### ')) {
              return (
                <h3
                  key={index}
                  className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 mt-12 mb-4 pt-6 border-t border-stone-200/40"
                >
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }

            if (trimmed.startsWith('## ')) {
              return (
                <h2
                  key={index}
                  className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-stone-900 mt-14 mb-5 pt-8 border-t border-stone-200/40"
                >
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }

            // Blockquote / Pull Quote (Refined without thick left accent border)
            if (trimmed.startsWith('> ')) {
              const quoteContent = trimmed.replace(/^>\s*/, '').replace(/"/g, '');
              return (
                <div
                  key={index}
                  className="my-10 py-6 px-8 border-y border-stone-300/80 bg-stone-50/50 relative group"
                >
                  <blockquote className="text-xl sm:text-2xl font-serif italic text-stone-800 leading-snug">
                    &ldquo;{quoteContent}&rdquo;
                  </blockquote>
                  <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-sans font-medium uppercase tracking-wider">Pull Quote</span>
                    <button
                      onClick={() => handleCopyQuote(quoteContent)}
                      className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Quote</span>
                    </button>
                  </div>
                </div>
              );
            }

            // Bullet list
            if (trimmed.startsWith('- ')) {
              const items = trimmed.split('\n').map((li) => li.replace(/^-\s*/, ''));
              return (
                <ul key={index} className={`my-6 space-y-2 list-disc list-inside text-stone-700 ${fontSizes}`}>
                  {items.map((item, i) => (
                    <li key={i} className="pl-2">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }

            // Numbered list
            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split('\n').map((li) => li.replace(/^\d+\.\s*/, ''));
              return (
                <ol key={index} className={`my-6 space-y-3 list-decimal list-inside text-stone-700 ${fontSizes}`}>
                  {items.map((item, i) => (
                    <li key={i} className="pl-2">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }

            // First paragraph drop-cap
            const isFirst = index === 0;

            return (
              <p
                key={index}
                className={`mb-6 text-stone-700 ${fontSizes} ${isFirst ? 'drop-cap' : ''}`}
              >
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* In-Article Interaction Dock (Claps, Bookmark, Share) */}
        <section className={`mx-auto ${widthClass} mt-16 pt-8 border-t border-stone-200/80`}>
          <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-white/60 rounded-xl border border-stone-200/70 shadow-xs">
            <div className="flex items-center gap-4">
              {/* Interactive Applaud Button */}
              <div className="relative">
                <button
                  onClick={handleClapClick}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-transform active:scale-95 shadow-sm"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span className="text-xs font-semibold">Applaud Story</span>
                  <span className="font-mono text-xs tabular-nums text-stone-300">
                    {article.claps}
                  </span>
                </button>

                {clapBubble !== null && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                    +{clapBubble}
                  </span>
                )}
              </div>

              {/* Bookmark */}
              <button
                onClick={() => onToggleBookmark(article.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-medium transition-colors ${
                  isBookmarked
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved to List' : 'Save Story'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenShare(article)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-stone-300 hover:bg-stone-100 text-xs font-medium transition-colors text-stone-700"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-stone-300 hover:bg-stone-100 text-xs font-medium transition-colors text-stone-700"
                title="Print article"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </section>

        {/* Author Bio Card */}
        <section className={`mx-auto ${widthClass} mt-12 p-8 rounded-xl bg-stone-100/70 border border-stone-200`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border border-stone-300 shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h4 className="text-base font-semibold text-stone-900">{article.author.name}</h4>
                <button
                  onClick={() => onOpenAuthor(article.author)}
                  className="text-xs font-medium text-stone-700 hover:underline"
                >
                  View Profile &rarr;
                </button>
              </div>
              <p className="text-xs text-stone-500 font-sans mb-2">{article.author.role}</p>
              <p className="text-sm text-stone-600 font-sans leading-relaxed">{article.author.bio}</p>
            </div>
          </div>
        </section>

        {/* Discussion / Responses Section */}
        <section className={`mx-auto ${widthClass} mt-16`}>
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              Responses ({article.comments.length})
            </h3>
            <span className="text-xs text-stone-500 font-sans">Curated discourse</span>
          </div>

          {/* Comment submission form */}
          <form onSubmit={handleCommentSubmit} className="mb-10 p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
            <h4 className="text-sm font-semibold text-stone-900 mb-3">Add to the Conversation</h4>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Your Name or Pseudonym (e.g., Ada Lovelace)"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/50"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Share your perspective, critique, or inquiry..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-sm p-3.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/50 resize-y"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Response</span>
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="space-y-6">
            {article.comments.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-lg border border-dashed border-stone-300">
                <p className="text-sm text-stone-500 font-serif italic">
                  Be the first to share an insightful response to this essay.
                </p>
              </div>
            ) : (
              article.comments.map((comment) => (
                <div key={comment.id} className="p-5 rounded-xl bg-white border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <h5 className="text-xs font-semibold text-stone-900">{comment.author}</h5>
                        <p className="text-[11px] text-stone-400">{comment.time}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed font-sans">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
