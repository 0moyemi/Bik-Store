'use client';

import React, { useState, useRef } from 'react';

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    maxSizeMB?: number;
}

export default function FileUpload({
    onUploadComplete,
    maxSizeMB = 10
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Check file type - images only
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

        if (!validImageTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
            return;
        }

        // Check file size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`Image size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image
        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onUploadComplete(data.data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } finally {
            setUploading(false);
        }
    };

    const clearPreview = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <div className="glass-interactive border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-white/20 transition-all">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload"
                />

                {!preview ? (
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <svg
                            className="w-12 h-12 text-muted-foreground mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-sm text-foreground">
                            Click to upload image
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            JPEG, PNG, WebP, or GIF • Max {maxSizeMB}MB
                        </span>
                    </label>
                ) : (
                    <div className="space-y-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded"
                        />

                        {uploading ? (
                            <div className="text-primary">Uploading...</div>
                        ) : (
                            <button
                                onClick={clearPreview}
                                className="text-destructive text-sm hover:opacity-70"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-2 text-sm text-destructive text-center">
                    {error}
                </div>
            )}
        </div>
    );
}
