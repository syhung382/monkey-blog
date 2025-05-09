import { useState } from "react";

export default function useFirebaseImage(setValue, getValues) {
  const [progress, setProgess] = useState(0);
  const [image, setImage] = useState("");

  if (!setValue || !getValues) return;

  const handleUploadImage = (file) => {};
  const handleDeleteImage = () => {};

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setValue("image_name", file.name);
    handleUploadImage(file);
  };

  return {
    image,
    setImage,
    progress,
    handleSelectImage,
    handleDeleteImage,
  };
}
