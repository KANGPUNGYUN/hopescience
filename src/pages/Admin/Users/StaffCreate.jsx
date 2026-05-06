import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSideBar } from "../../../modules/AdminSideBar/AdminSideBar";
import { Button } from "../../../components/Button";
import { auth } from "../../../store";
import "./Users.css";

function generatePassword(length = 12) {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const extras = "!@#$%^&*";
  const all = letters + digits + extras;

  // 서버 검증: 영문+숫자 모두 포함
  const pick = (s) => s[Math.floor(Math.random() * s.length)];
  const out = [pick(letters), pick(digits)];
  while (out.length < Math.max(8, length)) out.push(pick(all));
  return out.sort(() => Math.random() - 0.5).join("");
}

function isValidStaffName(value) {
  return /^[가-힣a-zA-Z\s]+$/.test(value);
}

function hasLetterAndDigit(value) {
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  return hasLetter && hasDigit;
}

function extractErrorMessage(err) {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((d) => d?.msg)
      .filter(Boolean)
      .join("\n");
  }
  return err?.response?.data?.message || err?.message || "Unknown error";
}

export const StaffCreate = () => {
  const navigate = useNavigate();
  const createStaffAccount = auth((state) => state.createStaffAccount);
  const [name, setName] = useState("스태프");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("01000000000");
  const [password, setPassword] = useState(generatePassword());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGeneratePassword = async () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
    try {
      await navigator.clipboard.writeText(newPassword);
      sessionStorage.setItem("last-generated-staff-password", newPassword);
      alert(
        `비밀번호가 생성되어 클립보드에 복사되었습니다.\n\n${newPassword}\n\n브라우저 세션에도 임시 저장했습니다.`
      );
    } catch {
      alert(
        `비밀번호가 생성되었습니다.\n\n${newPassword}\n\n클립보드 복사에 실패했으니 직접 복사해주세요.`
      );
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const normalizedPhone = (phone || "").replace(/[^0-9]/g, "");
    if (!name || !email || !normalizedPhone || !password) {
      alert("이름/이메일/연락처/비밀번호를 모두 입력해주세요.");
      return;
    }
    if (!isValidStaffName(name)) {
      alert("이름은 한글, 영문, 띄어쓰기만 허용됩니다.");
      return;
    }
    if (normalizedPhone.length < 9 || normalizedPhone.length > 11) {
      alert("연락처 형식이 올바르지 않습니다. 숫자만 9~11자리로 입력해주세요.");
      return;
    }
    if (!hasLetterAndDigit(password)) {
      alert("비밀번호는 영문과 숫자를 모두 포함해야 합니다.");
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
      alert(`스태프 계정 생성 실패:\n${extractErrorMessage(err)}`);
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
                  onClick={handleGeneratePassword}
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
