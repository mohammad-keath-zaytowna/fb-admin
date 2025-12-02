/**
 * Get full image URL from backend path
 * @param imagePath - Image path from backend (e.g., "/uploads/image.jpg" or "https://example.com/image.jpg")
 * @returns Full URL to the image
 */
export function getImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return "";
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it starts with /uploads, prepend backend URL
  if (imagePath.startsWith("/uploads")) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    // Remove /api from backend URL if present
    const baseUrl = backendUrl.replace(/\/api$/, "");
    return `${baseUrl}${imagePath}`;
  }

  // Return as is for other paths
  return imagePath;
}

