import { FakePixPaymentScreen } from "@aoa/checkout/components/organisms/FakePixPaymentScreen";
import { getPixPayment } from "@aoa/checkout/server/payment-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PixPaymentPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  return (
    <FakePixPaymentScreen
      paymentId={paymentId}
      initialPayment={getPixPayment(paymentId)}
    />
  );
}
