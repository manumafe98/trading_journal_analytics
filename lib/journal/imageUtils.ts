/**
 * Compress an image file to a WebP base64 string suitable for localStorage.
 * Resizes the image to a max width/height while maintaining aspect ratio,
 * and lowers quality to 0.6.
 */
export async function compressImageToBase64(file: File, maxWidth = 1080): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                // If height is somehow larger than a reasonable max (e.g. 1080), restrict it
                if (height > 1080) {
                    width = Math.round((width * 1080) / height);
                    height = 1080;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                // output as webp with 0.6 quality (very decent compression)
                const dataUrl = canvas.toDataURL('image/webp', 0.6);
                resolve(dataUrl);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = event.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
