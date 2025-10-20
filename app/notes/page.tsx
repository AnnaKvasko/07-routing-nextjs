import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

type PageProps = {
  searchParams: Promise<{ page?: string; search?: string }>;
};

export default async function NotesPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const pageRaw = sp.page;
  const pageNum = Number(pageRaw);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const search = (sp.search ?? '').toString();
  const perPage = 12;

  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  try {
    await qc.prefetchQuery({
      queryKey: ['notes', { page, search, perPage }],
      queryFn: () => fetchNotes({ page, perPage, search }),
    });
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
      />
    </HydrationBoundary>
  );
}
