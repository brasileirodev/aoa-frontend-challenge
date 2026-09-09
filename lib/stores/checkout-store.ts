import { create } from "zustand";
import type { BillingCycle } from "@/lib/api/plans";
import type { PaymentMethod } from "@/lib/payment";
import type { RegistrationValues } from "@/lib/registration-schema";

type CheckoutState = {
  activeStep: number;
  selectedPlanId: string;
  billingCycle: BillingCycle;
  accountDetails: RegistrationValues | null;
  accountDetailsCompleted: boolean;
  paymentMethod: PaymentMethod;
  paymentSuccessful: boolean;
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
  confirmPayment: () => void;
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
  paymentSuccessful: false,
};

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
  confirmPayment: () => set({ paymentSuccessful: true, activeStep: 3 }),
  resetCheckout: () => set(initialCheckoutState),
}));
