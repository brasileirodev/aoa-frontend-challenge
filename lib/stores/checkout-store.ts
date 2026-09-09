import { create } from "zustand";
import type { BillingCycle } from "@/lib/api/plans";
import type { CardBrand, PaymentMethod } from "@/lib/payment";
import type { RegistrationValues } from "@/lib/registration-schema";

export type PaymentSummary =
  | {
      method: "card";
      brand: CardBrand | "Unknown brand";
      bank: string;
      maskedNumber: string;
    }
  | {
      method: "pix";
    };

type CheckoutState = {
  activeStep: number;
  selectedPlanId: string;
  billingCycle: BillingCycle;
  accountDetails: RegistrationValues | null;
  accountDetailsCompleted: boolean;
  paymentMethod: PaymentMethod;
  paymentSummary: PaymentSummary | null;
  paymentSuccessful: boolean;
  referenceCode: string;
};

type CheckoutActions = {
  initializeCheckout: (selectedPlanId: string) => void;
  selectPlan: (selectedPlanId: string) => void;
  changeBillingCycle: (billingCycle: BillingCycle) => void;
  continueFromPlan: () => void;
  goBack: () => void;
  markAccountDetailsAsEditing: () => void;
  saveAccountDetails: (accountDetails: RegistrationValues) => void;
  changePaymentMethod: (paymentMethod: PaymentMethod) => void;
  confirmPayment: (paymentSummary: PaymentSummary) => void;
  resetCheckout: () => void;
};

export type CheckoutStore = CheckoutState & CheckoutActions;

export const initialCheckoutState: CheckoutState = {
  activeStep: 0,
  selectedPlanId: "",
  billingCycle: "monthly",
  accountDetails: null,
  accountDetailsCompleted: false,
  paymentMethod: "card",
  paymentSummary: null,
  paymentSuccessful: false,
  referenceCode: "",
};

function createReferenceCode() {
  return "MER-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  ...initialCheckoutState,
  initializeCheckout: (selectedPlanId) => set({ selectedPlanId }),
  selectPlan: (selectedPlanId) => set({ selectedPlanId }),
  changeBillingCycle: (billingCycle) => set({ billingCycle }),
  continueFromPlan: () => set({ activeStep: 1 }),
  goBack: () =>
    set((state) => ({ activeStep: Math.max(state.activeStep - 1, 0) })),
  markAccountDetailsAsEditing: () =>
    set({ accountDetails: null, accountDetailsCompleted: false }),
  saveAccountDetails: (accountDetails) =>
    set({ accountDetails, accountDetailsCompleted: true, activeStep: 2 }),
  changePaymentMethod: (paymentMethod) => set({ paymentMethod }),
  confirmPayment: (paymentSummary) =>
    set({
      paymentSummary,
      paymentSuccessful: true,
      activeStep: 3,
      referenceCode: createReferenceCode(),
    }),
  resetCheckout: () => set(initialCheckoutState),
}));
