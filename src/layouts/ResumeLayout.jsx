import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import ResumeProvider from "../contexts/ResumeProvider";
function ResumeLayout() {
  const { user, token, role, setUser, _setToken, _setRole, notification } =
    useStateContext();
  const roleInt = parseInt(role);

  if (!token || (roleInt !== 0 && roleInt !== 1)) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="px-16">
          <ResumeProvider>
            <Outlet />
          </ResumeProvider>
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}

export default ResumeLayout;
