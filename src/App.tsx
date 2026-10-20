import React, { useState, useEffect, useMemo } from 'react';
import { Article, Author, Comment } from './types/blog';
import { INITIAL_ARTICLES } from './data/initialArticles';
import { Navbar } from './components/Navbar';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { WriterStudio } from './components/WriterStudio';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { AuthorModal } from './components/AuthorModal';
import { ShareModal } from './components/ShareModal';
import { ManifestoView } from './components/ManifestoView';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  Search,
  SlidersHorizontal,
  PenSquare,
  BookOpen,
  ArrowRight,
  Mail,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'home' | 'reader' | 'studio' | 'manifesto'>('home');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Articles state initialized from LocalStorage or Default
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem('folio_articles_store');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_ARTICLES;
  });

  // Bookmarks state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('folio_bookmarks_store');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return ['architecture-of-light-and-silence'];
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'short' | 'long'>('latest');

  // Modals & Drawers state
  const [isReadingListOpen, setIsReadingListOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [shareArticle, setShareArticle] = useState<Article | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('folio_articles_store', JSON.stringify(articles));
    } catch {
      // ignore
    }
  }, [articles]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('folio_bookmarks_store', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  // Active article getter
  const activeArticle = useMemo(() => {
    return articles.find((a) => a.id === activeArticleId) || null;
  }, [articles, activeArticleId]);

  // Filtered & Sorted articles for home
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        searchQuery === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || art.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.claps - a.claps;
      if (sortBy === 'short') {
        const aTime = parseInt(a.readTime) || 5;
        const bTime = parseInt(b.readTime) || 5;
        return aTime - bTime;
      }
      if (sortBy === 'long') {
        const aTime = parseInt(a.readTime) || 5;
        const bTime = parseInt(b.readTime) || 5;
        return bTime - aTime;
      }
      return 0; // default latest order
    });
  }, [articles, searchQuery, selectedCategory, sortBy]);

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(a.category));
    return ['All', ...Array.from(set)];
  }, [articles]);

  // Handlers
  const handleSelectArticle = (article: Article) => {
    setActiveArticleId(article.id);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (articleId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(articleId);
      if (exists) {
        showToast('Removed from reading list', 'info');
        return prev.filter((id) => id !== articleId);
      } else {
        showToast('Saved to reading list', 'success');
        return [...prev, articleId];
      }
    });
  };

  const handleClap = (articleId: string) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return { ...art, claps: art.claps + 1 };
        }
        return art;
      })
    );
  };

  const handleAddComment = (articleId: string, newComment: Comment) => {
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return {
            ...art,
            comments: [newComment, ...art.comments],
          };
        }
        return art;
      })
    );
  };

  const handlePublishArticle = (newArticle: Article) => {
    setArticles((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === newArticle.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newArticle;
        return updated;
      }
      return [newArticle, ...prev];
    });

    setActiveArticleId(newArticle.id);
    setCurrentView('reader');
    setEditingArticle(null);
    showToast('Your story has been published to Folio', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    showToast('Subscribed to Weekly Folio Dispatches', 'success');
  };

  // Saved articles object array
  const savedArticles = useMemo(() => {
    return articles.filter((a) => bookmarkedIds.includes(a.id));
  }, [articles, bookmarkedIds]);

  // Lead and secondary story picks for 3-tier front page
  const leadStory = filteredArticles.find((a) => a.featuredTier === 'lead') || filteredArticles[0];
  const secondaryStories = filteredArticles.filter((a) => a.id !== leadStory?.id).slice(0, 2);
  const remainingStories = filteredArticles.filter(
    (a) => a.id !== leadStory?.id && !secondaryStories.some((s) => s.id === a.id)
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-stone-200">
      {/* Strict Top Bar Contract (Zone 1, Zone 2, Zone 3) */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'studio') setEditingArticle(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReadingList={() => setIsReadingListOpen(true)}
        savedCount={bookmarkedIds.length}
      />

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'home' && (
          <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Curatorial Issue Marquee Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-stone-200/80 mb-10 text-xs font-mono text-stone-500">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-stone-800">ISSUE Nº 42</span>
                <span aria-hidden="true">·</span>
                <span>WINTER 2026 EDITION</span>
                <span aria-hidden="true">·</span>
                <span className="hidden sm:inline">AN INDEPENDENT EDITORIAL GUILD</span>
              </div>
              <div className="flex items-center gap-4">
                <span>14,820 READERS WORLDWIDE</span>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setCurrentView('studio');
                  }}
                  className="font-semibold text-stone-900 hover:underline"
                >
                  SUBMIT ESSAY &rarr;
                </button>
              </div>
            </div>

            {/* If no search or filter query: render 3-tier Front-Page Hierarchy */}
            {searchQuery === '' && selectedCategory === 'All' ? (
              <>
                {/* TIER 1: Lead Feature Story */}
                {leadStory && (
                  <ArticleCard
                    article={leadStory}
                    variant="lead"
                    onSelect={handleSelectArticle}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarkedIds.includes(leadStory.id)}
                    onClap={handleClap}
                  />
                )}

                {/* TIER 2: Secondary Features (2-column layout) */}
                {secondaryStories.length > 0 && (
                  <section className="mb-14">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-8">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600 font-sans">
                        Curated Perspectives
                      </h3>
                      <span className="text-xs text-stone-400 font-sans">Editor’s Selection</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {secondaryStories.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          variant="secondary"
                          onSelect={handleSelectArticle}
                          onToggleBookmark={handleToggleBookmark}
                          isBookmarked={bookmarkedIds.includes(article.id)}
                          onClap={handleClap}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : null}

            {/* Interactive Topics, Filter & Search Section */}
            <section id="topics-section" className="mb-12 pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
                {/* Search Bar */}
                <div className="relative max-w-md w-full">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search essays, concepts, or authors..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-white rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 font-sans text-stone-800 placeholder:text-stone-400 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 self-start md:self-auto text-xs text-stone-500">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-md border border-stone-300 bg-white text-stone-800 font-medium focus:outline-none text-xs"
                  >
                    <option value="latest">Latest Published</option>
                    <option value="popular">Most Applauded</option>
                    <option value="short">Quick Reads (&lt; 5 min)</option>
                    <option value="long">Longform Essays</option>
                  </select>
                </div>
              </div>

              {/* Functional Topic Selector Buttons (Segmented Controls) */}
              <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* TIER 3: Department / Stories Grid */}
            <section className="mb-20">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600 font-sans">
                  {searchQuery || selectedCategory !== 'All'
                    ? `Results (${filteredArticles.length})`
                    : 'The Complete Archive & Recent Essays'}
                </h3>
                <span className="text-xs text-stone-400 font-sans">
                  Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'essay' : 'essays'}
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-xl border border-stone-200">
                  <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <h4 className="text-base font-serif font-bold text-stone-800 mb-1">
                    No articles found matching criteria
                  </h4>
                  <p className="text-xs text-stone-500 mb-6">
                    Try broadening your search query or reset your selected category filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 bg-stone-900 text-white rounded-md text-xs font-medium hover:bg-stone-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery !== '' || selectedCategory !== 'All'
                    ? filteredArticles
                    : remainingStories
                  ).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="standard"
                      onSelect={handleSelectArticle}
                      onToggleBookmark={handleToggleBookmark}
                      isBookmarked={bookmarkedIds.includes(article.id)}
                      onClap={handleClap}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Curated Dispatches Newsletter Strip */}
            <section className="mb-20 p-8 sm:p-12 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
              <div className="max-w-2xl mx-auto text-center">
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 mb-2 block font-sans">
                  Weekly Dispatch
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-3">
                  Delivered Gently to Your In-box
                </h3>
                <p className="text-sm text-stone-600 font-sans leading-relaxed mb-6">
                  Every Sunday morning, we assemble the three most illuminating essays on architecture, craftsmanship, and technology. Zero spam, zero noise.
                </p>

                {newsletterSubscribed ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You are subscribed to the Sunday Dispatch. Welcome aboard.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="your.email@address.com"
                      className="w-full text-xs px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50/50"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors whitespace-nowrap shadow-xs"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </section>
          </main>
        )}

        {currentView === 'reader' && activeArticle && (
          <ArticleReader
            article={activeArticle}
            onBack={() => setCurrentView('home')}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={bookmarkedIds.includes(activeArticle.id)}
            onClap={handleClap}
            onAddComment={handleAddComment}
            onOpenAuthor={(author) => setSelectedAuthor(author)}
            onOpenShare={(art) => setShareArticle(art)}
            onShowToast={showToast}
          />
        )}

        {currentView === 'studio' && (
          <WriterStudio
            initialArticle={editingArticle}
            onBack={() => setCurrentView('home')}
            onPublish={handlePublishArticle}
            onShowToast={showToast}
          />
        )}

        {currentView === 'manifesto' && (
          <ManifestoView
            onStartWriting={() => {
              setEditingArticle(null);
              setCurrentView('studio');
            }}
            onBackToStories={() => setCurrentView('home')}
          />
        )}
      </div>

      {/* Reading Shelf Drawer */}
      <BookmarksDrawer
        isOpen={isReadingListOpen}
        onClose={() => setIsReadingListOpen(false)}
        savedArticles={savedArticles}
        onSelectArticle={handleSelectArticle}
        onRemoveBookmark={handleToggleBookmark}
      />

      {/* Author Dossier Modal */}
      <AuthorModal
        author={selectedAuthor}
        onClose={() => setSelectedAuthor(null)}
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* Share Modal */}
      <ShareModal
        article={shareArticle}
        onClose={() => setShareArticle(null)}
        onShowToast={showToast}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Editorial Footer */}
      <footer className="border-t border-stone-200 bg-white py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500 font-sans">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-base text-stone-900">Folio</span>
            <span>·</span>
            <span>Independent Journal of Architecture, Craft &amp; Thought</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className="hover:text-stone-900 transition-colors"
            >
              Archive
            </button>
            <button
              onClick={() => setCurrentView('manifesto')}
              className="hover:text-stone-900 transition-colors"
            >
              Manifesto
            </button>
            <button
              onClick={() => {
                setEditingArticle(null);
                setCurrentView('studio');
              }}
              className="hover:text-stone-900 transition-colors font-semibold"
            >
              Writer Studio
            </button>
          </div>

          <div className="text-stone-400">
            &copy; {new Date().getFullYear()} Folio Publishing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
