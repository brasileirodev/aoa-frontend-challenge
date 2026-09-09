import { markPixPaymentPaid } from "@/lib/payment-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  const { paymentId } = await params;

  return Response.json(markPixPaymentPaid(paymentId));
}
