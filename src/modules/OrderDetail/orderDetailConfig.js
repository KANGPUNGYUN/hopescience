import {
  formatOrderAmount,
  formatOrderDateTime,
  getCancelDateTime,
  getCancelReason,
  getPaymentMethodLabel,
  isCanceledPayment,
} from "../OrderList/orderListConfig";

export {
  formatOrderAmount,
  formatOrderDateTime,
  getCancelDateTime,
  getCancelReason,
  getPaymentMethodLabel,
  isCanceledPayment,
};

export function getVatAmount(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "-";
  return Math.round(value * 0.1).toLocaleString("ko-KR");
}

export function formatPaymentNumber(payment) {
  const id = payment?.payment_id ?? payment?.order_id;
  if (id == null || id === "") return "-";
  return `#${id}`;
}

export function getCourseTitle(payment) {
  return payment?.course_title || payment?.product_name || "-";
}
