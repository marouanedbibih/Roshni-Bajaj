import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import MenuLink from "../Link/MenuLink";
import { useStateContext } from "../../contexts/ContextProvider";

function Sidebar() {
  const location = useLocation();
  const { user, token, role } = useStateContext();
  const roleInt = parseInt(role);

  const isActive = (route) => {
    return location.pathname === route ? "bg-zinc-300 bg-opacity-50" : "";
  };

  return (
    <aside className="w-60 bg-purple px-4">
      <div className="h-20 flex items-center">
        <div className="text-white text-lg font-bold font-['Roboto'] leading-normal">
          Dashboard
        </div>
      </div>

      {token && (
        <div>
          {roleInt === 1 && (
            <>
            <MenuLink route="/users" label="Users" icon={<BiUser color="white" />} top_vl="0" />
            <MenuLink route="/customers" label="Customers" icon={<FiUsers color="white" />} top_vl="40px" />
            <MenuLink route="/resume" label="Resume" icon={<FiUsers color="white" />} top_vl="40px" />
          </>

          )}
          {roleInt === 0 && (
            <MenuLink route="/resume" label="Resume" icon={<FiUsers color="white" />} top_vl="40px" />
          )}
          {roleInt === 2 && (
            <MenuLink route="/customers" label="Customers" icon={<FiUsers color="white" />} top_vl="40px" />
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
