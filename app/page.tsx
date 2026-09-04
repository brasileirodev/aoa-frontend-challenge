import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";

const features = [
  {
    title: "Shared schedules",
    description:
      "Every team's week lives in one place, so plans stay visible and nothing falls between calendars.",
  },
  {
    title: "Capacity at a glance",
    description:
      "See who has room this week and who is stretched, before work gets assigned instead of after.",
  },
  {
    title: "Plans that keep up",
    description:
      "When priorities shift, schedules update everywhere at once and everyone sees the same picture.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
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
                <Button size="lg">Get started</Button>
                <Button variant="secondary" size="lg">
                  See how it works
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container className="py-20">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Built for teams that plan together
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
              Meridian keeps everyone working from the same plan, whether your
              team sits in one office or across five time zones.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <footer className="border-t border-neutral-200">
        <Container className="py-8">
          <p className="text-sm text-neutral-500">Meridian</p>
        </Container>
      </footer>
    </>
  );
}
