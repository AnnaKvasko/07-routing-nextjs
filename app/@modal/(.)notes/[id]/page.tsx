"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

type PageProps = { params: { id: string } };

export default function InterceptedNoteModal({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    retry: false,
    staleTime: 30_000,
  });

  const onClose = () => router.back();

  return (
    <Modal open onClose={onClose}>
      {isLoading && <p>Loading…</p>}
      {isError && <p>Failed to load note</p>}
      {data && <NoteDetailsClient id={id} />}
    </Modal>
  );
}
