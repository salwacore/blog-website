import React from 'react';
import { Author, Article } from '../types/blog';
import { X, BookOpen, Heart, Award, ArrowUpRight } from 'lucide-react';

interface AuthorModalProps {
  author: Author | null;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const AuthorModal: React.FC<AuthorModalProps> = ({
  author,
  onClose,
  articles,
  onSelectArticle,
}) => {
  if (!author) return null;

  const authorArticles = articles.filter(
    (a) => a.author.name.toLowerCase() === author.name.toLowerCase()
  );

  const totalClaps = authorArticles.reduce((acc, a) => acc + a.claps, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-6">
          <img
            src={author.avatar}
            alt={author.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 rounded-full object-cover border-2 border-stone-200 shadow-xs"
          />
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">{author.name}</h3>
            <p className="text-xs font-sans text-stone-500 mt-0.5">{author.role}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-stone-600 font-mono">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                <span className="tabular-nums font-semibold">{authorArticles.length}</span> Published
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span className="tabular-nums font-semibold">{totalClaps}</span> Applauds
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 mb-6">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 font-sans">
            Author Dossier
          </h4>
          <p className="text-sm text-stone-700 leading-relaxed font-sans">{author.bio}</p>
        </div>

        {/* Authored Articles */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3 font-sans">
            Writings in Folio
          </h4>
          <div className="space-y-2.5 max-h-60 overflow-y-auto">
            {authorArticles.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No published articles yet.</p>
            ) : (
              authorArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => {
                    onSelectArticle(art);
                    onClose();
                  }}
                  className="p-3 bg-stone-50/60 hover:bg-stone-100 rounded-lg border border-stone-200/60 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="pr-4">
                    <h5 className="text-sm font-serif font-bold text-stone-900 group-hover:underline line-clamp-1">
                      {art.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 font-sans">
                      <span>{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 shrink-0 transition-colors" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
