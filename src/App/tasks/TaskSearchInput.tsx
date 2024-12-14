import { useRef } from "react";

export function TaskSearchInput({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      placeholder="Search tasks..."
      className="dawn-big dawn-page-input"
      value={query}
      onChange={(e) => setQuery(e.currentTarget.value)}
    />
  );
}
