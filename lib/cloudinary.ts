import { v2 as cloudinary } from 'cloudinary';

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary environment variables');
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
    url: string;
    publicId: string;
    resourceType: 'image' | 'video';
    format: string;
    duration?: number;
}

/**
 * Upload file to Cloudinary with video duration limit
 */
export async function uploadToCloudinary(
    file: File,
    folder: string = 'bikudiratillah'
): Promise<UploadResult> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto', // Automatically detect image or video
                transformation: file.type.startsWith('video/')
                    ? [
                        { duration: '5' }, // Limit to 5 seconds
                        { quality: 'auto' },
                    ]
                    : [
                        { quality: 'auto' },
                        { fetch_format: 'auto' },
                    ],
            },
            (error, result) => {
                if (error) {
                    reject(new Error(`Upload failed: ${error.message}`));
                    return;
                }

                if (!result) {
                    reject(new Error('Upload failed: No result returned'));
                    return;
                }

                // Check video duration after upload
                if (result.resource_type === 'video' && result.duration && result.duration > 5) {
                    // Delete the uploaded video if it exceeds 5 seconds
                    cloudinary.uploader.destroy(result.public_id, { resource_type: 'video' })
                        .then(() => {
                            reject(new Error('Video exceeds 5 seconds limit'));
                        })
                        .catch(() => {
                            reject(new Error('Video exceeds 5 seconds limit'));
                        });
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    resourceType: result.resource_type as 'image' | 'video',
                    format: result.format,
                    duration: result.duration,
                });
            }
        );

        uploadStream.end(buffer);
    });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(
    publicId: string,
    resourceType: 'image' | 'video' = 'image'
): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete file from Cloudinary');
    }
}

export default cloudinary;
