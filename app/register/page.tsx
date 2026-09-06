import type { Metadata } from "next";
import { RegistrationTemplate } from "@/components/templates/RegistrationTemplate";
import { Header } from "@/components/organisms/Header";
import { RegistrationBenefits } from "@/components/organisms/RegistrationBenefits";
import { RegistrationPanel } from "@/components/organisms/RegistrationPanel";
import { RegistrationForm } from "@/components/organisms/RegistrationForm";

export const metadata: Metadata = { title: "Create your account" };
export default function RegisterPage() {
  return (
    <RegistrationTemplate header={<Header />} aside={<RegistrationBenefits />}>
      <RegistrationPanel>
        <RegistrationForm />
      </RegistrationPanel>
    </RegistrationTemplate>
  );
}
