"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function ModalWrapper({
  open = true,
  onClose,
  labelledById,
  children,
}: {
  open?: boolean;
  onClose?: () => void;
  labelledById?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    else router.back();
  }, [onClose, router]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={labelledById}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 720,
          background: "white",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close"
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            fontSize: 24,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
