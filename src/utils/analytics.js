import { trackEvent } from "../hooks/usePageTracking";

function buildCourseItem(course) {
  return {
    item_id: String(course?.id ?? ""),
    item_name: course?.title ?? "",
    item_category: course?.category?.name ?? "",
    price: Number(course?.discounted_price) || 0,
    quantity: 1,
  };
}

export function trackBeginCheckout(course) {
  trackEvent("begin_checkout", {
    currency: "KRW",
    value: Number(course?.discounted_price) || 0,
    items: [buildCourseItem(course)],
  });
}

export function trackAddPaymentInfo(course) {
  trackEvent("add_payment_info", {
    currency: "KRW",
    value: Number(course?.discounted_price) || 0,
    payment_type: "toss_payments",
    items: [buildCourseItem(course)],
  });
}

export function trackPurchase(orderId, amount, course) {
  trackEvent("purchase", {
    transaction_id: orderId,
    currency: "KRW",
    value: amount,
    items: [buildCourseItem(course)],
  });
}

export function trackPaymentFailed(code, message, courseId) {
  trackEvent("payment_failed", {
    error_code: code ?? "UNKNOWN",
    error_message: message ?? "",
    item_id: String(courseId ?? ""),
  });
}

export function trackPaymentCancelled(courseId) {
  trackEvent("payment_cancelled", {
    item_id: String(courseId ?? ""),
  });
}

export function trackPaymentError(errorCode, courseId) {
  trackEvent("payment_error", {
    error_code: errorCode ?? "UNKNOWN",
    item_id: String(courseId ?? ""),
  });
}

export function trackSignUp(method = "email") {
  trackEvent("sign_up", { method });
}

export function trackLogin(method = "email") {
  trackEvent("login", { method });
}
