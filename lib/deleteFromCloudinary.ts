export async function deleteFromCloudinary(publicId: string) {
  const res = await fetch("/api/delete-image", {
    method: "POST",
    body: JSON.stringify({ publicId }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("No se pudo borrar la imagen");
}
