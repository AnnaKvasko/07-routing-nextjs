"use client";

import Link from "next/link";
import { ALL_TAGS } from "@/types/note";
import css from "./SidebarNotes.module.css";

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {ALL_TAGS.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${encodeURIComponent(tag.toLowerCase())}`}
            className={css.menuLink}
          >
            {tag === "All" ? "All notes" : tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
