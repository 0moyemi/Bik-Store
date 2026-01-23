'use client';

import React, { useState, useRef } from 'react';

interface VideoUploadProps {
    onUploadComplete: (url: string) => void;
    maxSizeMB?: number;
    maxDurationSeconds?: number;
}

export default function VideoUpload({
    onUploadComplete,
    maxSizeMB = 50,
    maxDurationSeconds = 5
}: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setDuration(null);

        // Check file type - videos only
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

        if (!validVideoTypes.includes(file.type)) {
            setError('Please select a valid video file (MP4, WebM, or MOV)');
            return;
        }

        // Check file size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            setError(`Video size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Create preview and check duration
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = async () => {
            const videoDuration = video.duration;
            setDuration(videoDuration);

            // Check duration limit
            if (videoDuration > maxDurationSeconds) {
                setError(`Video must be ${maxDurationSeconds} seconds or less (yours is ${videoDuration.toFixed(1)}s)`);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                window.URL.revokeObjectURL(video.src);
                return;
            }

            // Set preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);

            window.URL.revokeObjectURL(video.src);

            // Upload video
            await uploadFile(file);
        };

        video.onerror = () => {
            setError('Failed to load video metadata');
            window.URL.revokeObjectURL(video.src);
        };

        video.src = URL.createObjectURL(file);
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
        setDuration(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <div className="glass-interactive border-2 border-dashed border-accent/30 rounded-lg p-6 text-center hover:border-accent/50 transition-all">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                    id="video-upload"
                />

                {!preview ? (
                    <label
                        htmlFor="video-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <svg
                            className="w-12 h-12 text-accent mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-sm text-foreground">
                            Click to upload video
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            MP4, WebM, or MOV • Max {maxDurationSeconds}s • Max {maxSizeMB}MB
                        </span>
                    </label>
                ) : (
                    <div className="space-y-4">
                        <video
                            src={preview}
                            controls
                            className="max-h-64 mx-auto rounded"
                        />

                        {duration && (
                            <div className="text-xs text-muted-foreground">
                                Duration: {duration.toFixed(1)}s
                            </div>
                        )}

                        {uploading ? (
                            <div className="text-accent">Uploading video...</div>
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
