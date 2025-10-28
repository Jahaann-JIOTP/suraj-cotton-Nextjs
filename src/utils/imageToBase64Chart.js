/**
 * Converts an image from a URL to a base64 string
 * @param imagePath - The path or URL to the image
 * @returns Promise<string> - The base64 encoded image string
 */
export async function loadImageAsBase64(imagePath) {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) {
      console.error(`Failed to load image: ${imagePath}`);
      return "";
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image as base64:", error);
    return "";
  }
}
