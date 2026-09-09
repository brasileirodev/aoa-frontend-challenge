import { cardPaymentSchema } from "@/lib/payment";

export async function POST(request: Request) {
  const result = cardPaymentSchema.safeParse(await request.json());

  if (!result.success) {
    return Response.json(
      {
        method: "card",
        success: false,
        message: "Invalid simulated card data.",
      },
      { status: 400 },
    );
  }

  return Response.json({
    method: "card",
    success: true,
    message: "Simulated card payment approved.",
  });
}
