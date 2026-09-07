"use client";

import MuiStep from "@mui/material/Step";
import MuiStepLabel from "@mui/material/StepLabel";
import MuiStepper from "@mui/material/Stepper";

export type StepperItem = {
  label: string;
};

export function Stepper({
  steps,
  activeStep,
  completedSteps,
}: {
  steps: StepperItem[];
  activeStep: number;
  completedSteps: number[];
}) {
  return (
    <MuiStepper
      activeStep={activeStep}
      alternativeLabel
      className="overflow-x-auto pb-2"
    >
      {steps.map((step, index) => (
        <MuiStep key={step.label} completed={completedSteps.includes(index)}>
          <MuiStepLabel>{step.label}</MuiStepLabel>
        </MuiStep>
      ))}
    </MuiStepper>
  );
}
