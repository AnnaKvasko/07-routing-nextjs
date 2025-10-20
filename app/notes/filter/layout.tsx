import css from "./layout.module.css";

export default function FilterLayout({
  children, // дефолтний слот (контент нотаток)
  sidebar, // паралельний слот @sidebar
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.notesWrapper}>{children}</section>
    </div>
  );
}
