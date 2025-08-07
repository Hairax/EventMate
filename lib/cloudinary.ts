export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "finalNube");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/dc4zl1iep/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error Cloudinary:", errorData);
    throw new Error("Error al subir imagen");
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};
