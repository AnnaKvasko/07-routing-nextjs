interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchBox({
  value,
  onChange,
  className,
}: SearchBoxProps) {
  return (
    <input
      id="search"
      name="search"
      className={className}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
