import React from "react";
import { AiFillDelete } from "react-icons/ai";

function KeyValueInputForm({
  data,
  updateDataKey,
  updateDataValue,
  removeData,
  index,
  keyLabel,
  valueLabel,
  type,
  textarea, // Add a prop to indicate whether to use a textarea
}) {
  const handleKeyChange = (ev) => {
    updateDataKey(ev.target.value);
  };

  const handleValueChange = (ev) => {
    updateDataValue(ev.target.value);
  };

  return (
    <div className="w-full justify-start items-center gap-4 inline-flex mb-4">
      <div className="w-1/4 h-20 justify-start items-start gap-3 flex">
        <div className="grow shrink basis-0 h-[42px] flex-col justify-start items-start gap-2 inline-flex">
          <div className="self-stretch text-gray-800 text-sm font-medium font-['Roboto'] leading-[21px]">
            {keyLabel}
          </div>
          <input
            type="text"
            value={data.key}
            onChange={handleKeyChange}
            className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
            placeholder={keyLabel}
          />
        </div>
      </div>

      <div className="w-3/4 h-20 justify-start items-start gap-3 flex">
        <div className="w-full flex-col justify-start items-start gap-2 inline-flex">
          <div className="self-stretch text-gray-800 text-sm font-medium font-['Roboto'] leading-[21px]">
            {valueLabel}
          </div>
          <div className="w-full flex justify-center items-center">
            {textarea ? ( // Conditionally render textarea or input
              <textarea
                value={data.value}
                onChange={handleValueChange}
                className="outline-none bg-white w-full border-2 border-gray-300 mb-0 mr-4 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
                placeholder={valueLabel}
                rows={4}
              />
            ) : (
              <input
                value={data.value}
                onChange={handleValueChange}
                className="outline-none bg-white w-full border-2 border-gray-300 mb-0 mr-4 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
                placeholder={valueLabel}
                type={type}
              />
            )}
            {index > 0 && (
              <button
                onClick={() => removeData(index)}
                className="w-auto px-3.5 py-2 bg-red-500  rounded-lg shadow justify-center items-center gap-2 flex"
              >
                <AiFillDelete color="white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyValueInputForm;
