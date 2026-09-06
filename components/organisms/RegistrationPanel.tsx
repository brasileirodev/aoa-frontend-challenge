import type { ReactNode } from "react";
export function RegistrationPanel({ children }: { children: ReactNode }) {
  return (
    <section className="p-6 sm:p-10 lg:p-12" aria-labelledby="register-title">
      <p className="text-xs font-semibold tracking-widest text-brand-700 uppercase">
        Let’s get you set up
      </p>
      <h1
        id="register-title"
        className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900"
      >
        Create your account
      </h1>
      <p className="mt-3 mb-8 text-sm leading-6 text-neutral-500">
        A few details to get your team started.
      </p>
      {children}
    </section>
  );
}
