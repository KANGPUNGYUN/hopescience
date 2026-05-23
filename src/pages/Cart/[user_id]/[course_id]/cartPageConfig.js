export function formatCartPrice(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "-";
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function getCartDiscountAmount(course) {
  const price = Number(course?.price);
  const sale = Number(course?.discounted_price);
  if (Number.isNaN(price) || Number.isNaN(sale)) return 0;
  return Math.max(0, price - sale);
}
