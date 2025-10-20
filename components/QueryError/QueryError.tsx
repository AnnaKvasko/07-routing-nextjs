"use client";

export default function QueryError({ error }: { error: unknown }) {
  if (error instanceof Error) {
    return <p style={{ color: "red" }}>Error: {error.message}</p>;
  }

  return <p style={{ color: "red" }}>Something went wrong.</p>;
}