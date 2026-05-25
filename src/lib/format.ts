export function formatCurrency(amount: number) {
  const formatted = new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `৳ ${formatted}`;
}

export function calculateCartTotals(items: { price: number; quantity: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 2500 || subtotal === 0 ? 0 : 80;
  const discount = subtotal >= 3200 ? 250 : 0;

  return {
    subtotal,
    deliveryFee,
    discount,
    total: Math.max(subtotal + deliveryFee - discount, 0),
  };
}
