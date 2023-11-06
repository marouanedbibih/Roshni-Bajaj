import React, { useRef } from "react";
import { useResumeContext } from "../../../contexts/ResumeProvider";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../../public/img/Vitejs-logo.svg.png"

function Template1() {
  const { infos, images, subFields } = useResumeContext();
  const pdfRef = useRef();

  const donwloadPdf = () => {
    const input = pdfRef.current;
  
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // Calculate imgY dynamically based on content height
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgWidth / imgHeight;
      const newHeight = pdfWidth / aspectRatio;
      const imgY = (pdfHeight - newHeight) / 2;
  
      pdf.addImage(
        imgData,
        "PNG",
        0, // Keep this at 0
        imgY,
        pdfWidth,
        newHeight
      );
      pdf.save("template.pdf");
    });
  };
  


  return (

    
    <div className=" flex flex-col justify-center items-center bg-light">
      <div className="w-full h-32 justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Template 1
        </div>
        <div className="flex gap-4">
          <button
            onClick={donwloadPdf}
            className="w-auto px-3.5 py-2 bg-emerald-600 rounded-md justify-center items-center gap-2 flex"
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Download
            </div>
          </button>
        </div>
      </div>
      <div
        ref={pdfRef}
        className="w-[793px] h-[1122px]  bg-white rounded-lg shadow border-b border-zinc-400 flex-col justify-start items-start inline-flex"
      >
        <div className="bg-teal-800 flex-col justify-start items-centre gap-2.5 flex">
          <div className="h-[88px] px-6 flex-col justify-start items-center gap-2.5 flex">
            <img
              className="w-[70px] h-[61px]"
              src={logo}
              alt="Placeholder"
            />
          </div>
          <div className="w-[793px] px-6 py-3 bg-teal-800 justify-between items-start inline-flex">
            <div className="flex-col justify-start items-start gap-4 inline-flex">
              <div className="text-stone-50 text-[32px] font-bold font-['Roboto'] leading-[31.2px]">
                Informations
              </div>
              {Object.entries(infos).map(([index, value]) => (
                <div key={index}>
                  <span className="text-stone-50 text-[20px] font-extrabold font-['Roboto'] leading-6">
                    {index} :
                  </span>
                  <span className="text-stone-50 text-[20px] font-['Roboto'] leading-6">
                    {" "}
                    {value}
                  </span>
                </div>
              ))}
              {/* Continue replacing other text content with actual data */}
            </div>
            {/* Image upload from the Resume */}
            <img
              className="w-[235px] h-[237px] relative rounded-2xl"
              src={images.image_1.url}
              alt="Placeholder"
            />
          </div>
        </div>

        {/* Display the subFields dynamically */}
        {subFields.map((subField, subFieldIndex) => (
          <div key={subFieldIndex} className="w-[780px] px-6 py-3 justify-start items-start inline-flex">
            <div className="flex-col justify-start items-start gap-4 inline-flex">
              <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[31.2px]">
                {subField.subFieldName}
              </div>
              {subField.fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <span className="text-black text-[20px] font-extrabold font-['Roboto'] leading-6">
                    {field.key}:
                  </span>
                  <span className="text-black text-[20px] font-['Roboto'] leading-6">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="h-[88px] px-6 flex-col justify-center items-end gap-2.5 flex">
          <img
            className="w-[70px] h-[61px]"
            src={logo}
            alt="Placeholder"
          />
        </div>
      </div>
    </div>
  );
}

export default Template1;
