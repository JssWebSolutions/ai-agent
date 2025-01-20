import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { updateUserDocument } from '../auth/userService';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadProfileImage(userId: string, file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPG, PNG, or GIF image.');
  }

  const storage = getStorage();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `profile-images/${userId}/${fileName}`);

  try {
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);
    
    // Update user document with new profile image URL
    await updateUserDocument(userId, {
      profileImage: downloadUrl,
      updatedAt: new Date()
    });

    return downloadUrl;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    if (error.code === 'storage/unauthorized') {
      throw new Error('Permission denied to upload profile image. Please check your storage rules.');
    }
    throw new Error('Failed to upload profile image');
  }
}