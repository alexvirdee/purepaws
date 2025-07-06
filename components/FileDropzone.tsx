'use client';

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileDropzoneProps = {
    formData: any;
    setFormData: (value: any) => void;
    field: string;           // e.g. 'photos', 'documents'
    label?: string;          // optional custom label
    accept?: any;            // react-dropzone accept prop
    multiple?: boolean;      // allow multiple files
}

export default function FileDropzone({
    formData,
    setFormData,
    field,
    label = 'Upload files',
    accept = { 'image/*': [] },
    multiple = true
}: FileDropzoneProps) {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const filesArray = acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));

        setFormData((prev: any) => ({
            ...prev,
            [field]: multiple
                ? [...(prev[field] || []), ...filesArray]
                : filesArray[0]
        }));
    }, [setFormData, field, multiple]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple
    });

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

            {/* Simple preview */}
            {multiple && Array.isArray(currentFiles) && currentFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {currentFiles.map((file: any, index: number) => (
                        <img
                            key={index}
                            src={file.preview || file}
                            alt={`Preview ${index}`}
                            className="w-24 h-24 object-cover rounded"
                        />
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
        </div>
    )
}