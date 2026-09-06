import { Container } from "@/components/atoms/Container";
import { Link } from "@/components/atoms/Link";
export function HomeHero() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <Container className="py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">
            Team scheduling and planning
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-neutral-900">
            Plan your team&apos;s week in minutes
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Meridian brings schedules, availability, and priorities into one
            shared view, so your team spends less time coordinating and more
            time doing the work that matters.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/register" appearance="primary">
              Get started
            </Link>
            <Link href="#features" appearance="secondary">
              See how it works
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
