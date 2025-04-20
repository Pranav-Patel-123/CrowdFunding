import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import DatauriParser from 'datauri/parser';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const bufferToDataURI = async (buffer, originalName) => {
  const parser = new DatauriParser();
  const ext = path.extname(originalName).toString();
  return parser.format(ext, buffer).content;
};

const streamToBuffer = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = await streamToBuffer(file.stream());
    const dataUri = await bufferToDataURI(fileBuffer, file.name);

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'campaign_attachments',
      resource_type: 'raw', // For PDF and non-image uploads
    });

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
