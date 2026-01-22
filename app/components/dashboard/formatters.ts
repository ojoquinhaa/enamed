export const numberFormatter = new Intl.NumberFormat("pt-BR");

export const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatPercent = (value: number | null) =>
  value === null ? "-" : `${percentFormatter.format(value)}%`;

export const formatRate = (value: number | null) =>
  value === null ? "-" : `${percentFormatter.format(value * 100)}%`;

export const formatScore = (value: number | null) =>
  value === null ? "-" : percentFormatter.format(value);
