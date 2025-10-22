"use client";

import { useRouter, useParams } from "next/navigation";
import ModalWrapper from "./ModalWrapper.client";
import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";

export default function NotePreview() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  
  const handleClose = () => {
    if (typeof window !== "undefined" && window.history.length > 1)
      router.back();
    else router.replace("/notes");
  };

  if (!id) return null;

  return (
    <ModalWrapper open onClose={handleClose} labelledById="note-preview-title">
      <NoteDetailsClient id={id} />
    </ModalWrapper>
  );
}
