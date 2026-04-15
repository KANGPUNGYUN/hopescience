import { AdminSideBar } from "../../../../modules/AdminSideBar";
import { ColumnEditor } from "../../../../modules/ColumnEditor";

export const AdminColumnEdit = () => {
  return (
    <>
      <div className="admin-background">
        <div className="layout-flex">
          <AdminSideBar />
          <main className="admin-main-content">
            <h2 className="admin-page-title">F&Q 칼럼관리</h2>
            <ColumnEditor />
          </main>
        </div>
      </div>
    </>
  );
};
