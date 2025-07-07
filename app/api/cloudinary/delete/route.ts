import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const { public_id } = await req.json();

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Deleted:', result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}