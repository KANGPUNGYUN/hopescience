import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSideBar } from "../../../modules/AdminSideBar/AdminSideBar";
import { Button } from "../../../components/Button";
import { auth } from "../../../store";
import "./Users.css";

function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export const StaffCreate = () => {
  const navigate = useNavigate();
  const createStaffAccount = auth((state) => state.createStaffAccount);
  const [name, setName] = useState("스태프");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("01000000000");
  const [password, setPassword] = useState(generatePassword());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const normalizedPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!name || !email || !normalizedPhone || !password) {
      alert("이름/이메일/연락처/비밀번호를 모두 입력해주세요.");
      return;
    }
    if (normalizedPhone.length < 9 || normalizedPhone.length > 11) {
      alert("연락처 형식이 올바르지 않습니다. 숫자만 9~11자리로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createStaffAccount(email, password, name, normalizedPhone);
      alert(
        `스태프 계정이 생성되었습니다.\n\n이름: ${name}\n아이디(이메일): ${email}\n연락처: ${normalizedPhone}\n비밀번호: ${password}`
      );
      try {
        await navigator.clipboard.writeText(
          `이름: ${name}\n아이디(이메일): ${email}\n연락처: ${normalizedPhone}\n비밀번호: ${password}`
        );
      } catch {
        // ignore clipboard errors
      }
      navigate("/admin/users");
    } catch (err) {
      alert(
        `스태프 계정 생성 실패: ${
          err?.response?.data?.message || err?.message || "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-background">
      <div className="layout-flex">
        <AdminSideBar />
        <main className="admin-main-content">
          <div className="users-title-wrap">
            <h2 className="admin-page-title">스태프 계정 생성</h2>
            <Button
              label="회원관리로 돌아가기"
              onClick={() => navigate("/admin/users")}
              style={{ width: "170px", height: "40px", fontSize: "14px" }}
            />
          </div>

          <form
            onSubmit={onSubmit}
            style={{
              marginLeft: "34px",
              marginRight: "16px",
              padding: "20px",
              border: "1px solid #2a2e37",
              borderRadius: "8px",
              background: "#1f232b",
              maxWidth: "720px",
            }}
          >
            <div style={{ display: "grid", gap: "12px" }}>
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ height: "42px", padding: "0 12px" }}
              />
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: "42px", padding: "0 12px" }}
              />
              <input
                type="text"
                placeholder="연락처(숫자만)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ height: "42px", padding: "0 12px" }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ flex: 1, height: "42px", padding: "0 12px" }}
                />
                <Button
                  label="비밀번호 생성"
                  onClick={() => setPassword(generatePassword())}
                  style={{ width: "140px", height: "42px", fontSize: "14px" }}
                />
              </div>
              <Button
                type="submit"
                label={isSubmitting ? "생성 중..." : "스태프 계정 생성"}
                style={{ width: "180px", height: "42px", fontSize: "14px" }}
              />
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
