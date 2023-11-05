import React, {createContext, useContext, useState } from "react";

const ResumeContext = createContext({
  resumeData: null,
  resumeImages:null,
  setResumeImages: () => {},
  setResumeData: () => {},
});

export default function ResumeProvider({children}) {
  const [resumeData, setResumeData] = useState({});
  const [resumeImages,setResumeImages] = useState();

  return (
    <ResumeContext.Provider value={{
        resumeData,
        setResumeData,
        resumeImages,
        setResumeImages
    }}>
        {children}
    </ResumeContext.Provider>
  )
}
export const useResumeContext = () => useContext(ResumeContext);