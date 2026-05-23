import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components";
import { auth } from "../../store";
import {
  AuthPageLayout,
  AuthField,
  AuthSocialSection,
  useNaverLogin,
} from "../Auth";

const schema = yup
  .object({
    email: yup
      .string()
      .required("이메일 주소를 입력하세요")
      .email("유효한 이메일 주소를 입력하세요"),
    password: yup.string().required("비밀번호를 입력하세요"),
  })
  .required();

export const SignIn = () => {
  const login = auth((state) => state.login);
  const navigate = useNavigate();
  const [rememberEmail, setRememberEmail] = useState(false);
  const { naverLoginRef, handleNaverLogin } = useNaverLogin();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberEmail(true);
    } else {
      setValue("email", "");
      setRememberEmail(false);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    const { email, password } = data;
    if (rememberEmail) {
      localStorage.setItem("savedEmail", email);
    } else {
      localStorage.removeItem("savedEmail");
    }
    const loginSuccess = await login(email, password);
    if (loginSuccess) {
      navigate("/");
    }
  };

  return (
    <AuthPageLayout
      title="로그인"
      subtitle="희망과학 심리상담센터 교육 서비스를 이용해 주세요."
    >
      <form className="auth-page__form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="auth-page__fields">
          <AuthField label="이메일" htmlFor="signin-email" error={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="이메일 주소를 입력하세요"
                />
              )}
            />
          </AuthField>

          <AuthField
            label="비밀번호"
            htmlFor="signin-password"
            error={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력하세요"
                />
              )}
            />
          </AuthField>
        </div>

        <div className="auth-page__row">
          <label className="auth-page__checkbox" htmlFor="saveEmail">
            <input
              type="checkbox"
              id="saveEmail"
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
            />
            아이디 기억하기
          </label>
          <RouterLink to="/findpassword" className="auth-page__link auth-page__link--router">
            비밀번호 찾기
          </RouterLink>
        </div>

        <button
          type="submit"
          className="auth-page__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="auth-page__footer-text">
        아직 회원이 아니신가요?
        <RouterLink to="/signup" className="auth-page__link auth-page__link--router">
          회원가입
        </RouterLink>
      </p>

      <AuthSocialSection
        naverLoginRef={naverLoginRef}
        onNaverLogin={handleNaverLogin}
      />
    </AuthPageLayout>
  );
};
