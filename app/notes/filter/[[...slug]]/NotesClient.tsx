// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useDebounce } from "use-debounce";
// import { useRouter, useSearchParams } from "next/navigation";
// import { fetchNotes } from "@/lib/api";
// import type { NotesListResponse } from "@/lib/types";
// import type { Note, NoteTag } from "@/types/note";
// import NoteList from "@/components/NoteList/NoteList";
// import SearchBox from "@/components/SearchBox/SearchBox";
// import QueryError from "@/components/QueryError/QueryError";
// import Pagination from "@/components/Pagination/Pagination";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import css from "./Notes.module.css";

// type Props = {
//   initialPage: number;
//   initialSearch: string;
//   perPage: number;
//   currentTag?: NoteTag | "all";
// };

// type NotesListResponseAlt = {
//   items: Note[];
//   total: number;
// };

// type ApiResponse = NotesListResponse | NotesListResponseAlt;

// function isAltResponse(data: ApiResponse): data is NotesListResponseAlt {
//   return (data as NotesListResponseAlt).items !== undefined;
// }

// export default function NotesClient({
//   initialPage,
//   initialSearch,
//   perPage,
//   currentTag = undefined,
// }: Props) {
//   const router = useRouter();
//   const params = useSearchParams();
//   const paramsStr = params.toString();

//   const [page, setPage] = useState<number>(initialPage);
//   const [search, setSearch] = useState<string>(initialSearch);
//   const [debouncedSearch] = useDebounce(search, 400);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const tag = useMemo<NoteTag | undefined>(
//     () => (currentTag && currentTag !== "all" ? currentTag : undefined),
//     [currentTag]
//   );

//   useEffect(() => {
//     const pRaw = params.get("page");
//     const pNum = Number(pRaw);
//     const p = Number.isFinite(pNum) && pNum > 0 ? pNum : initialPage;

//     const s = params.get("search") ?? initialSearch;

//     if (p !== page) setPage(p);
//     if (s !== search) setSearch(s);
//   }, [params, paramsStr, initialPage, initialSearch, page, search]);

//   const basePath = useMemo(() => {
//     if (currentTag && currentTag !== "all") {
//       return `/notes/filter/${encodeURIComponent(currentTag)}`;
//     }
//     if (currentTag === "all") return `/notes/filter/all`;
//     return `/notes`;
//   }, [currentTag]);

//   const queryKey = useMemo(
//     () =>
//       [
//         "notes",
//         { page, search: debouncedSearch, perPage, tag: tag ?? "all" },
//       ] as const,
//     [page, debouncedSearch, perPage, tag]
//   );

//   const { data, isLoading, isError, error, isFetching } = useQuery<ApiResponse>(
//     {
//       queryKey,
//       queryFn: ({ signal }) =>
//         fetchNotes(
//           { page, perPage, search: debouncedSearch || undefined, tag },
//           signal
//         ),
//       placeholderData: (prev) => prev,
//       staleTime: 30_000,
//     }
//   );

//   const { items, pages } = useMemo(() => {
//     if (!data) return { items: [] as Note[], pages: 1 };

//     if (isAltResponse(data)) {
//       const total = Number(data.total ?? 0);
//       const totalPages = Math.max(1, Math.ceil(total / perPage));
//       return { items: data.items, pages: totalPages };
//     }

//     const totalPages = Math.max(1, Number(data.totalPages ?? 1));
//     return { items: data.notes, pages: totalPages };
//   }, [data, perPage]);

//   useEffect(() => {
//     if (page > pages && pages > 0) {
//       const sp = new URLSearchParams(params);
//       sp.set("page", "1");
//       if (search) sp.set("search", search);
//       else sp.delete("search");
//       router.replace(`${basePath}?${sp.toString()}`);
//     }
//   }, [pages, page, params, router, search, basePath]);

//   const onPageChange = (nextPage: number) => {
//     const sp = new URLSearchParams(params);
//     sp.set("page", String(nextPage));
//     if (search) sp.set("search", search);
//     else sp.delete("search");
//     router.push(`${basePath}?${sp.toString()}`);
//   };

//   const onSearchChange = (val: string) => {
//     setSearch(val);

//     const sp = new URLSearchParams(params);
//     if (val) sp.set("search", val);
//     else sp.delete("search");
//     sp.set("page", "1");
//     router.replace(`${basePath}?${sp.toString()}`);
//   };

//   return (
//     <div className={css.app} aria-busy={isFetching && !isLoading}>
//       <header className={css.toolbar}>
//         <div className={css.left}>
//           <SearchBox
//             className={css.input}
//             value={search}
//             onChange={onSearchChange}
//           />
//         </div>

//         <div className={css.center}>
//           {pages > 1 && (
//             <Pagination
//               pageCount={pages}
//               currentPage={page}
//               onPageChange={onPageChange}
//               className={css.topPagination}
//             />
//           )}
//         </div>

//         <div className={css.right}>
//           <button
//             type="button"
//             className={css.button}
//             onClick={() => setIsModalOpen(true)}
//           >
//             Create note +
//           </button>
//         </div>
//       </header>

//       {isError && <QueryError error={error} />}

//       {isFetching && !isLoading && (
//         <small className={css.softLoader}>Updating…</small>
//       )}

//       {items.length > 0 ? (
//         <>
//           <NoteList
//             notes={items}
//             page={page}
//             search={debouncedSearch}
//             perPage={perPage}
//             tagKey={tag ?? "all"}
//           />
//           {pages > 1 && (
//             <Pagination
//               pageCount={pages}
//               currentPage={page}
//               onPageChange={onPageChange}
//               className={css.bottomPagination}
//             />
//           )}
//         </>
//       ) : (
//         !isLoading &&
//         !isError && (
//           <p>
//             No notes {debouncedSearch ? `for “${debouncedSearch}”` : "yet"}.
//           </p>
//         )
//       )}

//       <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <h2 style={{ marginTop: 0 }}>Create note</h2>
//         <NoteForm onCancel={() => setIsModalOpen(false)} />
//       </Modal>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import type { NotesListResponse } from "@/lib/types";
import type { NoteTag } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import QueryError from "@/components/QueryError/QueryError";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./Notes.module.css";

type Props = {
  initialPage: number;
  initialSearch: string;
  perPage: number;
  currentTag?: NoteTag | "all";
};

export default function NotesClient({
  initialPage,
  initialSearch,
  perPage,
  currentTag = "all",
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  // ❗ Використовуємо ТІЛЬКИ рядок, НЕ сам об'єкт params у ефектах
  const paramsStr = params.toString();

  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch] = useDebounce<string>(search, 400);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const tag = useMemo<NoteTag | undefined>(
    () => (currentTag && currentTag !== "all" ? currentTag : undefined),
    [currentTag]
  );

  // ✅ Ефект читає paramsStr, а НЕ params; перелік залежностей коректний
  useEffect(() => {
    const local = new URLSearchParams(paramsStr);

    const pRaw = local.get("page");
    const pNum = Number(pRaw);
    const nextPage = Number.isFinite(pNum) && pNum > 0 ? pNum : initialPage;

    const nextSearch = local.get("search") ?? initialSearch;

    if (nextPage !== page) setPage(nextPage);
    if (nextSearch !== search) setSearch(nextSearch);
  }, [paramsStr, initialPage, initialSearch, page, search]);

  const basePath = useMemo(() => {
    if (currentTag && currentTag !== "all")
      return `/notes/filter/${encodeURIComponent(currentTag)}`;
    if (currentTag === "all") return `/notes/filter/all`;
    return `/notes`;
  }, [currentTag]);

  const queryKey = useMemo(
    () =>
      [
        "notes",
        { page, search: debouncedSearch, perPage, tag: tag ?? "all" },
      ] as const,
    [page, debouncedSearch, perPage, tag]
  );

  // ✅ ЖОДНОГО any — явно вказуємо всі типи
  const { data, isLoading, isError, error, isFetching } = useQuery<
    NotesListResponse,
    Error
  >({
    queryKey,
    queryFn: ({
      signal,
    }: {
      signal?: AbortSignal;
    }): Promise<NotesListResponse> =>
      fetchNotes(
        { page, perPage, search: debouncedSearch || undefined, tag },
        signal
      ),
    placeholderData: (
      prev: NotesListResponse | undefined
    ): NotesListResponse | undefined => prev,
    staleTime: 30_000,
  });

  const pages: number = data?.totalPages ?? 1;
  const items = data?.notes ?? [];

  // ✅ Другий ефект не читає params; перелік залежностей валідний
  useEffect(() => {
    const sp = new URLSearchParams();
    if (page && page !== 1) sp.set("page", String(page));
    if (search.trim()) sp.set("search", search.trim());
    const qs = sp.toString();
    router.replace(qs ? `${basePath}?${qs}` : basePath);
  }, [page, search, basePath, router]);

  // ✅ Хендлери з явними типами
  const onPageChange = (nextPage: number): void => setPage(nextPage);
  const onSearchChange = (value: string): void => setSearch(value);

  return (
    <div className={css.app} aria-busy={isFetching && !isLoading}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={onSearchChange} />
        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isError && <QueryError error={error} />}

      {items.length > 0 && (
        <NoteList
          notes={items}
          page={page}
          search={debouncedSearch}
          perPage={perPage}
          tagKey={tag ?? "all"}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <p>No notes {debouncedSearch ? `for “${debouncedSearch}”` : "yet"}.</p>
      )}

      {pages > 1 && (
        <Pagination
          pageCount={pages}
          currentPage={page}
          onPageChange={onPageChange}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 style={{ marginTop: 0 }}>Create note</h2>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
