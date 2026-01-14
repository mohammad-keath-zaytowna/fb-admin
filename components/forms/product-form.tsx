"use client";

import { productFormSchema, ProductFormData } from "@/lib/forms/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import RHFInput from "../react-hook-form/rhf-input";
import RHFTextarea from "../react-hook-form/rhf-textarea";
import RHFImageUpload from "../react-hook-form/rhf-image-upload";
import { Button } from "../ui/button";
import { Product } from "@/types";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { getUsers } from "@/lib/api/users";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const [colors, setColors] = useState<string[]>(initialData?.colors || []);
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialData?.visibleToUsers || []);
  const [allUsers, setAllUsers] = useState<boolean>(!initialData?.visibleToUsers || initialData?.visibleToUsers.length === 0);
  const [users, setUsers] = useState<any[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      image: initialData?.image || "",
      category: initialData?.category || "",
      price: String(initialData?.price) || '',
      description: initialData?.description || "",
      stock: initialData?.stock || 0,
      colors: initialData?.colors || [],
      sizes: initialData?.sizes || [],
    },
    mode: "onChange",
  });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers({ rowsPerPage: 20 });
        setUsers(response.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (data: ProductFormData) => {
    console.log('=== FORM SUBMIT - RAW DATA ===');
    console.log('data.stock:', data.stock, 'Type:', typeof data.stock);

    const submissionData = {
      ...data,
      colors: colors.filter((c) => c.trim() !== ""),
      sizes: sizes.filter((s) => s.trim() !== ""),
      visibleToUsers: allUsers ? [] : selectedUsers,
    };

    console.log('=== FORM SUBMIT - AFTER PROCESSING ===');
    console.log('submissionData.stock:', submissionData.stock, 'Type:', typeof submissionData.stock);

    await onSubmit(submissionData);
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleAllUsersChange = (checked: boolean) => {
    setAllUsers(checked);
    if (checked) {
      setSelectedUsers([]);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <RHFInput
          name="name"
          label="Product Name"
          type="text"
          placeholder="Product Name"
          disabled={isLoading}
        />
        <RHFImageUpload
          name="image"
          label="Product Image"
          disabled={isLoading}
          initialImageUrl={initialData?.image}
        />
        <RHFInput
          name="category"
          label="Category"
          type="text"
          placeholder="Electronics"
          disabled={isLoading}
        />
        <RHFInput
          name="price"
          label="Price"
          type="text"
          placeholder="99.99"
          disabled={isLoading}
        />
        <RHFInput
          name="stock"
          label="Stock Quantity"
          type="number"
          placeholder="0"
          disabled={isLoading}
        />
        <RHFTextarea
          name="description"
          label="Description"
          placeholder="Product description"
          rows={4}
          disabled={isLoading}
        />

        <Field>
          <FieldLabel>Colors</FieldLabel>
          <div className="flex gap-2">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Add color"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addColor();
                }
              }}
            />
            <Button type="button" onClick={addColor} variant="outline">
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-2 px-2 py-1 bg-muted rounded-md"
                >
                  <div
                    aria-hidden
                    style={{ backgroundColor: color }}
                    className="w-3 h-3 rounded-sm border border-input"
                  />
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel>Sizes</FieldLabel>
          <div className="flex gap-2">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Add size"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSize();
                }
              }}
            />
            <Button type="button" onClick={addSize} variant="outline">
              <IconPlus className="h-4 w-4" />
            </Button>
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <div
                  key={size}
                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel>Visible To Users</FieldLabel>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allUsers"
                checked={allUsers}
                onCheckedChange={handleAllUsersChange}
                disabled={isLoading}
              />
              <Label htmlFor="allUsers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                All Users (visible to everyone)
              </Label>
            </div>
            {!allUsers && (
              <div className="space-y-2 p-3 border rounded-md max-h-48 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No users available</p>
                ) : (
                  users.map((user) => (
                    <div key={user._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user._id}`}
                        checked={selectedUsers.includes(user._id)}
                        onCheckedChange={() => toggleUserSelection(user._id)}
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={`user-${user._id}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {user.name} ({user.email})
                      </Label>
                    </div>
                  ))
                )}
              </div>
            )}
            {!allUsers && selectedUsers.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Selected {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </Field>

        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="w-full mt-2 p-6"
        >
          {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </FormProvider>
  );
}

