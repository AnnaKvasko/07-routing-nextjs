import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import NotesClient from "../../Notes.client"; // можна перевикористати існуючий
import type { NotesListResponse } from "@/lib/types";

type PageProps = {
  params: Promise<{ tag?: string[] }>; // async params
  searchParams: Promise<{ page?: string; search?: string }>; // async searchParams
};

export default async function FilteredNotesPage({
  params,
  searchParams,
}: PageProps) {
  const p = await params;
  const sp = await searchParams;

  const tagFromUrl = p.tag?.[0]; // 'all' | 'Work' | undefined
  const isAll = !tagFromUrl || tagFromUrl === "all";
  const tag = isAll ? undefined : (tagFromUrl as NoteTag);

  const pageNum = Number(sp.page);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
  const search = (sp.search ?? "").toString();
  const perPage = 12;

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  try {
    await qc.prefetchQuery<NotesListResponse>({
      queryKey: ["notes", { page, search, perPage, tag: tag ?? "all" }],
      queryFn: () => fetchNotes({ page, perPage, search, tag }), // ← передаємо tag тільки, якщо він є
    });
  } catch {
    // тихо ігноруємо; клієнтський компонент покаже помилку
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      {/* перевикористовуємо NotesClient, але передаємо currentTag */}
      <NotesClient
        initialPage={page}
        initialSearch={search}
        perPage={perPage}
        currentTag={tag ?? "all"}
      />
    </HydrationBoundary>
  );
}
