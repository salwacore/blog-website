import React from 'react';
import { Article } from '../types/blog';
import { X, BookmarkX, ArrowRight, Trash2 } from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (articleId: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-[#faf8f5] shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900">Reading Shelf</h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              {savedArticles.length} {savedArticles.length === 1 ? 'story' : 'stories'} saved for later
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="py-16 text-center">
              <BookmarkX className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-base font-serif font-medium text-stone-700 mb-1">
                Your reading shelf is empty
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Bookmark noteworthy essays while browsing to return to them whenever you wish.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 bg-white rounded-lg border border-stone-200/80 hover:border-stone-300 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1.5">
                    <span className="font-semibold text-stone-700">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="text-base font-serif font-bold text-stone-900 leading-snug hover:text-stone-700 cursor-pointer mb-2 line-clamp-2"
                  >
                    {article.title}
                  </h4>

                  <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                    {article.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-stone-500 font-medium">{article.author.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemoveBookmark(article.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove from reading shelf"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="flex items-center gap-1 font-semibold text-stone-900 hover:underline"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedArticles.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white text-center">
            <span className="text-[11px] text-stone-400 font-sans">
              Articles stored locally across browser sessions
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
