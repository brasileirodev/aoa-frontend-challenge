export const formatDisplayValue = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);
export const formatNumberLabel = (value: number): string =>
  `#${String(value).padStart(3, "0")}`;
export const sortBySlot = <T extends { slot: number }>(list: T[]): T[] =>
  [...list].sort((first, second) => first.slot - second.slot);
