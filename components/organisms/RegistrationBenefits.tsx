export function RegistrationBenefits() {
  return (
    <aside className="relative flex flex-col justify-between overflow-hidden bg-brand-950 p-8 text-white sm:p-10 lg:p-12">
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div>
        <p className="text-xs font-semibold tracking-widest text-brand-200 uppercase">
          A better week starts here
        </p>
        <h2 className="mt-6 max-w-sm text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          Less coordinating.
          <br />
          More moving forward.
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-brand-100">
          Bring your team’s schedules, availability, and priorities into one
          shared space.
        </p>
      </div>
      <div className="relative mt-10 hidden space-y-5 lg:block">
        {[
          "One clear view of your team’s week",
          "Capacity you can plan around",
          "Room for priorities to change",
        ].map((text) => (
          <p
            key={text}
            className="flex items-center gap-3 text-sm text-brand-100"
          >
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-brand-200"
            >
              ✓
            </span>
            {text}
          </p>
        ))}
        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-brand-200">
          Meridian · Team scheduling & planning
        </p>
      </div>
    </aside>
  );
}
