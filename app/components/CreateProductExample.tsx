'use client';

import React, { useState } from 'react';
import FileUpload from '@/app/components/FileUpload';
import VideoUpload from '@/app/components/VideoUpload';

export default function CreateProductExample() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        features: ['', ''],
        images: [] as string[],
        videos: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, url]
        }));
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    };

    const handleVideoUpload = (url: string) => {
        setFormData(prev => ({
            ...prev,
            videos: [...prev.videos, url]
        }));
        setMessage({ type: 'success', text: 'Video uploaded successfully!' });
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const removeVideo = (index: number) => {
        setFormData(prev => ({
            ...prev,
            videos: prev.videos.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeature = (index: number) => {
        if (formData.features.length > 2) {
            setFormData(prev => ({
                ...prev,
                features: prev.features.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Filter out empty features
            const features = formData.features.filter(f => f.trim() !== '');

            if (features.length < 2) {
                throw new Error('Please provide at least 2 features');
            }

            if (formData.images.length === 0 && formData.videos.length === 0) {
                throw new Error('Please upload at least 1 image or video');
            }

            // Combine images and videos into one array
            const allMedia = [...formData.images, ...formData.videos];

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    category: formData.category,
                    features,
                    images: allMedia,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create product');
            }

            setMessage({ type: 'success', text: 'Product created successfully!' });

            // Reset form
            setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                features: ['', ''],
                images: [],
                videos: [],
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to create product'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

            {message && (
                <div
                    className={`mb-4 p-4 rounded ${message.type === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-medium mb-2">Features (minimum 2)</label>
                    {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder={`Feature ${index + 1}`}
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.features.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFeature}
                        className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        + Add Feature
                    </button>
                </div>

                {/* Image Upload Section */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Product Images
                    </label>
                    <FileUpload onUploadComplete={handleImageUpload} />

                    {/* Preview uploaded images */}
                    {formData.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {formData.images.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Video Upload Section */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Product Videos (max 5 seconds)
                    </label>
                    <VideoUpload onUploadComplete={handleVideoUpload} />

                    {/* Preview uploaded videos */}
                    {formData.videos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            {formData.videos.map((url, index) => (
                                <div key={index} className="relative group">
                                    <video
                                        src={url}
                                        className="w-full h-40 object-cover rounded"
                                        controls
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVideo(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}
