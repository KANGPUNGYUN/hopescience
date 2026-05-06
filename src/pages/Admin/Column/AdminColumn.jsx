import { AdminSideBar } from "../../../modules/AdminSideBar";
import { ColumnPagination } from "../../../modules/ColumnPagination";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const AdminColumn = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">F&Q 칼럼관리</h2>
            <ColumnPagination />
          </main>
        </div>
      </div>
    </>
  );
};
