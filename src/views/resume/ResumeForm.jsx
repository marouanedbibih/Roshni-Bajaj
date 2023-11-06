import React from "react";
import { useResumeContext } from "../../contexts/ResumeProvider";
import { Link } from "react-router-dom";
import ImageUpload from "../../components/Resume/ImageUpload";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";

function ResumeForm() {
  const { infos, setInfos, subFields, setSubFields, images, setImages } =
    useResumeContext();

  const addSubField = () => {
    const newSubField = {
      subFieldName: "",
      fields: [],
    };
    setSubFields([...subFields, newSubField]);
  };

  const addKeyValue = (subFieldIndex) => {
    const newKeyValue = { key: "", value: "" };
    const updatedSubFields = [...subFields];
    updatedSubFields[subFieldIndex].fields.push(newKeyValue);
    setSubFields(updatedSubFields);
  };

  const handleSubFieldNameChange = (subFieldIndex, value) => {
    const updatedSubFields = [...subFields];
    updatedSubFields[subFieldIndex].subFieldName = value;
    setSubFields(updatedSubFields);
  };

  const handleKeyValueChange = (subFieldIndex, keyValueIndex, key, value) => {
    const updatedSubFields = [...subFields];
    updatedSubFields[subFieldIndex].fields[keyValueIndex] = { key, value };
    setSubFields(updatedSubFields);
  };

  const removeSubField = (subFieldIndex) => {
    const updatedSubFields = [...subFields];
    updatedSubFields.splice(subFieldIndex, 1);
    setSubFields(updatedSubFields);
  };

  const removeKeyValue = (subFieldIndex, keyValueIndex) => {
    const updatedSubFields = [...subFields];
    updatedSubFields[subFieldIndex].fields.splice(keyValueIndex, 1);
    setSubFields(updatedSubFields);
  };

  // Function to handle and display images from the input
  const onImageChoose = (ev, imageKey) => {
    const file = ev.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prevImages) => ({
          ...prevImages,
          [imageKey]: {
            file: file,
            url: reader.result,
          },
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setInfos({
      ...infos,
      [field]: value,
    });
  };

  return (
    <div>
      <div className="w-full h-32 justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Resume
        </div>
        <div className="flex gap-4">
          <Link
            to="/template/1"
            className="w-auto px-3.5 py-2 bg-emerald-600 rounded-md justify-center items-center gap-2 flex"
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Template 1
            </div>
          </Link>
          <Link
            to="/template/2"
            className="w-auto px-3.5 py-2 bg-gray-700 rounded-md justify-center items-center gap-2 flex"
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Template 2
            </div>
          </Link>
          <Link
            to="/template/3"
            className="w-auto px-3.5 py-2 bg-orange-600 rounded-md justify-center items-center gap-2 flex"
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Template 3
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full h-auto p-4 bg-white rounded-lg shadow border-b border-zinc-400 flex-col justify-start items-start gap-4 inline-flex">
        <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
          Pictures
        </div>
        <div className="w-full justify-center items-center gap-32 inline-flex">
          <ImageUpload
            imageKey="image_1"
            images={images}
            onImageChoose={(ev) => onImageChoose(ev, "image_1")}
          />
          <ImageUpload
            imageKey="image_2"
            images={images}
            onImageChoose={(ev) => onImageChoose(ev, "image_2")}
          />
        </div>
        <div className="w-full grid grid-cols-2 gap-8" id="row-inputs-1">
          {Object.entries(infos).map(([field, value]) => (
            <input
              key={field}
              value={value}
              onChange={(ev) => handleInputChange(field, ev.target.value)}
              type="text"
              className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}
        </div>
        <div className="w-full">
          <div className="text-black text-[32px] mb-4 font-bold font-['Roboto'] leading-[41.60px]">
            Other Fields
          </div>
          <div>
            {subFields.map((subField, subFieldIndex) => (
              <div key={subFieldIndex}>
                <div className="self-stretch text-gray-800 mb-2 text-base font-medium font-['Roboto'] leading-[21px]">
                  Sub Field {subFieldIndex + 1}
                </div>
                <div className="w-full flex justify-start items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={subField.subFieldName}
                    onChange={(e) =>
                      handleSubFieldNameChange(subFieldIndex, e.target.value)
                    }
                    className="outline-none bg-white w-1/2 border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
                    placeholder="SubField Name"
                  />
                  <button
                    className="w-auto px-3.5 py-2 bg-red-500 rounded-lg shadow justify-center items-center gap-2 flex"
                    onClick={() => removeSubField(subFieldIndex)}
                  >
                    <AiFillDelete color="white" />
                  </button>
                </div>
                <div>
                  {subField.fields.map((keyValue, keyValueIndex) => (
                    <div
                      key={keyValueIndex}
                      className="w-full justify-start items-center gap-4 inline-flex mb-4"
                    >
                      <input
                        type="text"
                        value={keyValue.key}
                        onChange={(e) =>
                          handleKeyValueChange(
                            subFieldIndex,
                            keyValueIndex,
                            e.target.value,
                            keyValue.value
                          )
                        }
                        placeholder="Key"
                        className="outline-none bg-white w-1/4 border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
                      />
                      <input
                        type="text"
                        value={keyValue.value}
                        onChange={(e) =>
                          handleKeyValueChange(
                            subFieldIndex,
                            keyValueIndex,
                            keyValue.key,
                            e.target.value
                          )
                        }
                        placeholder="Value"
                        className="outline-none bg-white w-3/4 border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
                      />
                      <button
                        onClick={() =>
                          removeKeyValue(subFieldIndex, keyValueIndex)
                        }
                        className="w-auto px-3.5 py-2 bg-red-500 rounded-lg shadow justify-center items-center gap-2 flex"
                      >
                        <AiFillDelete color="white" />
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-auto h-auto px-3.5 py-2 bg-violet-800 mb-4 rounded-md text-white shadow justify-center items-center gap-2 inline-flex"
                    onClick={() => addKeyValue(subFieldIndex)}
                  >
                    Add Field with key & value 
                  </button>
                </div>
              </div>
            ))}
            <button
              className="w-auto h-auto px-3.5 py-2 bg-emerald-600 text-white rounded-md shadow justify-center items-center gap-2 inline-flex"
              onClick={addSubField}
            >
              Add Sub Field
            </button>
          </div>
        </div>
        {/* <Test /> */}
      </div>
    </div>
  );
}

export default ResumeForm;
