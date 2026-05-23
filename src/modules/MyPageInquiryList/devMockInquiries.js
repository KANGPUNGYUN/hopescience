import certificationImg from "../../images/v2/certification02.png";
import exampleImg from "../../images/v2/example.png";
import { QNA_CENTER_AUTHOR_NAME } from "../../pages/QnA/[inquiry_id]/qnaDetailConfig";

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const centerComment = (id, content, days) => ({
  id,
  content,
  user_name: QNA_CENTER_AUTHOR_NAME,
  user_id: 0,
  created_at: daysAgo(days),
  updated_at: daysAgo(days),
});

/** getInquiries API 응답 항목 형태 (로컬 development UI 미리보기) */
export const DEV_MOCK_INQUIRIES = [
  {
    id: 8001,
    title: "수료증 발급 일정 문의드립니다",
    category: "기타 문의",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    content:
      "<p>교육 수료 후 수료증이 언제 발급되는지 확인 부탁드립니다. 마이페이지에는 아직 표시되지 않습니다.</p>",
    user_id: 1,
    user_name: "로컬 테스트",
    view_count: 3,
    comments: [
      centerComment(
        8101,
        "<p>수료 처리 완료 후 영업일 기준 1~2일 내 마이페이지 &gt; 수료 증서에서 확인하실 수 있습니다.</p>",
        1
      ),
    ],
  },
  {
    id: 8002,
    title: "결제 영수증 재발급 요청",
    category: "결제/환불 문의",
    created_at: daysAgo(5),
    updated_at: daysAgo(4),
    content:
      "<p>지난달 결제 건에 대한 세금계산서용 영수증이 필요합니다. 재발급 가능 여부를 알려주세요.</p>",
    user_id: 1,
    user_name: "로컬 테스트",
    view_count: 5,
    comments: [
      centerComment(
        8102,
        "<p>마이페이지 &gt; 결제 내역에서 해당 주문의 영수증 다운로드가 가능합니다. 추가 서류가 필요하시면 고객센터로 연락 부탁드립니다.</p>",
        3
      ),
    ],
  },
  {
    id: 8003,
    title: "강의 영상 재생이 중간에 멈춥니다",
    category: "서비스 오류 문의",
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
    content: `<p>Chrome 브라우저에서 3강 영상이 12분 부근에서 반복적으로 멈춥니다.</p><p><img src="${exampleImg}" alt="오류 화면" /></p>`,
    user_id: 1,
    user_name: "로컬 테스트",
    view_count: 8,
    comments: [
      centerComment(
        8103,
        `<p>불편을 드려 죄송합니다. 캐시 삭제 후 재시도해 주시고, 동일 증상이면 첨부해 주신 화면과 함께 다시 알려주세요.</p><p><img src="${certificationImg}" alt="안내" /></p>`,
        5
      ),
    ],
  },
  {
    id: 8004,
    title: "회원 정보 수정이 반영되지 않아요",
    category: "계정 문의",
    created_at: daysAgo(10),
    updated_at: daysAgo(10),
    content:
      "<p>계정 설정에서 연락처를 변경했는데 저장 후에도 이전 번호가 표시됩니다.</p>",
    user_id: 1,
    user_name: "로컬 테스트",
    view_count: 2,
    comments: [
      centerComment(
        8104,
        "<p>확인 결과 일시적인 캐시 이슈였습니다. 로그아웃 후 다시 로그인하시면 정상 반영됩니다.</p>",
        8
      ),
    ],
  },
  {
    id: 8005,
    title: "수강 기간 연장 가능한가요?",
    category: "강의 문의",
    created_at: daysAgo(12),
    updated_at: daysAgo(12),
    content:
      "<p>개인 사정으로 수강 기간이 부족합니다. 2주 연장 신청 방법이 있을까요?</p>",
    user_id: 1,
    user_name: "로컬 테스트",
    view_count: 1,
    comments: [],
  },
  {
    id: 8006,
    title: "모바일에서 강의 목차가 보이지 않습니다",
    category: "서비스 오류 문의",
    created_at: daysAgo(14),
    updated_at: daysAgo(14),
    content:
      "<p>iOS Safari에서 강의 상세 페이지 진입 시 커리큘럼 영역이 비어 있습니다.</p>",
    user_id: 1,
    user_name: "로컬 테스트",
    view_count: 4,
    comments: [],
  },
  {
    id: 8007,
    title: "환불 규정 관련 문의",
    category: "결제/환불 문의",
    created_at: daysAgo(18),
    updated_at: daysAgo(18),
    content:
      "<p>수강 시작 3일 차인데 전액 환불이 가능한지 정책을 확인하고 싶습니다.</p>",
    user_id: 1,
    user_name: "로컬 테스트",
    view_count: 6,
    comments: [],
  },
];

export function isDevMockInquiriesEnabled() {
  return process.env.NODE_ENV === "development";
}

export function getDevMockInquiriesForUser(userId) {
  const uid = userId ?? 1;
  return DEV_MOCK_INQUIRIES.map((item) => ({
    ...item,
    user_id: uid,
  }));
}
