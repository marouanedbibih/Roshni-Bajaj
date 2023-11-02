import React from "react";

function Input({ label, placeholder, type, value, onChange }) {
  return (
    <div className="self-stretch w-1/3 h-[71px] justify-start items-start gap-3 inline-flex">
      <div className="grow shrink basis-0 h-[42px] flex-col justify-start items-start gap-2 inline-flex">
        <div className="self-stretch text-gray-800 text-sm font-bold font-['Roboto'] leading-[21px]">
          {label}
        </div>
        <input
          className="self-stretch h-10  p-4 py-3 bg-white bg-opacity-0 rounded-lg border border-gray-300 justify-start items-center gap-2.5 inline-flex outline outline-0 focus:border-2 focus:border-purple focus:transition"
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Input;
