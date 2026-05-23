import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { Input } from "../../../components/Input";
import { user, auth } from "../../../store";
import {
  MyPageSettingModal,
  MyPageSettingModalFooter,
} from "./MyPageSettingModal";
import { MyPageSettingWithdrawModal } from "./MyPageSettingWithdrawModal";
import { PasswordStrengthMeter } from "../../../modules/PasswordStrength";
import "../mypageShared.css";
import "./style.css";

const nameSchema = yup.object({
  name: yup
    .string()
    .required("이름을 입력해주세요.")
    .matches(/^[가-힣]{2,}$|^[a-zA-Z]{2,}$/, "유효한 이름형식으로 입력해주세요")
    .test(
      "no-consonant-vowel-only",
      "자음이나 모음만으로 이루어진 이름은 허용되지 않습니다.",
      (value) => {
        if (typeof value !== "string") return true;
        return !/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(value);
      }
    ),
});

const emailSchema = yup.object({
  email: yup
    .string()
    .required("이메일 주소를 입력해주세요.")
    .email("유효한 이메일 주소를 입력해주세요."),
});

const phoneSchema = yup.object({
  phone: yup
    .string()
    .required("연락처를 입력해주세요.")
    .matches(/^\d{3}-\d{3,4}-\d{4}$/, "유효한 연락처를 입력해주세요. 예 010-0000-0000"),
});

const passwordSchema = yup.object({
  password: yup.string().required("기존 비밀번호를 입력해주세요."),
  newPassword: yup.string().required("새 비밀번호를 입력해주세요."),
  newPasswordConfirm: yup
    .string()
    .oneOf([yup.ref("newPassword")], "새 비밀번호와 새 비밀번호 확인의 값이 일치하지 않습니다.")
    .required("새 비밀번호 확인을 입력해주세요."),
});

const MODAL = {
  NONE: null,
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  PASSWORD: "password",
  WITHDRAW: "withdraw",
};

const SettingRow = ({
  label,
  value,
  valueClassName,
  actionLabel,
  onAction,
  actionVariant,
  hideValue = false,
}) => (
  <div
    className={`mypage-setting__row${
      hideValue ? " mypage-setting__row--no-value" : ""
    }`}
  >
    <span className="mypage-setting__row-label">{label}</span>
    {!hideValue ? (
      <span className={`mypage-setting__row-value${valueClassName ? ` ${valueClassName}` : ""}`}>
        {value}
      </span>
    ) : null}
    <button
      type="button"
      className={`mypage-setting__edit-btn${
        actionVariant === "danger" ? " mypage-setting__edit-btn--danger" : ""
      }`}
      onClick={onAction}
    >
      {actionLabel}
    </button>
  </div>
);

export const Setting = () => {
  const isLoading = user((state) => state.isLoading);
  const getUser = user((state) => state.getUser);
  const userData = user((state) => state.profile);
  const updateUser = user((state) => state.updateUser);
  const updatePassword = auth((state) => state.updatePassword);
  const signout = auth((state) => state.signout);
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(MODAL.NONE);
  const [isSaving, setIsSaving] = useState(false);

  const data = sessionStorage.getItem("auth-storage");
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  const myUserUUID = data ? JSON.parse(data).state?.user?.uuid : null;
  const myAccessToken = data ? JSON.parse(data).state?.accessToken : null;

  const closeModal = useCallback(() => {
    setActiveModal(MODAL.NONE);
  }, []);

  const nameForm = useForm({
    resolver: yupResolver(nameSchema),
    defaultValues: { name: "" },
  });

  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "", verificationCode: "" },
  });

  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const watchedNewPassword = passwordForm.watch("newPassword");

  useEffect(() => {
    if (myUserId) getUser(myUserId);
  }, [getUser, myUserId]);

  useEffect(() => {
    if (!userData) return;
    nameForm.reset({ name: userData.name || "" });
    emailForm.reset({ email: userData.email || "", verificationCode: "" });
    phoneForm.reset({ phone: userData.phone || "" });
  }, [userData, nameForm, emailForm, phoneForm]);

  const openModal = (modal) => {
    if (userData) {
      nameForm.reset({ name: userData.name || "" });
      emailForm.reset({ email: userData.email || "", verificationCode: "" });
      phoneForm.reset({ phone: userData.phone || "" });
    }
    passwordForm.reset({
      password: "",
      newPassword: "",
      newPasswordConfirm: "",
    });
    setActiveModal(modal);
  };

  const saveProfile = async (fields) => {
    if (!userData || !myUserId || !myUserUUID) return;
    setIsSaving(true);
    try {
      await updateUser(
        myUserId,
        myUserUUID,
        fields.email ?? userData.email,
        fields.name ?? userData.name,
        fields.phone ?? userData.phone
      );
      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  const onSaveName = nameForm.handleSubmit((formData) =>
    saveProfile({ name: formData.name })
  );

  const onSaveEmail = emailForm.handleSubmit((formData) =>
    saveProfile({ email: formData.email })
  );

  const onSavePhone = phoneForm.handleSubmit((formData) =>
    saveProfile({ phone: formData.phone })
  );

  const onSavePassword = passwordForm.handleSubmit(async (formData) => {
    setIsSaving(true);
    try {
      await updatePassword(formData.password, formData.newPassword, myAccessToken);
      passwordForm.reset();
      closeModal();
    } finally {
      setIsSaving(false);
    }
  });

  const handleWithdraw = async () => {
    setIsSaving(true);
    try {
      await signout(myUserId);
      closeModal();
      navigate("/");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Header variant="solid" />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <section className="mypage-section mypage-section--setting">
            <header className="mypage-section__header mypage-section__header--setting">
              <h1 className="mypage-section__title">계정 설정</h1>
              <p className="mypage-section__desc">
                회원 정보 및 계정 설정을 관리할 수 있습니다
              </p>
              {isLoading ? (
                <p className="mypage-setting__loading">사용자 정보를 가져오는 중입니다...</p>
              ) : null}
            </header>

            <div className="mypage-setting__panel">
              <h2 className="mypage-setting__panel-title">회원정보</h2>
              <SettingRow
                label="성함"
                value={userData?.name || "-"}
                actionLabel="수정"
                onAction={() => openModal(MODAL.NAME)}
              />
              <SettingRow
                label="이메일"
                value={userData?.email || "-"}
                actionLabel="수정"
                onAction={() => openModal(MODAL.EMAIL)}
              />
              <SettingRow
                label="휴대폰 번호"
                value={userData?.phone || "-"}
                actionLabel="수정"
                onAction={() => openModal(MODAL.PHONE)}
              />
            </div>

            <div className="mypage-setting__panel mypage-setting__panel--account">
              <h2 className="mypage-setting__panel-title">계정관리</h2>
              <SettingRow
                label="비밀번호 변경"
                hideValue
                actionLabel="수정"
                onAction={() => openModal(MODAL.PASSWORD)}
              />
              <SettingRow
                label="회원 탈퇴"
                value="회원 탈퇴 시 일부 정보는 복구되지 않습니다."
                valueClassName="mypage-setting__row-value--hint"
                actionLabel="회원 탈퇴"
                actionVariant="danger"
                onAction={() => openModal(MODAL.WITHDRAW)}
              />
            </div>
          </section>
        </div>
      </main>

      <MyPageSettingModal
        title="성함 변경"
        isOpen={activeModal === MODAL.NAME}
        onClose={closeModal}
        footer={
          <MyPageSettingModalFooter
            cancelLabel="취소"
            confirmLabel="성함 변경"
            onCancel={closeModal}
            onConfirm={onSaveName}
            isSubmitting={isSaving}
          />
        }
      >
        <div className="mypage-setting-modal__field">
          <Controller
            control={nameForm.control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                mode="default"
                placeholder="성함을 입력하세요"
              />
            )}
          />
          {nameForm.formState.errors.name ? (
            <p className="input-error-message">{nameForm.formState.errors.name.message}</p>
          ) : null}
        </div>
      </MyPageSettingModal>

      <MyPageSettingModal
        title="이메일 변경"
        isOpen={activeModal === MODAL.EMAIL}
        onClose={closeModal}
        footer={
          <MyPageSettingModalFooter
            cancelLabel="취소"
            confirmLabel="이메일 변경"
            onCancel={closeModal}
            onConfirm={onSaveEmail}
            isSubmitting={isSaving}
          />
        }
      >
        <div className="mypage-setting-modal__field">
          <div className="mypage-setting-modal__field-row">
            <Controller
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  mode="default"
                  placeholder="새 이메일 입력해 주세요"
                />
              )}
            />
            <button type="button" className="mypage-setting-modal__verify-btn" disabled>
              인증
            </button>
          </div>
          {emailForm.formState.errors.email ? (
            <p className="input-error-message">{emailForm.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="mypage-setting-modal__field">
          <Controller
            control={emailForm.control}
            name="verificationCode"
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                mode="default"
                placeholder="인증번호를 입력해 주세요"
              />
            )}
          />
        </div>
      </MyPageSettingModal>

      <MyPageSettingModal
        title="휴대폰 번호 변경"
        isOpen={activeModal === MODAL.PHONE}
        onClose={closeModal}
        footer={
          <MyPageSettingModalFooter
            cancelLabel="취소"
            confirmLabel="휴대폰 번호 변경"
            onCancel={closeModal}
            onConfirm={onSavePhone}
            isSubmitting={isSaving}
          />
        }
      >
        <div className="mypage-setting-modal__field">
          <Controller
            control={phoneForm.control}
            name="phone"
            render={({ field }) => (
              <Input
                {...field}
                type="tel"
                mode="default"
                placeholder="010-0000-0000"
              />
            )}
          />
          {phoneForm.formState.errors.phone ? (
            <p className="input-error-message">{phoneForm.formState.errors.phone.message}</p>
          ) : null}
        </div>
      </MyPageSettingModal>

      <MyPageSettingModal
        title="비밀번호 변경"
        isOpen={activeModal === MODAL.PASSWORD}
        onClose={closeModal}
        footer={
          <MyPageSettingModalFooter
            cancelLabel="취소"
            confirmLabel="비밀번호 변경"
            onCancel={closeModal}
            onConfirm={onSavePassword}
            isSubmitting={isSaving}
          />
        }
      >
        <div className="mypage-setting-modal__field">
          <Controller
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                mode="default"
                placeholder="기존 비밀번호를 입력해주세요"
              />
            )}
          />
          {passwordForm.formState.errors.password ? (
            <p className="input-error-message">
              {passwordForm.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="mypage-setting-modal__field">
          <Controller
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                mode="default"
                placeholder="새 비밀번호"
              />
            )}
          />
          {passwordForm.formState.errors.newPassword ? (
            <p className="input-error-message">
              {passwordForm.formState.errors.newPassword.message}
            </p>
          ) : (
            <p className="mypage-setting-modal__hint">
              문자·숫자 조합 8자 이상
            </p>
          )}
          <PasswordStrengthMeter password={watchedNewPassword} />
        </div>
        <div className="mypage-setting-modal__field">
          <Controller
            control={passwordForm.control}
            name="newPasswordConfirm"
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                mode="default"
                placeholder="새 비밀번호를 입력해주세요"
              />
            )}
          />
          {passwordForm.formState.errors.newPasswordConfirm ? (
            <p className="input-error-message">
              {passwordForm.formState.errors.newPasswordConfirm.message}
            </p>
          ) : null}
        </div>
      </MyPageSettingModal>

      <MyPageSettingWithdrawModal
        isOpen={activeModal === MODAL.WITHDRAW}
        onClose={closeModal}
        onConfirm={handleWithdraw}
        isSubmitting={isSaving}
      />

      <Footer />
    </>
  );
};
