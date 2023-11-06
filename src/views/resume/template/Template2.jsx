import React, { useRef } from "react";
import { useResumeContext } from "../../../contexts/ResumeProvider";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Template2() {
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
        className="w-[210mm] h-[297mm] justify-start items-start gap-[34px] inline-flex bg-white px-5">
        <div className="w-1/3 h-4/5 px-4 py-16 bg-neutral-100 flex-col justify-start items-center gap-8">
          <img
            className="w-40 h-40 relative rounded-[100px]"
            src={images.image_1.url}
          />
          <div className="h-28 flex-col justify-start items-start gap-4">
            <div className="text-black text-2xl font-bold font-'Inter'">
              Contact:
            </div>
            <div className="text-gray-700 text-sm font-normal font-'Inter'">
              {infos.phone}
              <br />
              {infos.address}
              <br />
              {infos.email}
            </div>
          </div>
        </div>
        <div className="w-2/3 pr-4 py-16 flex-col justify-start items-start gap-4">
          <div className="text-black text-3xl font-bold font-'Roboto' leading-[49.40px]">
            {infos.lastName} {infos.firstName}
          </div>
          <div className="flex flex-col">
            {subFields.map((subField, subFieldIndex) => (
              <div key={subFieldIndex}>
                <div className="py-2 bg-neutral-100 justify-center items-center gap-2.5">
                  <div className="text-black text-xl font-bold font-'Roboto' leading-relaxed">
                    {subField.subFieldName}
                  </div>
                </div>
                <div className="relative">
                  {subField.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="flex flex-row gap-4">
                      <div className="text-black text-base font-extrabold font-'Roboto' leading-tight">
                        {field.key}:
                      </div>
                      <div className="text-zinc-400 text-base font-normal font-'Roboto' leading-tight">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Template2;
