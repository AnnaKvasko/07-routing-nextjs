import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { TAGS, type NoteTag } from "@/types/note";
import NotesClient from "@/app/notes/filter/[[...slug]]/Notes.client";
import type { NotesListResponse } from "@/lib/types";

type PageProps = {
  params: { tag?: string[] };
  searchParams: { page?: string; search?: string };
};

const isNoteTag = (v: string): v is NoteTag => TAGS.includes(v as NoteTag);

export default async function FilteredNotesPage({
  params,
  searchParams,
}: PageProps) {
  const raw = params.tag?.[0];
  const decoded = raw ? decodeURIComponent(raw) : undefined;

  const validTag: NoteTag | undefined =
    decoded && isNoteTag(decoded) ? decoded : undefined;
  const tagKey = validTag ?? "all";

  const pageNum = Number(searchParams.page);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const search = (searchParams.search ?? "").toString();
  const perPage = 12;

  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  try {
    await qc.prefetchQuery<NotesListResponse>({
      queryKey: ["notes", { page, search, perPage, tag: tagKey }],
      queryFn: () =>
        fetchNotes({
          page,
          perPage,
          search: search || undefined,
          tag: validTag,
        }),
      staleTime: 30_000,
    });
  } catch {}

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
        currentTag={tagKey}
      />
    </HydrationBoundary>
  );
}
