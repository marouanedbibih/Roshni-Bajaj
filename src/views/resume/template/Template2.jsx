import React, { useRef } from "react";
import { useResumeContext } from "../../../contexts/ResumeProvider";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../../public/img/Vitejs-logo.svg.png";

function Template2() {
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
    <div className=" flex flex-col justify-center items-center p-">
      <div className="w-full h-32 justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Template 2
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
      <div className="w-[793px] h-[1122px] px-12 bg-white ">
        <div className="" id="header-template">
          <div  className="bg-light_border w-2/5 h-auto flex justify-center" id="infos" >
          <img className="w-48 h-48 relative rounded-[100px]" src={images.image_1.url} />
          </div>
          <div  className="w-3/5 h-auto" id="feilds"></div>
        </div>
        <div className="footer-tamplate"></div>
      </div>
    </div>
  );
}

export default Template2;
