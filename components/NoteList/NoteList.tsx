"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import type { Note } from "@/types/note";
import type { NotesListResponse } from "@/lib/types";
import { deleteNote } from "@/lib/api";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  page: number;
  search: string;
  perPage: number;
  tagKey?: string;
}

type Ctx = { prevData?: NotesListResponse };

export default function NoteList({
  notes,
  page,
  search,
  perPage,
  tagKey = "all",
}: NoteListProps) {
  const qc = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const listKey = ["notes", { page, search, perPage, tag: tagKey }] as const;

  const { mutate } = useMutation<Note, Error, string, Ctx>({
    mutationFn: (id) => deleteNote({ id }),
    onMutate: async (id) => {
      setDeletingId(id);
      await qc.cancelQueries({ queryKey: listKey });

      const prevData = qc.getQueryData<NotesListResponse>(listKey);
      if (prevData) {
        const nextNotes = (prevData.notes ?? []).filter((n) => n.id !== id);

        const approxTotalBefore = (prevData.totalPages ?? 1) * perPage;
        const approxTotalAfter = Math.max(0, approxTotalBefore - 1);
        const nextTotalPages = Math.max(
          1,
          Math.ceil(approxTotalAfter / perPage)
        );

        qc.setQueryData<NotesListResponse>(listKey, {
          ...prevData,
          notes: nextNotes,
          totalPages: nextTotalPages,
        });
      }

      return { prevData };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevData) {
        qc.setQueryData<NotesListResponse>(listKey, ctx.prevData);
      }
      setDeletingId(null);
    },
    onSuccess: (_deletedNote) => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
    onSettled: () => setDeletingId(null),
  });

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h3 className={css.title}>{n.title}</h3>
          <p className={css.content}>{n.content}</p>
          <p className={css.tag}>Tag: {n.tag ?? "-"}</p>

          <div className={css.footer}>
            <Link
              href={`/notes/${encodeURIComponent(String(n.id))}`}
              scroll={false}
              className={css.link}
            >
              View details
            </Link>

            <button
              type="button"
              className={css.button}
              onClick={() => mutate(n.id)}
              disabled={deletingId === n.id}
              aria-busy={deletingId === n.id}
            >
              {deletingId === n.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
