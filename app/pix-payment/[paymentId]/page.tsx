import { FakePixPaymentScreen } from "@/components/organisms/FakePixPaymentScreen";
import { getPixPayment } from "@/lib/payment-store";

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
