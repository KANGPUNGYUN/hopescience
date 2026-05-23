import { useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { payment, enrollment } from "../../../../../store";
import {
  PaymentResultLayout,
  PaymentResultDetails,
  PaymentSuccessIcon,
} from "../paymentResult";

const formatPaymentDate = () => {
  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

const formatAmount = (rawAmount) => {
  const amount = Number(rawAmount);
  if (!Number.isFinite(amount)) return "-";
  return `${amount.toLocaleString()}원`;
};

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const confirmPayment = payment((state) => state.confirmPayment);
  const createEnrollment = enrollment((state) => state.createEnrollment);
  const { course_id, user_id } = useParams();

  const hasRunEffect = useRef(false);
  const dateStr = useMemo(() => formatPaymentDate(), []);

  const handlePaymentConfirm = useCallback(async () => {
    if (hasRunEffect.current) return;
    hasRunEffect.current = true;

    try {
      const orderId = searchParams.get("orderId");
      const paymentKey = searchParams.get("paymentKey");
      const amount = parseInt(searchParams.get("amount"), 10);

      const paymentSuccess = await confirmPayment(orderId, paymentKey, amount);

      if (!paymentSuccess) {
        throw new Error("결제 확인에 실패했습니다.");
      }

      const enrollmentData = {
        user_id: parseInt(user_id, 10),
        course_id: parseInt(course_id, 10),
      };

      const enrollmentSuccess = await createEnrollment(enrollmentData);

      if (!enrollmentSuccess) {
        throw new Error("강의 등록에 실패했습니다.");
      }

      alert("결제 및 강의 등록이 성공적으로 완료되었습니다!");
    } catch (error) {
      console.error("처리 중 오류 발생:", error);

      if (error.response) {
        console.error("서버 응답:", error.response.data);
        console.error("상태 코드:", error.response.status);
      } else if (error.request) {
        console.error("요청 오류:", error.request);
      } else {
        console.error("오류 메시지:", error.message);
      }

      alert(
        `처리 중 오류가 발생했습니다: ${error.message}\n자세한 내용은 콘솔을 확인하고 관리자에게 문의해주세요.`
      );
    }
  }, [searchParams, confirmPayment, createEnrollment, course_id, user_id]);

  useEffect(() => {
    handlePaymentConfirm();
  }, [handlePaymentConfirm]);

  const detailItems = [
    { label: "주문번호", value: searchParams.get("orderId") },
    { label: "결제일", value: dateStr },
    {
      label: "결제 금액",
      value: formatAmount(searchParams.get("amount")),
      highlight: true,
    },
  ];

  return (
    <PaymentResultLayout
      icon={<PaymentSuccessIcon />}
      title="결제가 정상적으로 완료되었습니다"
      subtitle="주문 내역을 확인했습니다. 구매하신 강의에서 바로 학습을 시작해 보세요."
      actions={
        <Link
          to={`/courses/${course_id}`}
          className="payment-result-card__btn payment-result-card__btn--primary"
        >
          구매한 강의로 이동하기
        </Link>
      }
    >
      <PaymentResultDetails items={detailItems} />
    </PaymentResultLayout>
  );
}
