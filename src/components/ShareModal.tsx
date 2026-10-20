import React, { useState } from 'react';
import { Article } from '../types/blog';
import { X, Copy, Check, Download, Twitter, Linkedin, Printer } from 'lucide-react';

interface ShareModalProps {
  article: Article | null;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  article,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://folio-journal.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    onShowToast('Link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# ${article.title}\n\n*${article.subtitle}*\n\n**Author:** ${article.author.name} (${article.author.role})\n**Category:** ${article.category}\n**Published:** ${article.publishedAt}\n\n---\n\n${article.content}`;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast('Markdown file downloaded', 'success');
  };

  const shareText = encodeURIComponent(`"${article.title}" by ${article.author.name} on Folio`);
  const shareTwitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`;
  const shareLinkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
          <h3 className="text-lg font-serif font-bold text-stone-900">Share Story</h3>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-5">
          <p className="text-sm font-serif font-bold text-stone-800 line-clamp-1 mb-1">
            {article.title}
          </p>
          <p className="text-xs text-stone-500 font-sans">
            By {article.author.name} · {article.readTime}
          </p>
        </div>

        {/* Copy link input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Story Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 text-xs px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-600 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Share actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href={shareTwitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
          >
            <Twitter className="w-4 h-4 text-stone-800" />
            <span>Post on X</span>
          </a>
          <a
            href={shareLinkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            <span>LinkedIn</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100">
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Markdown</span>
          </button>
          <button
            onClick={() => {
              window.print();
              onClose();
            }}
            className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Article</span>
          </button>
        </div>
      </div>
    </div>
  );
};
