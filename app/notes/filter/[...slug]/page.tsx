import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NotesListResponse } from "@/lib/types";
import { TAGS, type NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

const isNoteTag = (v: string): v is NoteTag => TAGS.includes(v as NoteTag);

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<{ page?: string; search?: string }>;
};

export default async function NotesPage({ params, searchParams }: PageProps) {
  const { slug = [] } = await params;
  const sp = (await searchParams) ?? {};

  const raw = slug[0] ?? "all";
  const validTag: NoteTag | undefined =
    raw === "all" ? undefined : isNoteTag(raw) ? (raw as NoteTag) : undefined;
  const tagKey = validTag ?? "all";

  const pageNum = Number(sp.page);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const search = (sp.search ?? "").toString();
  const perPage = 12;

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

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
