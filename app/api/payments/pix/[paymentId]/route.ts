import { getPixPayment } from "@/lib/payment-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  const { paymentId } = await params;

  return Response.json(getPixPayment(paymentId));
}
