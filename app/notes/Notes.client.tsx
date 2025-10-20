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
  currentTag = undefined,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const paramsStr = params.toString(); 

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 400);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const tag = currentTag && currentTag !== "all" ? currentTag : undefined;

  useEffect(() => {
    const pRaw = params.get("page");
    const pNum = Number(pRaw);
    const p = Number.isFinite(pNum) && pNum > 0 ? pNum : initialPage;

    const s = params.get("search") ?? initialSearch;

    if (p !== page) setPage(p);
    if (s !== search) setSearch(s);
   
  }, [paramsStr, initialPage, initialSearch]); // ✅

  const queryKey = [
    "notes",
    { page, search: debouncedSearch, perPage, tag: tag ?? "all" },
  ] as const;

  const { data, isLoading, isError, error, isFetching } =
    useQuery<NotesListResponse>({
      queryKey,
      queryFn: ({ signal }) =>
        fetchNotes({ page, perPage, search: debouncedSearch, tag }, signal),
      placeholderData: (prev) => prev,
    });

  const { items, pages } = useMemo(() => {
    const items = (data as any)?.notes ?? (data as any)?.items ?? [];
    const totalPages =
      (data as any)?.totalPages ??
      ((data as any)?.total
        ? Math.ceil(Number((data as any).total) / perPage)
        : 1);
    return { items, pages: Math.max(1, Number(totalPages) || 1) };
  }, [data, perPage]);


  const basePath =
    currentTag && currentTag !== "all"
      ? `/notes/filter/${encodeURIComponent(currentTag)}`
      : currentTag === "all"
        ? `/notes/filter/all`
        : `/notes`;

  useEffect(() => {
    if (page > pages && pages > 0) {
      const sp = new URLSearchParams(params);
      sp.set("page", "1");
      if (search) sp.set("search", search);
      else sp.delete("search");
      router.replace(`${basePath}?${sp.toString()}`);
    }
  }, [pages, page, params, router, search, basePath]);

  const onPageChange = (nextPage: number) => {
    const sp = new URLSearchParams(params);
    sp.set("page", String(nextPage));
    if (search) sp.set("search", search);
    else sp.delete("search");
    router.push(`${basePath}?${sp.toString()}`);
  };

  const onSearchChange = (val: string) => {
    const sp = new URLSearchParams(params);
    if (val) sp.set("search", val);
    else sp.delete("search");
    sp.set("page", "1");
    router.replace(`${basePath}?${sp.toString()}`);
  };

  return (
    <div className={css.app} aria-busy={isFetching && !isLoading}>
      <header className={css.toolbar}>
        <div className={css.left}>
          <SearchBox
            className={css.input}
            value={search}
            onChange={onSearchChange}
          />
        </div>

        <div className={css.center}>
          {pages > 1 && (
            <Pagination
              pageCount={pages}
              currentPage={page}
              onPageChange={onPageChange}
              className={css.topPagination}
            />
          )}
        </div>

        <div className={css.right}>
          <button
            type="button"
            className={css.button}
            onClick={() => setIsModalOpen(true)}
          >
            Create note +
          </button>
        </div>
      </header>

      {isError && <QueryError error={error} />}

      {isFetching && !isLoading && (
        <small className={css.softLoader}>Updating…</small>
      )}

      {items.length > 0 ? (
        <>
          <NoteList
            notes={items}
            page={page}
            search={debouncedSearch}
            perPage={perPage}
            tagKey={tag ?? "all"} 
          />
          {pages > 1 && (
            <Pagination
              pageCount={pages}
              currentPage={page}
              onPageChange={onPageChange}
              className={css.bottomPagination}
            />
          )}
        </>
      ) : (
        !isLoading &&
        !isError && (
          <p>
            No notes {debouncedSearch ? `for “${debouncedSearch}”` : "yet"}.
          </p>
        )
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 style={{ marginTop: 0 }}>Create note</h2>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
