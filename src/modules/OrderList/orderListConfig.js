export const ORDER_TABS = [
  { key: "all", label: "전체" },
  { key: "completed", label: "결제완료" },
  { key: "canceled", label: "결제취소" },
];

const CANCELED_STATUSES = new Set(["CANCELED", "PARTIAL_CANCELED", "ABORTED", "EXPIRED"]);

export const ORDERS_PER_PAGE = 5;

export function isCanceledPayment(payment) {
  return CANCELED_STATUSES.has(payment?.status);
}

export function getOrderDisplayStatus(payment) {
  return isCanceledPayment(payment) ? "canceled" : "completed";
}

export function filterOrdersByTab(orders, tabKey) {
  if (tabKey === "completed") {
    return orders.filter((item) => !isCanceledPayment(item));
  }
  if (tabKey === "canceled") {
    return orders.filter((item) => isCanceledPayment(item));
  }
  return orders;
}

export function formatOrderDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export function formatOrderAmount(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "-";
  return `${value.toLocaleString("ko-KR")}원`;
}

export function getPaymentMethodLabel(payment) {
  return (
    payment?.payment_method ||
    payment?.method ||
    payment?.pay_method ||
    payment?.easy_pay?.provider ||
    "결제 정보 없음"
  );
}

export function getCancelDateTime(payment) {
  return formatOrderDateTime(
    payment?.canceled_at ||
      payment?.cancelled_at ||
      payment?.refunded_at ||
      payment?.updated_at
  );
}

export function getCancelReason(payment) {
  return (
    payment?.cancel_reason ||
    payment?.cancelReason ||
    payment?.cancel_memo ||
    "-"
  );
}
