export const BOOK_TITLE_MAX = 200;
export const BOOK_DESC_MAX = 500;
export const CHAPTER_TITLE_MAX = 150;
export const COMMENT_MAX = 500;

export const CHAPTER_PREFIX_OPTIONS = [
  { value: "", label: "No prefix" },
  { value: "Chapter", label: "Chapter 1. <title>" },
  { value: "1st Edition", label: "1st Edition: <title>" },
  { value: "Part", label: "Part 1. <title>" },
  { value: "Episode", label: "Episode 1. <title>" },
] as const;

export const COVER_PRESETS = [
  { id: "preset-1", url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop" },
  { id: "preset-2", url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop" },
  { id: "preset-3", url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop" },
  { id: "preset-4", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop" },
  { id: "preset-5", url: "https://images.unsplash.com/photo-1476275466078-7377373fcb80?w=400&h=600&fit=crop" },
] as const;

export const GENRES = [
  "Fantasy", "Romance", "Mystery", "Sci-Fi", "Thriller", "Literary",
  "Horror", "Young Adult", "Historical", "Comedy", "Other",
] as const;
