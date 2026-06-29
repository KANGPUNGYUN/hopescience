import { useEffect, useCallback, useRef } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { payment, enrollment, service } from "../../../../../store";
import {
  PaymentResultLayout,
  PaymentSuccessIcon,
} from "../paymentResult";
import { trackPurchase } from "../../../../../utils/analytics";


export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const confirmPayment = payment((state) => state.confirmPayment);
  const createEnrollment = enrollment((state) => state.createEnrollment);
  const getService = service((state) => state.getService);
  const { course_id, user_id } = useParams();
  const navigate = useNavigate();

  const hasRunEffect = useRef(false);

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

      const courseData = await getService(course_id);
      trackPurchase(orderId, amount, courseData);
      const firstLectureId = courseData?.sections?.[0]?.lectures?.[0]?.id;

      if (firstLectureId) {
        navigate(`/courses/${course_id}/${firstLectureId}`, { replace: true });
      } else {
        navigate(`/courses/${course_id}`, { replace: true });
      }
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
  }, [searchParams, confirmPayment, createEnrollment, getService, course_id, user_id, navigate]);

  useEffect(() => {
    handlePaymentConfirm();
  }, [handlePaymentConfirm]);

  return (
    <PaymentResultLayout
      icon={<PaymentSuccessIcon />}
      title="결제가 완료되었습니다"
      subtitle="잠시 후 강의 화면으로 이동합니다..."
    />
  );
}
