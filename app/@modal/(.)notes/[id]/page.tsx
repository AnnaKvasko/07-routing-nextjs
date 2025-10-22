import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";
import { isAxiosError } from "axios";
import type { Note } from "@/types/note";
import ModalWrapper from "@/app/@modal/(.)notes/[id]/ModalWrapper.client";

type PageProps = { params: Promise<{ id: string }> };

export default async function InterceptedNoteModal({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  try {
    await qc.prefetchQuery<Note>({
      queryKey: ["note", id],
      queryFn: ({ signal }) => fetchNoteById(id, signal),
      staleTime: 30_000,
    });
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) notFound();
    throw e;
  }

  return (
    <ModalWrapper>
      <HydrationBoundary state={dehydrate(qc)}>
        <NoteDetailsClient id={id} />
      </HydrationBoundary>
    </ModalWrapper>
  );
}
