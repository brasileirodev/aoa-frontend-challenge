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
      <main className="flex flex-1 items-center bg-neutral-50 px-5 py-10 sm:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          {aside}
          {children}
        </div>
      </main>
    </>
  );
}
