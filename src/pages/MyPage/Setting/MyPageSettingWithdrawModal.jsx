import React, { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import {
  MyPageSettingModal,
  MyPageSettingModalFooter,
} from "./MyPageSettingModal";

export const MyPageSettingWithdrawModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setAgreed(false);
    }
  }, [isOpen]);

  const canSubmit = password.trim().length > 0 && agreed;

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm({ password });
  };

  return (
    <MyPageSettingModal
      title="회원 탈퇴 안내"
      isOpen={isOpen}
      onClose={onClose}
      headerVariant="withdraw"
      footer={
        <MyPageSettingModalFooter
          cancelLabel="취소"
          confirmLabel="회원 탈퇴"
          onCancel={onClose}
          onConfirm={handleConfirm}
          confirmVariant="danger"
          confirmDisabled={!canSubmit}
          isSubmitting={isSubmitting}
        />
      }
    >
      <p className="mypage-setting-withdraw__notice">
        회원 탈퇴 시 일부 정보는
        <br />
        관련 법령 및 서비스 운영 정책에 따라
        <br />
        일정 기간 보관 후 삭제될 수 있습니다.
      </p>

      <div className="mypage-setting-modal__field mypage-setting-withdraw__password">
        <Input
          type="password"
          mode="default"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <label className="mypage-setting-withdraw__agree">
        <input
          type="checkbox"
          className="mypage-setting-withdraw__checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span className="mypage-setting-withdraw__checkbox-ui" aria-hidden />
        <span>안내 내용을 확인했으며 회원 탈퇴에 동의합니다.</span>
      </label>
    </MyPageSettingModal>
  );
};
