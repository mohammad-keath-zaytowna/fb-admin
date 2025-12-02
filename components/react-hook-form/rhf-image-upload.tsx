"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/utils/image";

interface RHFImageUploadProps {
  name: string;
  label: string;
  disabled?: boolean;
  initialImageUrl?: string;
}

function RHFImageUpload({
  name,
  label,
  disabled,
  initialImageUrl,
}: RHFImageUploadProps) {
  const { control, setValue, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(
    initialImageUrl ? getImageUrl(initialImageUrl) : null
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setValue(name, selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setValue(name, "");
    // Reset file input
    const fileInput = document.getElementById(name) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <div className="space-y-2">
            {preview ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
                {!disabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(name)?.click()}
                        className="bg-white"
                      >
                        Change
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                      >
                        <IconX className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => !disabled && document.getElementById(name)?.click()}
              >
                <IconUpload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
            <input
              id={name}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default RHFImageUpload;

