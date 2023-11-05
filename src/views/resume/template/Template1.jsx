import React from 'react'
import { useResumeContext } from '../../../contexts/ResumeProvider';

function Template1() {
  const {resumeData,setResumeData} =useResumeContext();
  console.log(resumeData);
  return (
    <div>Template1</div>
  )
}

export default Template1