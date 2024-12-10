import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image to Cloudinary
 * @param filePath - The path or URL of the image to upload
 * @param publicId - Optional public ID for the uploaded image
 * @param folder - The folder where the image should be uploaded (e.g., 'blogapi')
 * @returns The uploaded image's URL or an error message
 */
export const uploadImage = async (
  filePath: string,
  publicId?: string,
  folder: string = 'blogapi'
): Promise<string | null> => {
  try {
    const uploadOptions = {
      public_id: publicId,
      folder: folder 
    };
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      filePath,
      uploadOptions
    );
    return result.secure_url; 
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error.message);
    return null;
  }
};
