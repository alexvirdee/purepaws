'use client';

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";


type FileDropzoneProps<T> = {
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    field: keyof T;           
    label?: string;         
    accept?: any;   
    maxFiles?: number;         
    multiple?: boolean;      
}

export default function FileDropzone({
    formData,
    setFormData,
    field,
    label = 'Upload files',
    accept = { 'image/*': [] },
    maxFiles = 5,
    multiple = true
}: FileDropzoneProps<any>) {

    const currentCount = (formData[field] || []).length;
    const isDisabled = currentCount >= 5 || (multiple && formData[field]?.length >= 5);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const currentCount = (formData[field] || []).length;

        if (currentCount >= maxFiles) {
            toast.warning(`You can only upload up to ${maxFiles} files.`);
            return;
        }

        const remainingSlots = maxFiles - currentCount;
        const filesToUpload = acceptedFiles.slice(0, remainingSlots);

        (async () => {
            const uploadPromises = filesToUpload.map(async (file) => {
                const formDataObj = new FormData();
                formDataObj.append("file", file);
                formDataObj.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

                const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
                    method: "POST",
                    body: formDataObj,
                });

                const data = await res.json();

                console.log('Uploaded file:', data);

                return { path: data.secure_url, public_id: data.public_id };
            });

            const uploadedImages = await Promise.all(uploadPromises);

            setFormData((prev: any) => ({
                ...prev,
                [field]: multiple
                    ? [...(prev[field] || []), ...uploadedImages]
                    : uploadedImages[0]
            }));
        })();
    }, [setFormData, field, multiple, formData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
        disabled: isDisabled
    });

    const handleRemove = async (index: number) => {
        console.log('Removing image at index:', index);
        const removeImage = formData[field][index];

        // Remove locally
        setFormData((prev: any) => ({
            ...prev,
            [field]: prev[field].filter((_: any, i: number) => i !== index),
        }));

        console.log('Removing image:', removeImage);

        // Remove from Cloudinary
        if (removeImage.public_id) {
            await fetch('/api/cloudinary/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public_id: removeImage.public_id }),
            })
        }
    };

    const currentFiles = formData[field];

    return (
        <div>
            <label className="block text-xs font-medium mb-1 text-gray-500">{label}</label>
            <div
                {...getRootProps()}
                className={`border border-dashed rounded p-4 text-center cursor-pointer ${isDragActive ? 'bg-blue-50 border-blue-400' : ''
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here...</p>
                ) : (
                    <p>Drag & drop or click to select files</p>
                )}
            </div>

            {accept && accept['application/pdf'] !== undefined ? (
                <ul className="mt-2">
                    {currentFiles.map((file: any, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                            <a href={file.path} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                {file.path.split('/').pop()}
                            </a>
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-sm text-red-500"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    {/* Image previews */}
                    {multiple && Array.isArray(currentFiles) && currentFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {currentFiles.map((file: any, index: number) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img
                                        key={index}
                                        src={file.preview || file.path}
                                        alt={`Preview ${index}`}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        onClick={() => handleRemove(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {!multiple && currentFiles && (
                        <img
                            src={currentFiles.preview || currentFiles}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded mt-2"
                        />
                    )}
                </>
            )}


        </div>
    )
}