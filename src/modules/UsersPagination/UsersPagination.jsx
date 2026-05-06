import React, { useState, useEffect } from "react";
import { Link } from "../../components/Link";
import "./UsersPagination.css";
import { auth, user } from "../../store";
import { Button } from "../../components/Button";
import searchIcon from "../../icons/search.svg"
import leftArrowButton from "../../icons/chevron-left-large.svg"
import rightArrowButton from "../../icons/chevron-right-large.svg"

function generatePassword(length = 12) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export const UsersPagination = () => {
  const users = user((state) => state.users || []);
  const getUsers = user((state) => state.getUsers);
  const searchUsers = user((state) => state.searchUsers);
  const isLoading = user((state) => state.isLoading);
  const createStaffAccount = auth((state) => state.createStaffAccount);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState(generatePassword());
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);
  const postsPerPage = 7; // 한 페이지당 보여줄 데이터 수를 7로 변경
  const totalPosts = users.length;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      searchUsers(searchKeyword);
    } else {
      getUsers();
    }
  }, [searchKeyword]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    // 현재 페이지가 첫 번째 페이지에 가까워서 페이지 버튼이 충분하지 않은 경우
    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={
            currentPage === i
              ? "users-pagination-page-button active"
              : "users-pagination-page-button"
          }
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageButtons;
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const userlist = users?.slice(indexOfFirstPost, indexOfLastPost);

  const handleCreateStaff = async () => {
    if (!staffEmail || !staffPassword) {
      alert("스태프 이메일/비밀번호를 입력해주세요.");
      return;
    }
    setIsCreatingStaff(true);
    try {
      await createStaffAccount(staffEmail, staffPassword, "스태프");
      alert(
        `스태프 계정이 생성되었습니다.\n\n아이디(이메일): ${staffEmail}\n비밀번호: ${staffPassword}`
      );
      try {
        await navigator.clipboard.writeText(
          `아이디(이메일): ${staffEmail}\n비밀번호: ${staffPassword}`
        );
      } catch {
        // ignore clipboard failures
      }
      setStaffEmail("");
      setStaffPassword(generatePassword());
      await getUsers();
    } catch (e) {
      alert(
        `스태프 계정 생성 실패: ${
          e?.response?.data?.message || e?.message || "Unknown error"
        }`
      );
    } finally {
      setIsCreatingStaff(false);
    }
  };

  return (
    <div className="admin-users-main">
      <div className="users-pagination-container">
        <div className="users-pagination-sort-wrap">
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontWeight: 700, color: "#DEE1E6" }}>
              스태프 계정 생성
            </div>
            <input
              type="email"
              placeholder="staff 이메일"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              className="users-pagination-search-input"
              style={{ maxWidth: "320px" }}
            />
            <input
              type="text"
              placeholder="비밀번호"
              value={staffPassword}
              onChange={(e) => setStaffPassword(e.target.value)}
              className="users-pagination-search-input"
              style={{ maxWidth: "240px" }}
            />
            <Button
              label="비밀번호 생성"
              onClick={() => setStaffPassword(generatePassword())}
              style={{ width: "140px", height: "40px", fontSize: "14px" }}
            />
            <Button
              label={isCreatingStaff ? "생성 중..." : "스태프 생성"}
              onClick={handleCreateStaff}
              disabled={isCreatingStaff}
              style={{ width: "140px", height: "40px", fontSize: "14px" }}
            />
          </div>
          <div className="users-pagination-search-input-wrap">
            <img src={searchIcon} className="search-icon" alt="검색 이미지" />
            <input
              type="search"
              className="users-pagination-search-input"
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="users-list">
          <div className="users-list-header">
            <div></div>
            <div>이름</div>
            <div>이메일</div>
            <div>연락처</div>
            <div>유저종류</div>
            <div>가입일자</div>
          </div>
          {isLoading ? (
            <div className="users-item">
              <div></div>
              <p className="">Loading...</p>
            </div>
          ) : (
            userlist.map((user) => (
              <div key={user.id} className="users-item">
                <div>
                  <input type="checkbox" name={user.id} id={user.id} />
                </div>
                <Link
                  to={`/admin/users/${user.id}`}
                  className="post-item-link"
                  style={{
                    backgroundColor: "transparent",
                    fontFamily: '"Lexend", Helvetica',
                    fontWeight: "700",
                    fontSize: "14px",
                    color: "#dee1e6",
                    width: "auto",
                    height: "18px",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  <div>{user.name}</div>
                </Link>
                <div>{user.email}</div>

                <div>{user.phone}</div>
                <div>{user.userType}</div>
                <div>
                  {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="users-pagination-footer">
          <div className="users-pagination-count">
            {users ? users.length : 1} results
          </div>
          <div className="users-pagination-buttons">
            <button
              className={`users-pagination-button ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <img
                className="img-11"
                alt="Chevron left large"
                src={leftArrowButton}
              />
            </button>
            <div className="users-pagination-button-wrap">
              {renderPageButtons()}
            </div>
            <button
              className={`users-pagination-button ${
                currentPage === Math.ceil(totalPosts / postsPerPage)
                  ? "disabled"
                  : ""
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalPosts / postsPerPage)}
            >
              <img
                className="img-11"
                alt="Chevron right large"
                src={rightArrowButton}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
