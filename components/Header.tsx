import Link from "next/link";
import { Container } from "@/components/Container";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-neutral-900"
        >
          Meridian
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Home
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Sign up
          </Link>
        </nav>
      </Container>
    </header>
  );
}
