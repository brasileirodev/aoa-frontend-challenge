import { createPixPayment } from "@/lib/payment-store";
import { getRequestOrigin } from "@/lib/request-origin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  return Response.json(createPixPayment(getRequestOrigin(request)));
}
