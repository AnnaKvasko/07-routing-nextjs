import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NotesListResponse } from "@/lib/types";
import NotesClient from "./filter/[[...slug]]/Notes.client";

type PageProps = {
  searchParams?: { page?: string; search?: string };
};

export default async function NotesPage({ searchParams }: PageProps) {
  const sp = searchParams ?? {};

  const pageNum = Number(sp.page);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  const search = (sp.search ?? "").toString();
  const perPage = 12;

  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  try {
    await qc.prefetchQuery<NotesListResponse>({
      queryKey: ["notes", { page, search, perPage, tag: "all" }],
      queryFn: () => fetchNotes({ page, perPage, search }),
      staleTime: 30_000,
    });
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
        currentTag="all"
      />
    </HydrationBoundary>
  );
}
