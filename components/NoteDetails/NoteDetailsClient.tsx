"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

type Props = { id: string };

export default function NoteDetailsClient({ id }: Props) {
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: ({ signal }) => fetchNoteById(id, signal),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

  if (isLoading) {
    return <p className={css.message}>Loading, please wait…</p>;
  }

  if (isError || !note) {
    return (
      <p className={css.message}>
        {(error as Error)?.message ?? "Something went wrong."}
      </p>
    );
  }

  return (
    <div className={css.container}>
      <article className={css.item}>
        <header className={css.header}>
          <h2 id="note-preview-title" className={css.title}>
            {note.title}
          </h2>
          <p className={css.tag}>Tag: {note.tag}</p>
        </header>
        <p className={css.content}>{note.content}</p>
        <footer className={css.footer}>
          <time className={css.date} dateTime={note.createdAt}>
            Created: {new Date(note.createdAt).toLocaleString()}
          </time>
        </footer>
      </article>
    </div>
  );
}
