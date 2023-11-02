import React from "react";

function UserHeader() {
  return (
    <div>
      <div className="w-full h-[120px]  justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Users
        </div>
        <div className="w-[81px] px-3.5 py-2 bg-emerald-600 rounded-lg shadow justify-center items-center gap-2 flex">
          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
            Add new
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
