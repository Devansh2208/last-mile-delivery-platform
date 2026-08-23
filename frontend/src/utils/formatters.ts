/**
 * Format an amount in INR (₹)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format weight in grams and kg
 */
export function formatWeight(grams: number | null | undefined): string {
  if (grams === null || grams === undefined || isNaN(grams)) {
    return '—';
  }
  if (grams < 1000) {
    return `${grams} g`;
  }
  const kg = grams / 1000;
  return `${kg.toFixed(2)} kg (${grams.toLocaleString()} g)`;
}

/**
 * Format weight in kg directly
 */
export function formatKg(kg: number | null | undefined): string {
  if (kg === null || kg === undefined || isNaN(kg)) {
    return '—';
  }
  return `${Number(kg).toFixed(2)} kg`;
}

/**
 * Format dimensions (L x B x H)
 */
export function formatDimensions(l: number, b: number, h: number): string {
  return `${l} × ${b} × ${h} cm`;
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format date in short date only
 */
export function formatShortDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

