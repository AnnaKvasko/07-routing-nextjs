import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetailsClient";
import type { Note } from "@/types/note";
import { isAxiosError } from "axios";

type PageProps = { params: { id: string } };

export default async function NoteDetailsPage({ params }: PageProps) {
  const id = params?.id;
  if (!id) notFound();

  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  try {
    await qc.prefetchQuery<Note>({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
      staleTime: 30_000,
    });
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) {
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
