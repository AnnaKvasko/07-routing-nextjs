import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  if (id) {
    try {
      await qc.prefetchQuery({
        queryKey: ['note', id],
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
