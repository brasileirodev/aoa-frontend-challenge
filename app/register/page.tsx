import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Create your account",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center py-16">
        <Container className="max-w-md">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-900">
            Create your account
          </h1>
        </Container>
      </main>
    </>
  );
}
