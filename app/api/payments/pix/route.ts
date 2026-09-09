import { createPixPayment } from "@/lib/payment-store";
import { getRequestOrigin } from "@/lib/request-origin";

export async function POST(request: Request) {
  return Response.json(createPixPayment(getRequestOrigin(request)));
}
