import React from "react";
import uploadImage from "../../../public/img/upload.jpg";


function ImageUpload({ imageKey, images, onImageChoose }) {
  return (
    <div className="mb-8" id={imageKey}>
      <label htmlFor={`profile-image-${imageKey}`} className="file-input-label">
        <div className="w-[471.01px] h-[473px] relative rounded-2xl">
          <img
            src={images[imageKey].url || uploadImage}
            alt={`Profile Image ${imageKey}`}
            className="w-[471.01px] h-[473px] relative rounded-2xl"
          />
          <input
            type="file"
            id={`profile-image-${imageKey}`}
            className="hidden"
            accept="image/*"
            onChange={(ev) => onImageChoose(ev, imageKey)}
          />
        </div>
      </label>
    </div>
  );
}

export default ImageUpload;
