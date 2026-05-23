import React from "react";
import { Link as RouterLink, useSearchParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../components";
import { auth } from "../../store";
import { AuthPageLayout, AuthField } from "../Auth";

const schema = yup
  .object({
    password: yup
      .string()
      .required("비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .matches(/[a-zA-Z]/, "비밀번호에는 문자가 포함되어야 합니다.")
      .matches(/[0-9]/, "비밀번호에는 숫자가 포함되어야 합니다."),
  })
  .required();

export const ResetPassword = () => {
  const resetPasswordConfirm = auth((state) => state.resetPasswordConfirm);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    const token = searchParams.get("token");
    const { password } = data;
    try {
      const success = await resetPasswordConfirm(token, password);
      if (success) {
        alert(success.message);
        if (success.message === "비밀번호가 성공적으로 재설정되었습니다.") {
          navigate("/signin");
        }
      }
    } catch (error) {
      alert("비밀번호 변경 API에서 오류가 발생했습니다.");
    }
  };

  return (
    <AuthPageLayout
      title="비밀번호 재설정"
      subtitle="새 비밀번호를 입력해 주세요. 문자와 숫자를 포함해 8자 이상이어야 합니다."
    >
      <form
        className="auth-page__form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="auth-page__fields">
          <AuthField
            label="새 비밀번호"
            htmlFor="reset-password"
            error={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="새 비밀번호를 입력하세요"
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
          {isSubmitting ? "변경 중..." : "비밀번호 변경하기"}
        </button>
      </form>

      <p className="auth-page__footer-text">
        <RouterLink to="/signin" className="auth-page__link auth-page__link--router">
          로그인으로 돌아가기
        </RouterLink>
      </p>
    </AuthPageLayout>
  );
};
