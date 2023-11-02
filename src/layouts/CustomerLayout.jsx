import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

function CustomerLayout() {
  const { user, token, role, setUser, _setToken, _setRole,notification } = useStateContext();
  const roleInt = parseInt(role);
  if (!token || (roleInt !== 1 && roleInt !== 2)) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar  />
        <main className="px-16">
          <Outlet />
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  );
}

export default CustomerLayout;
