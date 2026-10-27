import { createPixPayment } from "@aoa/checkout/server/payment-store";
import { getRequestOrigin } from "@shared/server/request-origin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  return Response.json(createPixPayment(getRequestOrigin(request)));
}
