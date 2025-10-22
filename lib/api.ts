import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { Note, NoteTag } from "@/types/note";
import type { NotesListResponse } from "@/lib/types";

const API_BASE =
  process.env.NEXT_PUBLIC_NOTEHUB_API ??
  "https://notehub-public.goit.study/api";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const t = (TOKEN ?? "").toString().trim();
  if (t) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteParams {
  id: string;
}

export async function fetchNotes(
  { page, perPage, search, tag }: FetchNotesParams,
  signal?: AbortSignal
): Promise<NotesListResponse> {
  const params: Record<string, string | number> = { page, perPage };

  if (search?.trim()) params.search = search.trim();
  if (tag) params.tag = tag;

  const res: AxiosResponse<NotesListResponse> =
    await api.get<NotesListResponse>("/notes", { params, signal });
  return res.data;
}

export async function fetchNoteById(
  id: string,
  signal?: AbortSignal
): Promise<Note> {
  const res: AxiosResponse<Note> = await api.get<Note>(`/notes/${id}`, {
    signal,
  });
  return res.data;
}

export async function createNote(
  body: CreateNoteParams,
  signal?: AbortSignal
): Promise<Note> {
  const res: AxiosResponse<Note> = await api.post<Note>("/notes", body, {
    signal,
  });
  return res.data;
}

export async function deleteNote(
  { id }: DeleteNoteParams,
  signal?: AbortSignal
): Promise<Note> {
  const res: AxiosResponse<Note> = await api.delete<Note>(`/notes/${id}`, {
    signal,
  });
  return res.data;
}
