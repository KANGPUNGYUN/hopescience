import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components";
import { auth } from "../../store";
import { AuthPageLayout, AuthField } from "../Auth";

const schema = yup
  .object({
    email: yup
      .string()
      .required("이메일 주소를 입력하세요")
      .email("유효한 이메일 주소를 입력하세요"),
  })
  .required();

export const FindPassword = () => {
  const checkEmail = auth((state) => state.checkEmail);
  const resetPassword = auth((state) => state.resetPassword);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    const res = await checkEmail(data);
    if (res) {
      if (res.exists === true) {
        try {
          const sendEmail = await resetPassword(data);
          if (sendEmail) {
            alert(sendEmail.message);
          }
        } catch (error) {
          alert("이메일 전송이 정상적으로 이뤄지지 않았습니다.");
        }
      } else {
        setError("email", {
          type: "manual",
          message: "희망과학심리상담센터에 가입한 이메일이 아닙니다.",
        });
      }
    }
  };

  return (
    <AuthPageLayout
      title="비밀번호 찾기"
      subtitle="가입 시 사용한 이메일로 비밀번호 재설정 링크를 보내드립니다."
    >
      <form
        className="auth-page__form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="auth-page__fields">
          <AuthField
            label="이메일 (가입 계정)"
            htmlFor="find-password-email"
            error={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="find-password-email"
                  type="email"
                  autoComplete="email"
                  placeholder="이메일 주소를 입력하세요"
                />
              )}
            />
          </AuthField>
        </div>

        <button
          type="submit"
          className="auth-page__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "전송 중..." : "비밀번호 재설정 링크 보내기"}
        </button>
      </form>

      <p className="auth-page__footer-text">
        비밀번호가 기억나셨나요?
        <RouterLink to="/signin" className="auth-page__link auth-page__link--router">
          로그인
        </RouterLink>
      </p>
    </AuthPageLayout>
  );
};
