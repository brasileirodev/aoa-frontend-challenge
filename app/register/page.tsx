import type { Metadata } from "next";
import { RegistrationTemplate } from "@aoa/checkout/components/templates/RegistrationTemplate";
import { Header } from "@aoa/marketing/components/organisms/Header";
import { RegistrationBenefits } from "@aoa/checkout/components/organisms/RegistrationBenefits";
import { RegistrationPanel } from "@aoa/checkout/components/organisms/RegistrationPanel";
import { RegistrationForm } from "@aoa/checkout/components/organisms/RegistrationForm";
import { getPlans } from "@aoa/checkout/services/plans";

export const metadata: Metadata = { title: "Create your account" };

export default async function RegisterPage() {
  const plans = await getPlans();

  return (
    <RegistrationTemplate header={<Header />} aside={<RegistrationBenefits />}>
      <RegistrationPanel>
        <RegistrationForm plans={plans} />
      </RegistrationPanel>
    </RegistrationTemplate>
  );
}
