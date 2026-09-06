import { Card } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";
export function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <Typography as="h3" className="text-lg font-semibold text-neutral-900">
        {title}
      </Typography>
      <Typography className="mt-2 text-sm leading-6 text-neutral-600">
        {description}
      </Typography>
    </Card>
  );
}
