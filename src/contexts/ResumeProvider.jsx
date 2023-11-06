import React, { createContext, useContext, useState } from "react";

const ResumeContext = createContext({
  infos: {
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    address: "",
  },
  images: {
    image_1: {
      file: null,
      url: null,
    },
    image_2: {
      file: null,
      url: null,
    },
  },
  subFields: [
    {
      subFieldName: "home",
      fields: [{ key: "Key1 update from context", value: "Value1" }],
    },
  ],
  setSubFields: () => {},
  setImages: () => {},
  setInfos: () => {},
});

export default function ResumeProvider({ children }) {
  const [infos, setInfos] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [images, setImages] = useState({
    image_1: {
      file: null,
      url: null,
    },
    image_2: {
      file: null,
      url: null,
    },
  });

  const [subFields, setSubFields] = useState([
    {
      subFieldName: "home",
      fields: [{ key: "Key1 update from context", value: "Value1" }],
    },
  ]);

  return (
    <ResumeContext.Provider
      value={{
        infos,
        setInfos,
        images,
        setImages,
        subFields,
        setSubFields,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export const useResumeContext = () => useContext(ResumeContext);
