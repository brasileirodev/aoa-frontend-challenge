export function RequirementList({
  id,
  items,
}: {
  id: string;
  items: { label: string; met: boolean }[];
}) {
  return (
    <ul id={id} className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
      {items.map(({ label, met }) => (
        <li key={label} className={met ? "text-green-700" : "text-neutral-500"}>
          <span aria-hidden="true" className="mr-2">
            {met ? "✓" : "○"}
          </span>
          <span className="sr-only">{met ? "Met: " : "Not met: "}</span>
          {label}
        </li>
      ))}
    </ul>
  );
}
