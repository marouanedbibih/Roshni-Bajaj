import React, { useState } from "react";
import { useResumeContext } from "../../contexts/ResumeProvider";
import { Link } from "react-router-dom";
import ImageUpload from "../../components/Resume/ImageUpload";

function ResumeForm() {
  const { resumeData, setResumeData, resumeImages, setResumeImages } = useResumeContext();
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

  return (
    <div>
      <div className="w-full h-32  justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Resume
        </div>
        <div className="flex gap-4">
          <Link className="w-auto px-3.5 py-2 bg-emerald-600 rounded-md justify-center items-center gap-2 flex">
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Template 1
            </div>
          </Link>
          <Link className="w-auto px-3.5 py-2 bg-gray-700 rounded-md justify-center items-center gap-2 flex">
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Template 2
            </div>
          </Link>
          <Link className="w-auto px-3.5 py-2 bg-orange-600 rounded-md justify-center items-center gap-2 flex">
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
          <ImageUpload imageKey="image_1" images={images} onImageChoose={onImageChoose} />
          <ImageUpload imageKey="image_2" images={images} onImageChoose={onImageChoose} />
        </div>
      </div>
    </div>
  );
}

export default ResumeForm;
