import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axios.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

function Navbar() {
  const { setUser, user, _setToken, _setRole } = useStateContext();

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      _setToken(null);
      _setRole(null);
    });
  };

  return (
    <header className="h-20 px-16 bg-white shadow-md flex justify-end items-center">
      <div className="flex items-center gap-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col justify-center items-start gap-1">
            <div className="text-neutral-800 text-sm font-bold font-['Roboto'] leading-[18.20px]">
              {`${user.last_name} ${user.first_name}`}
            </div>
            <div className="text-zinc-400 text-[10px] font-bold font-['Roboto'] leading-[13px]">
              {user.email}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-[75px] px-3.5 py-2 bg-violet-800 rounded-lg shadow flex justify-center items-center gap-2"
        >
          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
            Logout
          </div>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
