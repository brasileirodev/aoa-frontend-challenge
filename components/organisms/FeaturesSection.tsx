import { Container } from "@/components/atoms/Container";
import { FeatureCard } from "@/components/molecules/FeatureCard";
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

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-16">
      <Container className="py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Built for teams that plan together
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
          Meridian keeps everyone working from the same plan, whether your team
          sits in one office or across five time zones.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}
