// Database and application types

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type Book = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  author_name: string;
  author_clerk_id: string;
  genre: string | null;
  tags: string[] | null;
  chapter_prefix: string | null;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
};

export type BookListItem = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  approval_status: ApprovalStatus;
};

export type ModBookListItem = {
  id: any;
  title: any;
  author_name: any;
  created_at: any;
};

export type Chapter = {
  id: string;
  book_id: string;
  title: string;
  content_md: string;
  order_index: number;
  is_premium: boolean;
  price_credits: number;
  created_at: string;
  updated_at: string;
};


export type Author = {
  clerk_id: string;
  name: string;
  email?: string;
};

export type Moderator = {
  clerk_id: string;
  name: string;
  email?: string;
};

export type ChapterPurchase = {
  id: string;
  user_clerk_id: string;
  chapter_id: string;
  purchased_at: string;
};

export type UserCredits = {
  user_clerk_id: string;
  credits: number;
  updated_at: string;
};

// Form types
export type BookFormData = {
  title: string;
  description: string;
  genre: string;
  tags: string[];
  chapter_prefix: string;
  cover_url?: string;
};

export type ChapterFormData = {
  title: string;
  content: string;
  order: number;
  isPremium: boolean;
  price: number;
};

// API response types
export type BookListResponse = {
  books: Book[];
  total: number;
};

export type ChapterListResponse = {
  chapters: Chapter[];
  total: number;
};

// Component props types
export type BookCardProps = {
  book: Book;
  showAuthor?: boolean;
  showStatus?: boolean;
  className?: string;
};

export type ChapterCardProps = {
  chapter: Chapter;
  isPurchased?: boolean;
  canPurchase?: boolean;
  userCredits?: number;
  onPurchase?: (chapterId: string) => void;
  className?: string;
};

export type EditPencilProps = {
  onClick?: () => void;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?:"default" | "ghost" | "outline" | "secondary";
  text?: string;
};