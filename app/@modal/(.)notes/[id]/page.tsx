"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import NoteDetailsClient from "@/components/NoteDetails/NoteDetailsClient";

export default function NotePreview() {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <Modal open onClose={handleClose}>
      <NoteDetailsClient />
    </Modal>
  );
}
