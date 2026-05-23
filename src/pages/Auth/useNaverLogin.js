import { useEffect, useRef, useCallback } from "react";

export const useNaverLogin = () => {
  const naverLoginRef = useRef(null);

  const initializeNaverLogin = useCallback(() => {
    const { naver } = window;
    if (!naver?.LoginWithNaverId) return;

    const naverLogin = new naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_CLIENT_ID,
      callbackUrl: process.env.REACT_APP_CALLBACK_URL,
      isPopup: false,
      loginButton: {
        color: "green",
        type: 3,
        height: 50,
      },
      callbackHandle: true,
    });
    naverLogin.init();
  }, []);

  useEffect(() => {
    initializeNaverLogin();
  }, [initializeNaverLogin]);

  const handleNaverLogin = useCallback(() => {
    naverLoginRef.current?.children?.[0]?.click();
  }, []);

  return { naverLoginRef, handleNaverLogin };
};
