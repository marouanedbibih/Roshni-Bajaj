import React from "react";

function Button({onClick,color,hoverColor,activeColor,label}) {
  return (
    <button
      onClick={onClick}
      className={`w-auto px-3.5 py-2 ${color} hover:${hoverColor} active:${activeColor}  rounded-lg shadow justify-center items-center gap-2 flex`}
    >
      <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
        {label}
      </div>
    </button>
  );
}

export default Button;
