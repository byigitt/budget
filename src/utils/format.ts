import { format as formatDate, parseISO } from "date-fns";

/**
 * Format a date string according to the specified format
 */
export const formatDateString = (
  dateString: string,
  formatString: string = "yyyy-MM-dd"
): string => {
  try {
    return formatDate(parseISO(dateString), formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get a color based on value (positive = green, negative = red)
 */
export const getValueColor = (value: number): string => {
  if (value > 0) return "text-income";
  if (value < 0) return "text-expense";
  return "text-neutral";
};

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export const formatLargeNumber = (num: number): string => {
  if (Math.abs(num) >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  }
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
};
