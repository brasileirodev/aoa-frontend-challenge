import { getPixPayment } from "@aoa/checkout/server/payment-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  const { paymentId } = await params;

  return Response.json(getPixPayment(paymentId));
}
