import type { Note, NoteTag } from "@/types/note";

export interface NotesListResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}
