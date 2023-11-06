import React, { useRef } from "react";
import border from "../../../../public/img/border.png";
import { useResumeContext } from "../../../contexts/ResumeProvider";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


function Template3() {
  const { infos, images, subFields } = useResumeContext();
  const pdfRef = useRef();

  const downloadPdf = () => {
    const input = pdfRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const aspectRatio = imgWidth / imgHeight;
      const newHeight = pdfWidth / aspectRatio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, newHeight);
      pdf.save("template.pdf");
    });
  };



  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-32 justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-'Roboto' leading-[62.40px]">
          Template 2
        </div>
        <div className="flex gap-4">
          <button
            onClick={downloadPdf}
            className="w-auto px-3.5 py-2 bg-emerald-600 rounded-md justify-center items-center gap-2 flex"
          >
            <div className="text-white text-xs font-bold font-'Roboto' uppercase leading-[18px]">
              Download
            </div>
          </button>
        </div>
      </div>
      <div 
      ref={pdfRef}
  
      className="w-[595px] h-[842px] relative bg-white">
        <img
          className="w-[595px] h-[842px] left-[-0px] top-0 absolute"
          src={border}
        />
        <div className="w-[456px] left-[76px] top-[65px] absolute justify-between items-start inline-flex">
          <div className="w-[243px] h-[713px] pr-4 pb-16 flex-col justify-start items-start gap-4 inline-flex">
            <div className="w-[243px] text-black text-[38px] font-bold font-['Roboto'] leading-[49.40px]">
            {infos.lastName} {infos.firstName}
            </div>
            <div className="h-[293px] flex-col justify-start items-start gap-2 flex">
              {subFields.map((subField, subFieldIndex) => (
                <div key={subFieldIndex}>
                  <div className="w-[243px] py-2 justify-center items-center gap-2.5 inline-flex">
                    <div className="text-black text-xl font-bold font-['Roboto'] leading-relaxed">
                      {subField.subFieldName}
                    </div>
                  </div>
                  <div className="relative">
                    {subField.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="flex flex-row gap-4">
                        <div className="text-black text-base font-extrabold font-['Roboto'] leading-tight">
                          {field.key}:
                        </div>
                        <div className="text-zinc-400 text-base font-normal font-['Roboto'] leading-tight">
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[200px] h-[468.93px] relative">
            <img
              className="w-[200px] h-[200.95px] left-0 top-0 absolute rounded-2xl"
              src={images.image_1.url}
            />
            <img
              className="w-[200px] h-[200.93px] left-0 top-[268px] absolute rounded-2xl"
              src={images.image_2.url}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template3;
