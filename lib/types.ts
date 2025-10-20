import type { Note } from '@/types/note';

export interface NotesListResponse {
  notes: Note[];
  totalPages: number;
}
