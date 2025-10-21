export const TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;
export const ALL_TAGS = ["All", ...TAGS] as const;
export type NoteTag = (typeof TAGS)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

