import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  PaymentResultLayout,
  PaymentResultDetails,
  PaymentFailIcon,
} from "../paymentResult";
import { trackPaymentFailed } from "../../../../../utils/analytics";

export function FailPage() {
  const [searchParams] = useSearchParams();
  const { course_id, user_id } = useParams();

  useEffect(() => {
    trackPaymentFailed(
      searchParams.get("code"),
      searchParams.get("message"),
      course_id
    );
  }, [searchParams, course_id]);

  const detailItems = [
    { label: "에러 코드", value: searchParams.get("code") },
    { label: "실패 사유", value: searchParams.get("message") },
  ];

  return (
    <PaymentResultLayout
      variant="fail"
      icon={<PaymentFailIcon />}
      title="결제에 실패했습니다"
      subtitle="결제가 완료되지 않았습니다. 아래 안내를 확인한 뒤 다시 시도해 주세요."
      actions={
        <>
          <Link
            to={`/cart/${user_id}/${course_id}`}
            className="payment-result-card__btn payment-result-card__btn--primary"
          >
            다시 결제하기
          </Link>
          <Link
            to={course_id ? `/courses/${course_id}` : "/courses"}
            className="payment-result-card__btn payment-result-card__btn--secondary"
          >
            강의 상세로 돌아가기
          </Link>
        </>
      }
    >
      <PaymentResultDetails items={detailItems} />
    </PaymentResultLayout>
  );
}
