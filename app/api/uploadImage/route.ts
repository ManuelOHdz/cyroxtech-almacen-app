import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  const data = await request.formData(); // Esto solo funcionará si la solicitud es correctamente multipart
  const image = data.get("image") as File;

  if (!image) {
    return NextResponse.json("No se ha subido ninguna imagen", { status: 400 });
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const response: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({}, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result as UploadApiResponse); // Asegurando que el tipo sea UploadApiResponse
        }).end(buffer);
      });
    
      return NextResponse.json({ url: response.secure_url, message: "Imagen subida" });
  } catch {
    return NextResponse.json({ message: "Error al subir imagen" });
  }
  
}
