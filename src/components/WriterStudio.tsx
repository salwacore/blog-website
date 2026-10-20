import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../types/blog';
import {
  ArrowLeft,
  Heading1,
  Heading2,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Code,
  Eye,
  Maximize2,
  Minimize2,
  Sparkles,
  Upload,
  CheckCircle2,
  Save,
  Image as ImageIcon,
  Columns,
  PenTool,
  HelpCircle,
} from 'lucide-react';

interface WriterStudioProps {
  onBack: () => void;
  onPublish: (article: Article) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  initialArticle?: Article | null;
}

const PRESET_COVERS = [
  {
    name: 'Architectural Light',
    url: '/src/assets/images/editorial_architectural_light_1792472445796.jpg',
  },
  {
    name: 'Writer Morning Desk',
    url: '/src/assets/images/editorial_writing_desk_1792472445478.jpg',
  },
  {
    name: 'Algorithmic Networks',
    url: '/src/assets/images/editorial_future_technology_1792472446210.jpg',
  },
  {
    name: 'Handcrafted Ceramics',
    url: '/src/assets/images/editorial_artisan_craft_1792472447628.jpg',
  },
];

const CATEGORIES = [
  'Architecture & Design',
  'Writing Craft',
  'Philosophy',
  'Future Systems',
  'Craft & Design',
  'Culture & Society',
];

export const WriterStudio: React.FC<WriterStudioProps> = ({
  onBack,
  onPublish,
  onShowToast,
  initialArticle,
}) => {
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [category, setCategory] = useState(initialArticle?.category || CATEGORIES[0]);
  const [tagInput, setTagInput] = useState(initialArticle?.tags.join(', ') || 'Essays, Culture');
  const [coverImage, setCoverImage] = useState(
    initialArticle?.coverImage || PRESET_COVERS[0].url
  );
  const [customCoverUrl, setCustomCoverUrl] = useState('');

  // Author details
  const [authorName, setAuthorName] = useState(
    initialArticle?.author.name || 'Anonymous Thinker'
  );
  const [authorRole, setAuthorRole] = useState(
    initialArticle?.author.role || 'Writer & Cultural Observer'
  );
  const [authorBio, setAuthorBio] = useState(
    initialArticle?.author.bio || 'Exploring ideas at the intersection of craftsmanship, technology, and philosophy.'
  );

  // Editor modes
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isZenMode, setIsZenMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('Just now');
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (!initialArticle) {
      const savedDraft = localStorage.getItem('folio_active_draft');
      if (savedDraft && !content && !title) {
        try {
          const parsed = JSON.parse(savedDraft);
          setTitle(parsed.title || '');
          setSubtitle(parsed.subtitle || '');
          setContent(parsed.content || '');
          setCategory(parsed.category || CATEGORIES[0]);
          if (parsed.coverImage) setCoverImage(parsed.coverImage);
          if (parsed.authorName) setAuthorName(parsed.authorName);
        } catch {
          // ignore corrupted draft
        }
      }
    }
  }, []);

  // Save changes periodically
  useEffect(() => {
    const timer = setTimeout(() => {
      const draftData = {
        title,
        subtitle,
        content,
        category,
        coverImage,
        authorName,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      localStorage.setItem('folio_active_draft', JSON.stringify(draftData));
      setLastSaved(`Auto-saved at ${draftData.savedAt}`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, subtitle, content, category, coverImage, authorName]);

  // Calculations
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTimeEstimate = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

  // Toolbar action helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  const handleLoadSample = () => {
    setTitle('The Geometry of Solitude: Why Quiet Spaces Shape Great Works');
    setSubtitle('An inquiry into why history’s most influential thinkers constructed rigorous physical boundaries around their creative hours.');
    setContent(`Every winter, the Danish philosopher Søren Kierkegaard would arrange his study with five separate writing desks, each facing a different angle of natural light.

To write well is to manufacture stillness in an otherwise agitated world. When we eliminate peripheral distractions, the mind undergoes a profound neurological phase shift.

### 01. The Principle of Sacred Enclosure

In traditional Japanese architecture, the concept of *ma* denotes pure negative space—not as a void or emptiness, but as a pregnant interval that gives rhythm to form.

When you create an unhurried morning routine:
- Ban notifications before mid-day.
- Keep only one primary window open on your screen.
- Allow sentences to rest overnight before ruthless pruning.

> "True originality does not arrive through frantic acceleration, but through the courage to sit with an idea until its essential architecture emerges."

As you step into your own studio today, treat the blank canvas not with intimidation, but as an open field awaiting deliberate contemplation.`);
    setCategory('Philosophy');
    setCoverImage(PRESET_COVERS[1].url);
    onShowToast('Inspiring draft template loaded', 'success');
  };

  const handlePublishClick = () => {
    if (!title.trim()) {
      onShowToast('Please provide a title for your article', 'info');
      return;
    }

    if (!content.trim()) {
      onShowToast('Please write some content before publishing', 'info');
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newArticle: Article = {
      id: initialArticle ? initialArticle.id : `art_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'A thoughtful exploration on modern themes.',
      content: content.trim(),
      category,
      tags: tags.length ? tags : ['Essays', 'Culture'],
      readTime: readTimeEstimate,
      publishedAt: 'October 19, 2026',
      coverImage: customCoverUrl.trim() || coverImage,
      author: {
        name: authorName.trim() || 'Anonymous Writer',
        role: authorRole.trim() || 'Essayist & Contributor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
        bio: authorBio.trim(),
      },
      claps: initialArticle ? initialArticle.claps : 1,
      comments: initialArticle ? initialArticle.comments : [],
      featuredTier: 'standard',
      isUserCreated: true,
    };

    onPublish(newArticle);
    localStorage.removeItem('folio_active_draft');
  };

  return (
    <div className={`min-h-screen bg-[#faf8f5] text-stone-900 ${isZenMode ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      {/* Studio Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Leave Studio</span>
            </button>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-serif font-semibold text-stone-900">
              {initialArticle ? 'Edit Article' : 'Writer Studio'}
            </span>
            <span className="text-stone-300 hidden sm:inline">·</span>
            <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
              {lastSaved}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* View Mode Segmented Control */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  viewMode === 'split' ? 'bg-white text-stone-900 shadow-xs font-medium' : 'text-stone-600'
                }`}
                title="Split Editor & Live Preview"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split</span>
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  viewMode === 'edit' ? 'bg-white text-stone-900 shadow-xs font-medium' : 'text-stone-600'
                }`}
                title="Editor Only"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                  viewMode === 'preview' ? 'bg-white text-stone-900 shadow-xs font-medium' : 'text-stone-600'
                }`}
                title="Preview Only"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Zen Mode toggle */}
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className={`p-2 rounded-md border transition-colors ${
                isZenMode ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 text-stone-600 hover:text-stone-900'
              }`}
              title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Focus Mode'}
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Sample template */}
            <button
              onClick={handleLoadSample}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-md border border-stone-300 hover:bg-stone-100 transition-colors text-stone-700 font-medium"
              title="Fill with sample draft"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sample Draft</span>
            </button>

            {/* Publish CTA */}
            <button
              onClick={handlePublishClick}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md font-medium hover:bg-stone-800 transition-all shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{initialArticle ? 'Update Story' : 'Publish to Folio'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Article Metadata Bar */}
        <div className="mb-6 p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Editorial Department
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-stone-300 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-400 font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Architecture, Theory, Light"
                className="w-full text-xs px-3 py-2 rounded-md border border-stone-300 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>

            {/* Cover image toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Cover Photography
              </label>
              <button
                type="button"
                onClick={() => setShowCoverPicker(!showCoverPicker)}
                className="w-full text-xs px-3 py-2 rounded-md border border-stone-300 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-stone-700 font-medium transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <ImageIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span className="truncate">Select or customize cover</span>
                </div>
                <span className="text-[11px] text-stone-400">Edit</span>
              </button>
            </div>
          </div>

          {/* Cover Selector Drawer */}
          {showCoverPicker && (
            <div className="mt-6 pt-6 border-t border-stone-100 animate-in fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-700">Choose Curated Photograph</span>
                <span className="text-[11px] text-stone-400">High-fidelity editorial collection</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {PRESET_COVERS.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => {
                      setCoverImage(preset.url);
                      setCustomCoverUrl('');
                    }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      coverImage === preset.url && !customCoverUrl
                        ? 'border-stone-900 shadow-sm scale-102'
                        : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <div className="aspect-[16/10] bg-stone-200">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 font-medium p-1.5 bg-stone-50 truncate">
                      {preset.name}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                  Or Paste Custom Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50"
                />
              </div>
            </div>
          )}
        </div>

        {/* Formatting Toolbar */}
        <div className="sticky top-[57px] z-30 mb-4 p-2.5 bg-white/95 backdrop-blur-md rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => insertFormatting('## ', '')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700"
              title="Heading 2"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('### ', '')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700"
              title="Heading 3"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <span className="w-px h-4 bg-stone-200 mx-1" />
            <button
              onClick={() => insertFormatting('**', '**')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 font-bold"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('*', '*')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700 italic"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <span className="w-px h-4 bg-stone-200 mx-1" />
            <button
              onClick={() => insertFormatting('> ', '')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700"
              title="Pull Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('- ', '')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('1. ', '')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('```\n', '\n```')}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-700"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500 font-mono">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{readTimeEstimate}</span>
          </div>
        </div>

        {/* Editor & Preview Split Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Writing Panel */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4`}>
              <div className="p-8 bg-white rounded-xl border border-stone-200 shadow-xs">
                {/* Title Input */}
                <input
                  type="text"
                  placeholder="Article Headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-stone-900 placeholder:text-stone-300 focus:outline-none mb-4 leading-tight"
                />

                {/* Subtitle Input */}
                <textarea
                  placeholder="Add a compelling deck or summary (1-2 sentences)..."
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full text-base sm:text-lg text-stone-600 placeholder:text-stone-300 focus:outline-none resize-none mb-6 border-b border-stone-100 pb-4 font-sans leading-relaxed"
                />

                {/* Main Content Textarea */}
                <textarea
                  ref={textareaRef}
                  placeholder="Begin drafting your story... Markdown headings (##), pull quotes (>), lists, and paragraphs are supported."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={24}
                  className="w-full text-base text-stone-800 placeholder:text-stone-300 focus:outline-none font-sans leading-relaxed resize-y min-h-[500px]"
                />
              </div>

              {/* Author Bylines Drawer */}
              <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4">
                  Author Signature
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Elena Rostova"
                      className="w-full text-xs px-3 py-2 rounded-md border border-stone-300 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Role / Subtitle
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Essayist & Researcher"
                      className="w-full text-xs px-3 py-2 rounded-md border border-stone-300 bg-stone-50"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    rows={2}
                    value={authorBio}
                    onChange={(e) => setAuthorBio(e.target.value)}
                    placeholder="Short summary of background..."
                    className="w-full text-xs px-3 py-2 rounded-md border border-stone-300 bg-stone-50 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Live Preview Panel */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} sticky top-28`}>
              <div className="p-8 bg-stone-50/70 rounded-xl border border-stone-200/90 min-h-[600px] overflow-y-auto max-h-[calc(100vh-140px)] shadow-xs">
                <div className="text-[11px] uppercase tracking-widest text-stone-400 font-sans mb-4 flex items-center justify-between">
                  <span>Live Reader Preview</span>
                  <span>{readTimeEstimate}</span>
                </div>

                {/* Unboxed category metadata */}
                <div className="flex items-center gap-2 text-xs text-stone-500 font-sans tracking-wide mb-3">
                  <span className="font-semibold text-stone-700">{category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{readTimeEstimate}</span>
                  <span aria-hidden="true">·</span>
                  <span>Today</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight mb-3">
                  {title || 'Untitled Story'}
                </h1>

                {subtitle && (
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed mb-6 font-sans">
                    {subtitle}
                  </p>
                )}

                {/* Cover preview */}
                {(customCoverUrl || coverImage) && (
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-stone-200 mb-6">
                    <img
                      src={customCoverUrl || coverImage}
                      alt="Article cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Preview rendered paragraphs */}
                <div className="prose prose-stone max-w-none text-stone-700 font-serif leading-relaxed text-sm sm:text-base space-y-4">
                  {content ? (
                    content.split('\n\n').map((para, i) => {
                      const trimmed = para.trim();
                      if (trimmed.startsWith('### ')) {
                        return (
                          <h4 key={i} className="text-lg font-serif font-bold text-stone-900 mt-6 mb-2">
                            {trimmed.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (trimmed.startsWith('## ')) {
                        return (
                          <h3 key={i} className="text-xl font-serif font-bold text-stone-900 mt-8 mb-2">
                            {trimmed.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (trimmed.startsWith('> ')) {
                        return (
                          <blockquote key={i} className="my-4 py-3 px-4 border-y border-stone-300 italic text-stone-800 bg-white/40">
                            {trimmed.replace(/^>\s*/, '')}
                          </blockquote>
                        );
                      }
                      if (trimmed.startsWith('- ')) {
                        return (
                          <ul key={i} className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                            {trimmed.split('\n').map((li, idx) => (
                              <li key={idx}>{li.replace(/^-\s*/, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={i} className={i === 0 ? 'drop-cap' : ''}>
                          {trimmed}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-stone-400 italic">Your article preview will render here in real time as you write.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
