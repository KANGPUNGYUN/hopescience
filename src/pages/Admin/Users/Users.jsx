import { AdminSideBar } from "../../../modules/AdminSideBar/AdminSideBar";
import { UsersPagination } from "../../../modules/UsersPagination/UsersPagination";
import { Button } from "../../../components/Button";
import "./Users.css";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <div className="users-title-wrap">
              <h2 className="admin-page-title">회원관리</h2>
              <Button
                label="스태프 계정 생성"
                onClick={() => navigate("/admin/users/staff-create")}
                style={{ width: "170px", height: "40px", fontSize: "14px" }}
              />
            </div>
            <UsersPagination />
          </main>
        </div>
      </div>
    </>
  );
};
