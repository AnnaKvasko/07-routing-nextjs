import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "@/components/NoteDetails/NoteDetailsClient";

type PageProps = { params: { id: string } };

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = params;

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  if (id) {
    try {
      await qc.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
      });
    } catch {}
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
