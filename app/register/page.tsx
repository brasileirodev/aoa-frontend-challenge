import type { Metadata } from "next";
import { RegistrationTemplate } from "@/components/templates/RegistrationTemplate";
import { Header } from "@/components/organisms/Header";
import { RegistrationBenefits } from "@/components/organisms/RegistrationBenefits";
import { RegistrationPanel } from "@/components/organisms/RegistrationPanel";
import { RegistrationForm } from "@/components/organisms/RegistrationForm";
import { getPlans } from "@/lib/api/plans";

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
