// import {
//   HydrationBoundary,
//   QueryClient,
//   dehydrate,
// } from "@tanstack/react-query";
// import { fetchNoteById } from "@/lib/api";
// import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

// type PageProps = {
//   params: Promise<{ id: string }>;
// };

// export default async function NoteModalPage({ params }: PageProps) {
//   const { id } = await params;

//   const qc = new QueryClient();

//   await qc.prefetchQuery({
//     queryKey: ["note", id],
//     queryFn: ({ signal }) => fetchNoteById(id, signal),
//   });

//   return (
//     <HydrationBoundary state={dehydrate(qc)}>
//       <NoteDetailsClient id={id} />
//     </HydrationBoundary>
//   );
// }
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";
import { isAxiosError } from "axios";
import type { Note } from "@/types/note";

type PageProps = { params: Promise<{ id: string }> };

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  if (!id) notFound();

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  try {
    await qc.prefetchQuery<Note>({
      queryKey: ["note", id],
      queryFn: ({ signal }) => fetchNoteById(id, signal), // ← важливо: прокинь signal
      staleTime: 30_000,
    });
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 404) {
      notFound();
    }
    // інші помилки не ховаємо — нехай впадуть у error boundary, або додай свою обробку
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
