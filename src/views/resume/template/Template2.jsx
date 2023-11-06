import React from 'react'
import { useResumeContext } from '../../../contexts/ResumeProvider';

function Template2() {
  const {resumeData,setResumeData} =useResumeContext();
  console.log(resumeData);
  
  return (
    <div>Template2</div>
  )
}

export default Template2