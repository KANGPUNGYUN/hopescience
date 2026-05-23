import React, { useState, useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components";
import { AppModal } from "../../modules/AppModal";
import { PasswordStrengthMeter } from "../../modules/PasswordStrength";
import { auth } from "../../store";
import { PolicyContent } from "../Policy/Policy";
import {
  AuthPageLayout,
  AuthField,
  AuthSocialSection,
  useNaverLogin,
} from "../Auth";

const schema = yup
  .object({
    name: yup
      .string()
      .required(
        "입력하신 이름은 수료증에 그대로 사용되오니 정확한 이름을 입력해주세요."
      )
      .matches(/^[가-힣]{2,}$|^[a-zA-Z]{2,}$/, "유효한 이름형식으로 입력해주세요")
      .test(
        "no-consonant-vowel-only",
        "자음이나 모음만으로 이루어진 이름은 허용되지 않습니다.",
        (value) => {
          if (typeof value !== "string") return true;
          return !/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(value);
        }
      ),
    phone: yup
      .string()
      .required("연락처를 입력해주세요.")
      .matches(
        /^\d{3}-\d{3,4}-\d{4}$/,
        "유효한 연락처를 입력해주세요. 예 010-0000-0000"
      ),
    email: yup
      .string()
      .required("이메일 주소를 입력해주세요.")
      .email("유효한 이메일 주소를 입력해주세요."),
    password: yup
      .string()
      .required("비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .matches(/[a-zA-Z]/, "비밀번호에는 문자가 포함되어야 합니다.")
      .matches(/[0-9]/, "비밀번호에는 숫자가 포함되어야 합니다."),
    terms: yup.bool().oneOf([true], "이용약관 및 정보보호정책에 동의해주세요."),
  })
  .required();

export const SignUp = () => {
  const signup = auth((state) => state.register);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { naverLoginRef, handleNaverLogin } = useNaverLogin();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const watchedPassword = watch("password");

  const onSubmit = async (data) => {
    try {
      const { name, phone, email, password } = data;
      const signupSuccess = await signup(name, phone, email, password);
      if (signupSuccess) {
        navigate("/signin");
      }
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  const formatPhoneNumber = useCallback((value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  }, []);

  const handlePhoneChange = useCallback(
    (e, onChange) => {
      const inputValue = e.target.value;
      const currentValue = inputValue.replace(/[^\d]/g, "");
      const formattedValue = formatPhoneNumber(currentValue);
      onChange(formattedValue);
    },
    [formatPhoneNumber]
  );

  return (
    <>
      <AuthPageLayout
        title="회원가입"
        subtitle="수료증 발급에 사용되는 정보이니 정확히 입력해 주세요."
      >
        <form
          className="auth-page__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="auth-page__fields">
            <AuthField label="이름" htmlFor="signup-name" error={errors.name?.message}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="입력하신 이름은 수료증에 그대로 사용됩니다"
                  />
                )}
              />
            </AuthField>

            <AuthField label="연락처" htmlFor="signup-phone" error={errors.phone?.message}>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Input
                    id="signup-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="연락처를 입력하세요"
                    value={value}
                    onChange={(e) => handlePhoneChange(e, onChange)}
                  />
                )}
              />
            </AuthField>

            <AuthField label="이메일" htmlFor="signup-email" error={errors.email?.message}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="이메일 주소를 입력하세요"
                  />
                )}
              />
            </AuthField>

            <AuthField
              label="비밀번호"
              htmlFor="signup-password"
              error={errors.password?.message}
            >
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    {...field}
                    id="signup-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="문자·숫자 조합 8자 이상"
                  />
                )}
              />
              <PasswordStrengthMeter password={watchedPassword} />
            </AuthField>

            <div className="auth-page__terms">
              <Controller
                name="terms"
                control={control}
                defaultValue={false}
                render={({ field: { value, onChange, onBlur, ref } }) => (
                  <div className="auth-page__terms-row">
                    <label className="auth-page__checkbox" htmlFor="signup-terms">
                      <input
                        ref={ref}
                        id="signup-terms"
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                        onBlur={onBlur}
                      />
                    </label>
                    <button
                      type="button"
                      className="auth-page__terms-btn"
                      onClick={() => setIsModalOpen(true)}
                    >
                      이용약관 및 정보보호정책에 동의합니다
                    </button>
                  </div>
                )}
              />
              {errors.terms ? (
                <p className="input-error-message">{errors.terms.message}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="auth-page__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="auth-page__footer-text">
          이미 회원이신가요?
          <RouterLink to="/signin" className="auth-page__link auth-page__link--router">
            로그인
          </RouterLink>
        </p>

        <AuthSocialSection
          naverLoginRef={naverLoginRef}
          onNaverLogin={handleNaverLogin}
        />
      </AuthPageLayout>

      <AppModal
        title="이용약관 및 정보보호정책"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        panelClassName="mypage-setting-modal--policy"
        footerClassName="mypage-setting-modal__footer--single"
        footer={
          <button
            type="button"
            className="mypage-setting-modal__btn mypage-setting-modal__btn--confirm"
            onClick={() => setIsModalOpen(false)}
          >
            확인
          </button>
        }
      >
        <div className="auth-policy-scroll">
          <PolicyContent />
        </div>
      </AppModal>
    </>
  );
};
