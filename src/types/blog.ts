export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  author: Author;
  claps: number;
  comments: Comment[];
  featuredTier?: 'lead' | 'secondary' | 'standard';
  isUserCreated?: boolean;
}

export type ReaderTheme = 'alabaster' | 'sepia' | 'ink';
export type ReaderFont = 'serif' | 'sans';
export type ReaderFontSize = 'sm' | 'base' | 'lg' | 'xl';
export type ReaderWidth = 'prose' | 'wide';

export interface ReaderSettings {
  theme: ReaderTheme;
  font: ReaderFont;
  fontSize: ReaderFontSize;
  columnWidth: ReaderWidth;
}
