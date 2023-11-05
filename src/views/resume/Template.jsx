import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Section = ({ title, fields }) => (
  <div className="flex-col justify-start items-start gap-4 inline-flex">
    <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
      {title}
    </div>
    {fields.map((field, index) => (
      <div key={index}>
        <span className="text-zinc-400 text-2xl font-extrabold font-['Roboto'] leading-[31.20px]">
          {field.label}
        </span>
        <span className="text-zinc-400 text-2xl font-bold font-['Roboto'] leading-[31.20px]">
          :{" "}
        </span>
        <span className="text-zinc-400 text-2xl font-normal font-['Roboto'] leading-[31.20px]">
          {field.value}
        </span>
      </div>
    ))}
  </div>
);

function ResumeForm() {
  const section1Fields = [
    { label: "Last name", value: "Marouane" },
    { label: "First name", value: "Dbibih" },
    { label: "Phone", value: "+212 705904950" },
    { label: "Email", value: "marouane@email.com" },
  ];

  const section2Fields = [
    // Define fields for section 2
  ];

  const section3Fields = [
    // Define fields for section 3
  ];

  const pdfRef = useRef();

  const donwloadPdf = () => {
    const input= pdfRef.current;
    html2canvas (input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf= new jsPDF('p', 'mm', 'a4', true);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight/imgHeight);
    const imgX= (pdfWidth - imgWidth * ratio) / 2;
    const imgY= 30;
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('template.pdf');
    });
    };

  return (
    <div>
      <button
        onClick={donwloadPdf}
        className="w-auto px-3.5 py-2 bg-sky-900 rounded-lg shadow justify-center items-center gap-2 flex mr-4"
      >
        <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
          Download PDF
        </div>
      </button>
      <div
        ref={pdfRef}
        className="w-[1318px] h-[1561px] pb-4 bg-white rounded-lg shadow border-b border-zinc-400 flex-col justify-start items-start inline-flex"
      >
        <div className="bg-teal-800 flex-col justify-start items-start gap-2.5 flex">
          <div className="h-[88px] px-12 flex-col justify-start items-center gap-2.5 flex">
            <img
              className="w-[101px] h-[88px]"
              src="https://via.placeholder.com/101x88"
              alt="Placeholder"
            />
          </div>
          <div className="w-[1318px] px-12 py-6 bg-teal-800 justify-between items-start inline-flex">
            <Section title="Sub Field 1" fields={section1Fields} />
            <img
              className="w-[471.01px] h-[473px] relative rounded-2xl"
              src="https://via.placeholder.com/471x473"
              alt="Placeholder"
            />
          </div>
        </div>
        <div className="w-[1302px] px-12 py-6 justify-start items-start inline-flex">
          <Section title="Sub Field 2" fields={section2Fields} />
        </div>
        <div className="w-[1302px] px-12 py-6 justify-start items-start inline-flex">
          <Section title="Sub Field 3" fields={section3Fields} />
        </div>
        <div className="h-[88px] px-12 flex-col justify-center items-end gap-2.5 flex">
          <img
            className="w-[101px] h-[88px]"
            src="https://via.placeholder.com/101x88"
            alt="Placeholder"
          />
        </div>
      </div>
    </div>
  );
}

export default ResumeForm;
