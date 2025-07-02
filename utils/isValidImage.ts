// Utility function to check if the photo is a valid image URL
export const isValidImage = (photo: string): boolean => {
    // Check if the photo string ends with a valid image extension
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return validExtensions.some((ext) => photo.toLowerCase().endsWith(ext));
};