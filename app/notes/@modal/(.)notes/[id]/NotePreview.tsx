"use client";

import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/components/NoteDetails/NoteDetailsClient";

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
    <Modal open onClose={handleClose} labelledById="note-preview-title">
      <NoteDetailsClient id={id} />
    </Modal>
  );
}
