'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import css from './NoteDetails.module.css';

export default function NoteDetailsClient() {
  const { id: idParam } = useParams<{ id: string | string[] }>();
  const id = Array.isArray(idParam) ? idParam[0] : (idParam ?? '');

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(String(id)),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p className={css.message}>Loading, please wait…</p>;
  if (isError || !note)
    return <p className={css.message}>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <article className={css.item}>
        <header className={css.header}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.tag}>Tag: {note.tag}</p>
        </header>

        <p className={css.content}>{note.content}</p>

        <footer className={css.footer}>
          <time className={css.date}>
            Created: {new Date(note.createdAt).toLocaleString()}
          </time>
        </footer>
      </article>
    </div>
  );
}
