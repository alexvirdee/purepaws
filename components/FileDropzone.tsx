'use client';

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


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
    const [isUploading, setIsUploading] = useState(false);

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
            setIsUploading(true); // start loading state

            try {
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

                    return { display_name: data.display_name, path: data.secure_url, public_id: data.public_id };
                });

                const uploadedFiles = await Promise.all(uploadPromises);

                setFormData((prev: any) => ({
                    ...prev,
                    [field]: multiple
                        ? [...(prev[field] || []), ...uploadedFiles]
                        : uploadedFiles[0]
                }));
            } catch (error) {
                console.error('Error uploading files:', error);
                toast.error('Failed to upload files. Please try again.');
            } finally {
                setIsUploading(false); // end loading state
            }

        })();
    }, [setFormData, field, multiple, formData]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
        disabled: isDisabled
    });

    const handleRemove = async (index: number) => {
        console.log('Removing file at index:', index);
        const removeFile = formData[field][index];

        // Remove locally
        setFormData((prev: any) => ({
            ...prev,
            [field]: prev[field].filter((_: any, i: number) => i !== index),
        }));

        console.log('Removing file:', removeFile);

        // Remove from Cloudinary
        if (removeFile.public_id) {
            await fetch('/api/cloudinary/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public_id: removeFile.public_id }),
            })
        }
    };

    const currentFiles = formData[field];

    return (
        <div className="min-h-[150px] p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
            <label className="block text-xs font-medium mb-1 text-gray-500">{label}</label>
            {isUploading ? (
                <div className="flex items-center justify-center mb-2">
                    <Loader className="animate-spin h-5 w-5 text-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                </div>
            ) : <div
                {...getRootProps()}
                className={`min-h-[100px] border border-dashed rounded p-4 text-center cursor-pointer ${isDragActive ? 'bg-blue-50 border-blue-400' : ''
                    }`}
            >
                <Input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here...</p>
                ) : (
                    <p>Drag & drop or click to select files</p>
                )}
            </div>}



            {accept && accept['application/pdf'] !== undefined ? (
                <ul className="mt-2">
                    {currentFiles.map((file: any, index: number) => (
                        <li key={index} className="flex items-center gap-2 mb-2">
                            <p className="text-gray-600">
                                {file.display_name
                                    ? `${file.display_name}.pdf`
                                    : file.path.split('/').pop()}
                            </p>
                            <Button
                                size={"sm"}
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-sm text-white bg-red-500 hover:bg-red-600"
                            >
                                Remove
                            </Button>
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