// Utility function to check if the photo is a valid image URL
export const isValidImage = (photo: string | { path: string } | Array<{ path: string }>): boolean => {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  if (Array.isArray(photo)) {
    // Array of photo objects
    return photo.some(img => 
      img?.path && validExtensions.some(ext => img.path.toLowerCase().endsWith(ext))
    );
  }

  if (typeof photo === "object" && photo?.path) {
    // Single photo object
    return validExtensions.some(ext => photo.path.toLowerCase().endsWith(ext));
  }

  if (typeof photo === "string") {
    // Plain string (legacy)
    return validExtensions.some(ext => photo.toLowerCase().endsWith(ext));
  }

  return false;
};