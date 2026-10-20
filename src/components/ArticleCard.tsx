import React, { useState } from 'react';
import { Article } from '../types/blog';
import { Bookmark, Heart, Clock, MessageSquare, ImageOff } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  isBookmarked: boolean;
  onClap: (articleId: string) => void;
  variant?: 'lead' | 'secondary' | 'compact' | 'standard';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  onToggleBookmark,
  isBookmarked,
  onClap,
  variant = 'standard',
}) => {
  const [imageError, setImageError] = useState(false);

  // Lead Feature Layout (Tier 1)
  if (variant === 'lead') {
    return (
      <article className="group relative border-b border-stone-200 pb-12 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Unboxed clean metadata (NO PILLS) */}
              <div className="flex items-center gap-2 text-xs text-stone-500 font-sans tracking-wide mb-3">
                <span className="font-medium text-stone-700">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>{article.publishedAt}</span>
              </div>

              {/* Title with balanced wrap */}
              <h2
                onClick={() => onSelect(article)}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] mb-4 cursor-pointer hover:text-stone-700 transition-colors"
                style={{ textWrap: 'balance' }}
              >
                {article.title}
              </h2>

              <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed mb-6 line-clamp-3">
                {article.subtitle}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              {/* Author byline */}
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-sm font-medium text-stone-900">{article.author.name}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1">{article.author.role}</p>
                </div>
              </div>

              {/* Action controls */}
              <div className="flex items-center gap-4 text-xs text-stone-500">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClap(article.id);
                  }}
                  className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
                  title="Applaud story"
                >
                  <Heart className="w-4 h-4 fill-stone-100 hover:fill-rose-500 hover:text-rose-500 transition-all" />
                  <span className="font-mono tabular-nums">{article.claps}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(article.id);
                  }}
                  className={`p-1 hover:text-stone-900 transition-colors ${
                    isBookmarked ? 'text-amber-700' : 'text-stone-400'
                  }`}
                  title={isBookmarked ? 'Remove from reading list' : 'Save to reading list'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Lead Image */}
          <div
            onClick={() => onSelect(article)}
            className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] overflow-hidden rounded-lg bg-stone-200 cursor-pointer shadow-sm group-hover:shadow-md transition-shadow"
          >
            {!imageError ? (
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-100 text-stone-400">
                <ImageOff className="w-8 h-8 mb-2" />
                <span className="text-xs font-serif italic text-stone-500">Editorial Photography</span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Secondary Feature Layout (Tier 2)
  if (variant === 'secondary') {
    return (
      <article className="group flex flex-col justify-between h-full border-b border-stone-200 pb-8 mb-6">
        <div>
          <div
            onClick={() => onSelect(article)}
            className="relative aspect-[16/10] overflow-hidden rounded-lg bg-stone-200 mb-4 cursor-pointer"
          >
            {!imageError ? (
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
                <span className="text-xs font-serif italic text-stone-500">Editorial View</span>
              </div>
            )}
          </div>

          {/* Clean unboxed metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-medium text-stone-700">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>

          <h3
            onClick={() => onSelect(article)}
            className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug mb-2 cursor-pointer hover:text-stone-700 transition-colors line-clamp-2"
          >
            {article.title}
          </h3>

          <p className="text-sm text-stone-600 font-sans leading-relaxed line-clamp-2 mb-4">
            {article.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-2">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-stone-200"
            />
            <span className="text-xs font-medium text-stone-800">{article.author.name}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClap(article.id);
              }}
              className="flex items-center gap-1 hover:text-stone-900 transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">{article.claps}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(article.id);
              }}
              className={`p-1 hover:text-stone-900 transition-colors ${
                isBookmarked ? 'text-amber-700' : 'text-stone-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Standard/Compact Grid Layout (Tier 3)
  return (
    <article className="group flex flex-col justify-between p-5 bg-white rounded-lg border border-stone-200/80 hover:border-stone-300 shadow-xs hover:shadow-sm transition-all">
      <div>
        {article.coverImage && (
          <div
            onClick={() => onSelect(article)}
            className="relative aspect-[16/9] overflow-hidden rounded-md bg-stone-100 mb-4 cursor-pointer"
          >
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span className="font-medium text-stone-700">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
        </div>

        <h3
          onClick={() => onSelect(article)}
          className="text-lg font-serif font-bold text-stone-900 leading-snug mb-2 cursor-pointer hover:text-stone-700 transition-colors line-clamp-2"
        >
          {article.title}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed line-clamp-2 mb-4">
          {article.subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
        <span className="text-stone-500 truncate max-w-[130px]">{article.author.name}</span>
        <div className="flex items-center gap-3 text-stone-400">
          <button
            onClick={() => onClap(article.id)}
            className="flex items-center gap-1 hover:text-stone-700 transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{article.claps}</span>
          </button>
          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`hover:text-stone-700 transition-colors ${
              isBookmarked ? 'text-amber-700' : ''
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </article>
  );
};
