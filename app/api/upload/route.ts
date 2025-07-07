import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

interface UploadedFile {
    filepath: string;
    originalFilename?: string;
    mimetype?: string;
    size?: number;
    [key: string]: any;
}

interface Files {
    file?: UploadedFile | UploadedFile[];
    [key: string]: UploadedFile | UploadedFile[] | undefined;
}

interface Fields {
    [key: string]: string | string[];
}

// Prevent Next.js from parsing the body
export const config = {
    api: {
        bodyParser: false,
    },
};

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const form = new IncomingForm({
            uploadDir: '/tmp',
            keepExtensions: true,
        });

        return new Promise((resolve, reject) => {


            form.parse(req as any, async (err: Error | null, fields: Fields, files: Files) => {
                if (err) {
                    console.error('Form parse error:', err);
                    return reject(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
                }

                const file = Array.isArray(files.file) ? files.file[0] : files.file;

                if (!file || !file.filepath) {
                    return resolve(
                        NextResponse.json({ error: 'No file provided' }, { status: 400 })
                    );
                }

                const uploadResult: { secure_url: string } = await cloudinary.uploader.upload(file.filepath, {
                    folder: 'purepaws',
                });

                // Cleanup temp file
                fs.unlinkSync(file.filepath);

                return resolve(
                    NextResponse.json({ success: true, url: uploadResult.secure_url }, { status: 200 })
                );
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}