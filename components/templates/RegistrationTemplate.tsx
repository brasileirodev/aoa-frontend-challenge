import type { ReactNode } from "react";
export function RegistrationTemplate({
  header,
  aside,
  children,
}: {
  header: ReactNode;
  aside: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {header}
      <main className="flex flex-1 bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
          {aside}
          {children}
        </div>
      </main>
    </>
  );
}
