// "use client";

// import { useState, useCallback } from "react";
// import Link from "next/link";
// import css from "./TagsMenu.module.css";

// type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

// const tags: Tag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

// export default function TagsMenu() {
//   const [open, setOpen] = useState(false);
//   const toggleMenu = useCallback(() => setOpen((v) => !v), []);
//   const closeMenu = useCallback(() => setOpen(false), []);

//   return (
//     <div className={css.wrap}>
//       <button
//         type="button"
//         className={css.trigger}
//         aria-expanded={open}
//         onClick={toggleMenu}
//       >
//         Tags ▾
//       </button>

//       {open && (
//         <div className={css.menu} role="menu">
//           <Link
//             href="/notes/filter/all"
//             className={css.menuLink}
//             onClick={closeMenu}
//             role="menuitem"
//           >
//             All
//           </Link>

//           {tags.map((tag) => (
//             <Link
//               key={tag}
//               href={`/notes/filter/${encodeURIComponent(tag)}`}
//               className={css.menuLink}
//               onClick={closeMenu}
//               role="menuitem"
//             >
//               {tag}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
const tags: Tag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const toggleMenu = useCallback(() => setOpen((v) => !v), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <div className={css.wrap}>
      <button
        type="button"
        className={css.trigger}
        aria-expanded={open}
        onClick={toggleMenu}
      >
        Tags ▾
      </button>

      {open && (
        <div className={css.menu} role="menu">
          <Link
            href="/notes/filter/all"
            className={css.menuLink}
            onClick={closeMenu}
            role="menuitem"
          >
            All
          </Link>

          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/notes/filter/${encodeURIComponent(tag)}`}
              className={css.menuLink}
              onClick={closeMenu}
              role="menuitem"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
