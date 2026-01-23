import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getAdminFromToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // SECURITY: Require authentication to prevent unauthorized uploads
        const adminId = await getAdminFromToken();
        if (!adminId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        const validTypes = [...validImageTypes, ...validVideoTypes];

        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File size exceeds 50MB limit' },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('Upload error:', error);
        // SECURITY: Don't expose error details to client
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
