import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PixPaymentPage from "@/app/pix-payment/[paymentId]/page";
import { POST as processPayment } from "@/app/api/payments/route";
import { POST as createPix } from "@/app/api/payments/pix/route";
import { GET as getPix } from "@/app/api/payments/pix/[paymentId]/route";
import { POST as payPix } from "@/app/api/payments/pix/[paymentId]/pay/route";
import { FakePixPaymentScreen } from "@/components/organisms/FakePixPaymentScreen";
import { PaymentStep } from "@/components/organisms/PaymentStep";
import {
  confirmPixPayment,
  createPixPaymentRequest,
  getPixPaymentStatus,
  processCardPayment,
} from "@/lib/api/payments";
import {
  detectCardBrand,
  detectIssuingBank,
  formatCardNumber,
  formatCvc,
  formatExpirationDate,
  getCardFeedback,
  isFutureExpiration,
  isValidCardNumber,
  onlyDigits,
  type CardPaymentInput,
} from "@/lib/payment";
import {
  createPixPayment as createStoredPixPayment,
  getPixPayment,
  markPixPaymentPaid,
  resetPixPaymentStore,
} from "@/lib/payment-store";
import { createQrCodeDataUrl } from "@/lib/qr-code";
import { getRequestOrigin } from "@/lib/request-origin";
import { useCheckoutStore } from "@/lib/stores/checkout-store";

const validCard: CardPaymentInput = {
  method: "card",
  cardholderName: "Alex Test",
  cardNumber: "4111111111111111",
  expirationDate: "12/35",
  cvc: "123",
  billingPostalCode: "10001",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  resetPixPaymentStore();
  useCheckoutStore.getState().resetCheckout();
});

describe("payment domain and fake APIs", () => {
  it("detects card brand, bank, digits, expiration and Luhn validity", () => {
    expect(onlyDigits("4111 1111-1111")).toBe("411111111111");
    expect(detectCardBrand("4111111111111111")).toBe("Visa");
    expect(detectCardBrand("5555555555554444")).toBe("Mastercard");
    expect(detectCardBrand("378282246310005")).toBe("American Express");
    expect(detectCardBrand("4011781234567890")).toBe("Elo");
    expect(detectCardBrand("9999999999999999")).toBe("Unknown brand");
    expect(detectIssuingBank("5555555555554444")).toBe("Northwind Credit");
    expect(detectIssuingBank("378282246310005")).toBe("Contoso Premium");
    expect(detectIssuingBank("4011781234567890")).toBe("Fabrikam Digital");
    expect(detectIssuingBank("9999999999999999")).toBe("Unknown bank");
    expect(getCardFeedback("4111111111111111")).toEqual({
      brand: "Visa",
      bank: "Meridian Demo Bank",
    });
    expect(formatCardNumber("4111abc111111111111999")).toBe(
      "4111 1111 1111 1111",
    );
    expect(formatExpirationDate("123599")).toBe("12/35");
    expect(formatExpirationDate("1")).toBe("1");
    expect(formatCvc("1234abc")).toBe("123");
    expect(isFutureExpiration("bad")).toBe(false);
    expect(isFutureExpiration("01/20", new Date(2026, 0, 1))).toBe(false);
    expect(isFutureExpiration("12/35", new Date(2026, 0, 1))).toBe(true);
    expect(isValidCardNumber("4111111111111111")).toBe(true);
    expect(isValidCardNumber("5555555555554444")).toBe(true);
    expect(isValidCardNumber("4111111111112")).toBe(false);
    expect(isValidCardNumber("411")).toBe(false);
  });

  it("stores Pix attempts in memory, isolates ids and expires stale attempts", () => {
    const first = createStoredPixPayment("https://app.test", 1000);
    const second = createStoredPixPayment("https://app.test", 2000);

    expect(first.paymentId).toBe("pix-0001");
    expect(second.paymentId).toBe("pix-0002");
    expect(first.paymentUrl).toBe("https://app.test/pix-payment/pix-0001");
    expect(getPixPayment("missing")).toEqual({ status: "missing" });
    expect(markPixPaymentPaid(first.paymentId, 3000)).toMatchObject({
      paymentId: first.paymentId,
      status: "paid",
    });
    expect(getPixPayment(second.paymentId, second.expiresAt + 1)).toMatchObject(
      {
        paymentId: second.paymentId,
        status: "expired",
      },
    );
    expect(markPixPaymentPaid("missing")).toEqual({ status: "missing" });
  });

  it("handles card and Pix route handlers", async () => {
    const invalidCardResponse = await processPayment(
      new Request("https://app.test/api/payments", {
        method: "POST",
        body: JSON.stringify({ method: "card" }),
      }),
    );
    const validCardResponse = await processPayment(
      new Request("https://app.test/api/payments", {
        method: "POST",
        body: JSON.stringify(validCard),
      }),
    );
    const createdPixResponse = await createPix(
      new Request("http://localhost:3000/api/payments/pix", {
        method: "POST",
        headers: { origin: "http://192.168.1.23:3000" },
      }),
    );
    const createdPix = await createdPixResponse.json();
    const pendingPixResponse = await getPix(new Request("https://app.test"), {
      params: Promise.resolve({ paymentId: createdPix.paymentId }),
    });
    const paidPixResponse = await payPix(new Request("https://app.test"), {
      params: Promise.resolve({ paymentId: createdPix.paymentId }),
    });
    const missingPixResponse = await getPix(new Request("https://app.test"), {
      params: Promise.resolve({ paymentId: "missing" }),
    });

    expect(invalidCardResponse.status).toBe(400);
    await expect(invalidCardResponse.json()).resolves.toMatchObject({
      success: false,
    });
    await expect(validCardResponse.json()).resolves.toMatchObject({
      success: true,
    });
    expect(createdPix.paymentId).toBe("pix-0001");
    expect(createdPix.paymentUrl).toBe(
      "http://192.168.1.23:3000/pix-payment/pix-0001",
    );
    await expect(pendingPixResponse.json()).resolves.toMatchObject({
      paymentId: createdPix.paymentId,
      status: "pending",
    });
    await expect(paidPixResponse.json()).resolves.toMatchObject({
      paymentId: createdPix.paymentId,
      status: "paid",
    });
    await expect(missingPixResponse.json()).resolves.toEqual({
      status: "missing",
    });
  });

  it("calls payment client helpers", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === "/api/payments") {
        return jsonResponse({ method: "card", success: true, message: "ok" });
      }
      if (url === "/api/payments/pix") {
        return jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "pending",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "copy",
          paymentUrl: "/pix-payment/pix-0001",
        });
      }
      if (url === "/api/payments/pix/pix-0001/pay") {
        return jsonResponse({ status: "paid" });
      }
      return jsonResponse({ status: "pending" });
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(processCardPayment(validCard)).resolves.toMatchObject({
      success: true,
    });
    await expect(createPixPaymentRequest()).resolves.toMatchObject({
      paymentId: "pix-0001",
    });
    await expect(getPixPaymentStatus("pix-0001")).resolves.toEqual({
      status: "pending",
    });
    await expect(confirmPixPayment("pix-0001")).resolves.toEqual({
      status: "paid",
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("encapsulates QR Code generation behind the project helper", async () => {
    await expect(createQrCodeDataUrl("/pix-payment/pix-0001")).resolves.toMatch(
      /^data:image\/png;base64,/,
    );
  });

  it("resolves request origin from the browser-facing headers first", () => {
    expect(
      getRequestOrigin(
        new Request("http://localhost:3000/api/payments/pix", {
          headers: { origin: "http://192.168.1.23:3000" },
        }),
      ),
    ).toBe("http://192.168.1.23:3000");
    expect(
      getRequestOrigin(
        new Request("http://localhost:3000/api/payments/pix", {
          headers: { referer: "https://meridian.example/register" },
        }),
      ),
    ).toBe("https://meridian.example");
    expect(
      getRequestOrigin(
        new Request("http://localhost:3000/api/payments/pix", {
          headers: { referer: "not-a-url" },
        }),
      ),
    ).toBe("http://localhost:3000");
    expect(
      getRequestOrigin(
        new Request("http://localhost:3000/api/payments/pix", {
          headers: {
            "x-forwarded-host": "checkout.example",
            "x-forwarded-proto": "https",
          },
        }),
      ),
    ).toBe("https://checkout.example");
    expect(
      getRequestOrigin(
        new Request("http://localhost:3000/api/payments/pix", {
          headers: { "x-forwarded-host": "checkout.example" },
        }),
      ),
    ).toBe("https://checkout.example");
    expect(
      getRequestOrigin(
        new Request("http://localhost:3000/api/payments/pix", {
          headers: { host: "10.0.0.20:3000" },
        }),
      ),
    ).toBe("http://10.0.0.20:3000");
    expect(
      getRequestOrigin(new Request("http://localhost:3000/api/payments/pix")),
    ).toBe("http://localhost:3000");
  });
});

describe("payment UI", () => {
  function preparePaymentStep({
    method = "card",
    paymentSuccessful = false,
  }: {
    method?: "card" | "pix";
    paymentSuccessful?: boolean;
  } = {}) {
    const store = useCheckoutStore.getState();

    store.changePaymentMethod(method);
    if (paymentSuccessful) store.confirmPayment({ method: "pix" });
  }

  it("validates and processes the simulated card form", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          method: "card",
          success: true,
          message: "Simulated card payment approved.",
        }),
      ),
    );
    preparePaymentStep();

    render(<PaymentStep />);

    expect(screen.getByText("Brand: Unknown brand")).toBeVisible();
    await user.click(
      screen.getByRole("button", {
        name: "Process simulated card payment",
      }),
    );

    expect(await screen.findByText("Enter the cardholder name.")).toBeVisible();
    await user.type(screen.getByLabelText("Cardholder name"), "Alex Test");
    await user.type(
      screen.getByLabelText("Card number"),
      "4111abc111111111111999",
    );
    await user.type(screen.getByLabelText("Expiration date"), "123599");
    await user.type(screen.getByLabelText("CVC"), "1234abc");
    await user.type(screen.getByLabelText("Billing postal code"), "10001");

    expect(screen.getByLabelText("Card number")).toHaveValue(
      "4111 1111 1111 1111",
    );
    expect(screen.getByLabelText("Expiration date")).toHaveValue("12/35");
    expect(screen.getByLabelText("CVC")).toHaveValue("123");
    expect(screen.getByText("Brand: Visa")).toBeVisible();
    expect(screen.getByText("Bank: Meridian Demo Bank")).toBeVisible();
    await user.click(
      screen.getByRole("button", {
        name: "Process simulated card payment",
      }),
    );

    expect(
      await screen.findByText("Simulated card payment approved."),
    ).toBeVisible();
    expect(useCheckoutStore.getState().paymentSuccessful).toBe(true);
  });

  it("shows a warning when simulated card processing is refused", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          method: "card",
          success: false,
          message: "Invalid simulated card data.",
        }),
      ),
    );
    preparePaymentStep();

    render(<PaymentStep />);

    await user.type(screen.getByLabelText("Cardholder name"), "Alex Test");
    await user.type(screen.getByLabelText("Card number"), "4111111111111111");
    await user.type(screen.getByLabelText("Expiration date"), "12/35");
    await user.type(screen.getByLabelText("CVC"), "123");
    await user.type(screen.getByLabelText("Billing postal code"), "10001");
    await user.click(
      screen.getByRole("button", {
        name: "Process simulated card payment",
      }),
    );

    expect(
      await screen.findByText("Invalid simulated card data."),
    ).toBeVisible();
    expect(useCheckoutStore.getState().paymentSuccessful).toBe(false);
  });

  it("automatically creates Pix QR Code data and polls pending and paid statuses", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "paid",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "MERIDIAN-PIX-PIX-0001",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "pending",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "MERIDIAN-PIX-PIX-0001",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "pending",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "MERIDIAN-PIX-PIX-0001",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "paid",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "MERIDIAN-PIX-PIX-0001",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    preparePaymentStep();

    render(<PaymentStep paymentStatusPollingMs={100} />);

    await user.click(screen.getByRole("button", { name: "Pix" }));
    expect(await screen.findByText("MERIDIAN-PIX-PIX-0001")).toBeVisible();
    expect(
      await screen.findByAltText("QR Code for fake Pix payment"),
    ).toHaveAttribute("src", expect.stringMatching(/^data:image\/png;base64,/));
    expect(
      screen.getByText(/Scan this QR Code with another device/),
    ).toBeVisible();
    expect(screen.getByText("Waiting for Pix confirmation")).toBeVisible();
    expect(screen.getByText(/Valid for/)).toBeVisible();
    expect(
      screen.getByText(
        "Keep this page open after paying. Confirmation updates automatically.",
      ),
    ).toBeVisible();
    expect(
      screen.queryByText("Pix payment is not confirmed yet."),
    ).not.toBeInTheDocument();
    expect(useCheckoutStore.getState().paymentMethod).toBe("pix");
    expect(
      await screen.findByText("Pix payment confirmed in the simulated flow."),
    ).toBeVisible();
    expect(useCheckoutStore.getState().paymentSuccessful).toBe(true);
    expect(
      screen.getByText("Payment confirmed in the simulated checkout."),
    ).toBeVisible();
  });

  it("automatically creates Pix QR Code data when the Pix view is mounted", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "pending",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "MERIDIAN-PIX-PIX-0001",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      ),
    );
    preparePaymentStep({ method: "pix" });

    render(<PaymentStep />);

    expect(await screen.findByText("MERIDIAN-PIX-PIX-0001")).toBeVisible();
    expect(
      screen.queryByText("Select Pix again to generate the QR Code."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Create fake Pix data to continue."),
    ).not.toBeInTheDocument();
  });

  it("shows a Pix load failure fallback with refresh action", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    preparePaymentStep({ method: "pix" });

    render(<PaymentStep />);

    expect(
      await screen.findByText("We could not load the Pix payment."),
    ).toBeVisible();
    expect(
      screen.getByText("Refresh the Pix payment and try again."),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Generate a new Pix" }),
    ).toBeVisible();
  });

  it("replaces Pix QR Code with refresh action when remote status expires", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation(() =>
          Promise.resolve(
            jsonResponse({
              paymentId: "pix-0001",
              method: "pix",
              status: "expired",
              createdAt: 1,
              expiresAt: 2,
              copyCode: "MERIDIAN-PIX-PIX-0001",
              paymentUrl: "/pix-payment/pix-0001",
            }),
          ),
        )
        .mockResolvedValueOnce(
          jsonResponse({
            paymentId: "pix-0001",
            method: "pix",
            status: "pending",
            createdAt: 1,
            expiresAt: 2,
            copyCode: "MERIDIAN-PIX-PIX-0001",
            paymentUrl: "/pix-payment/pix-0001",
          }),
        )
        .mockResolvedValueOnce(
          jsonResponse({
            paymentId: "pix-0001",
            method: "pix",
            status: "expired",
            createdAt: 1,
            expiresAt: 2,
            copyCode: "MERIDIAN-PIX-PIX-0001",
            paymentUrl: "/pix-payment/pix-0001",
          }),
        ),
    );
    preparePaymentStep({ method: "pix" });

    render(<PaymentStep paymentStatusPollingMs={10} />);

    expect(await screen.findByText("MERIDIAN-PIX-PIX-0001")).toBeVisible();
    expect(
      await screen.findByText("This simulated Pix payment was expired."),
    ).toBeVisible();
    expect(
      screen.queryByAltText("QR Code for fake Pix payment"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate a new Pix" }),
    ).toBeVisible();
  });

  it("shows Pix load fallback when the status endpoint loses the attempt", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation(() =>
          Promise.resolve(
            jsonResponse({
              status: "missing",
            }),
          ),
        )
        .mockResolvedValueOnce(
          jsonResponse({
            paymentId: "pix-0001",
            method: "pix",
            status: "pending",
            createdAt: 1,
            expiresAt: 2,
            copyCode: "MERIDIAN-PIX-PIX-0001",
            paymentUrl: "/pix-payment/pix-0001",
          }),
        ),
    );
    preparePaymentStep({ method: "pix" });

    render(<PaymentStep paymentStatusPollingMs={10} />);

    expect(await screen.findByText("MERIDIAN-PIX-PIX-0001")).toBeVisible();
    expect(
      await screen.findByText("We could not load the Pix payment."),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Generate a new Pix" }),
    ).toBeVisible();
  });

  it("keeps Pix countdown pending before it reaches zero", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "pending",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "MERIDIAN-PIX-PIX-0001",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      ),
    );
    preparePaymentStep({ method: "pix" });

    render(
      <PaymentStep
        pixCountdownTickMs={100}
        pixExpirationSeconds={3}
        paymentStatusPollingMs={600000}
      />,
    );

    expect(await screen.findByText("MERIDIAN-PIX-PIX-0001")).toBeVisible();
    expect(await screen.findByText("Valid for 0:02")).toBeVisible();
    expect(
      screen.queryByText("This simulated Pix payment was expired."),
    ).not.toBeInTheDocument();
  });

  it("keeps Pix creation disabled when payment is already successful", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    preparePaymentStep({ method: "pix", paymentSuccessful: true });

    render(<PaymentStep />);

    expect(
      screen.getByText("Payment confirmed in the simulated checkout."),
    ).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("expires Pix QR Code when the local countdown reaches zero", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "pending",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "MERIDIAN-PIX-PIX-0001",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      ),
    );
    preparePaymentStep({ method: "pix" });

    render(
      <PaymentStep
        pixCountdownTickMs={10}
        pixExpirationSeconds={1}
        paymentStatusPollingMs={600000}
      />,
    );

    expect(await screen.findByText("MERIDIAN-PIX-PIX-0001")).toBeVisible();

    expect(
      await screen.findByText("This simulated Pix payment was expired."),
    ).toBeVisible();
    expect(
      screen.getByText("Pix expired. Refresh the Pix payment and try again."),
    ).toBeVisible();
    expect(
      screen.queryByAltText("QR Code for fake Pix payment"),
    ).not.toBeInTheDocument();
  });

  it("shows Pix QR Code loading feedback while creating payment data", async () => {
    const user = userEvent.setup();
    let resolvePix!: (response: Response) => void;
    const pixPromise = new Promise<Response>((resolve) => {
      resolvePix = resolve;
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(() => pixPromise),
    );
    preparePaymentStep();

    render(<PaymentStep />);

    await user.click(screen.getByRole("button", { name: "Pix" }));
    expect(await screen.findByText("Generating QR Code...")).toBeVisible();
    expect(screen.getByText("Creating fake Pix data...")).toBeVisible();
    resolvePix(
      jsonResponse({
        paymentId: "pix-0001",
        method: "pix",
        status: "pending",
        createdAt: 1,
        expiresAt: 2,
        copyCode: "MERIDIAN-PIX-PIX-0001",
        paymentUrl: "/pix-payment/pix-0001",
      }),
    );
    expect(await screen.findByText("MERIDIAN-PIX-PIX-0001")).toBeVisible();
  });

  it("refreshes the fake Pix page and marks Pix as paid", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          paymentId: "pix-0001",
          method: "pix",
          status: "pending",
          createdAt: 1,
          expiresAt: 2,
          copyCode: "copy",
          paymentUrl: "/pix-payment/pix-0001",
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ status: "paid" }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <FakePixPaymentScreen
        paymentId="pix-0001"
        initialPayment={{ status: "missing" }}
      />,
    );

    expect(await screen.findByText("Fake Pix status: missing.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Refresh status" }));
    expect(await screen.findByText("Fake Pix status: pending.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Pay Pix" }));
    expect(await screen.findByText("Fake Pix status: paid.")).toBeVisible();
  });

  it("renders the Pix payment route page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ status: "pending" })),
    );

    render(
      await PixPaymentPage({
        params: Promise.resolve({ paymentId: "pix-0001" }),
      }),
    );

    expect(await screen.findByText("Simulated Pix payment")).toBeVisible();
  });
});
