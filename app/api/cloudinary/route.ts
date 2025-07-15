import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    const fileType = file.type;

    const isImage = fileType.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const buffer = Buffer.from(await file.arrayBuffer());

    const originalName = (file as File).name ? (file as File).name.replace(/\.[^/.]+$/, "") : "file";

    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    resource_type: resourceType,
                    public_id: originalName,
                    use_filename: true,
                    unique_filename: true,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            )
            .end(buffer);
    });

    return Response.json(result);
}