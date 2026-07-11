// Format a number as Indian Rupee (e.g. ₹1,50,000)
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
