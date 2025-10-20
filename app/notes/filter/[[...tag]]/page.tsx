import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "../../Notes.client";
import type { NotesListResponse } from "@/lib/types";

type PageProps = {
  params: { tag?: string[] };
  searchParams: { page?: string; search?: string };
};

export default async function FilteredNotesPage({
  params,
  searchParams,
}: PageProps) {
  const raw = params.tag?.[0];
  const decoded = raw ? decodeURIComponent(raw) : undefined;
  const isAll = !decoded || decoded.toLowerCase() === "all";
  const tag = isAll ? undefined : (decoded as NoteTag);

  const pageNum = Number(searchParams.page);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const search = (searchParams.search ?? "").toString();
  const perPage = 12;

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  try {
    await qc.prefetchQuery<NotesListResponse>({
      queryKey: ["notes", { page, search, perPage, tag: tag ?? "all" }],
      queryFn: () => fetchNotes({ page, perPage, search, tag }),
    });
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
        currentTag={tag ?? "all"}
      />
    </HydrationBoundary>
  );
}
