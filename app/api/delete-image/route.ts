import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const { publicId } = await req.json();

  if (!publicId) {
    return NextResponse.json({ error: "No publicId" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Resultado de eliminación:", result); // log útil
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error al eliminar imagen de Cloudinary:", error); // 👈 log de error
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
