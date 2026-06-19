export const extractPublicId = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return '';

  try {
    const split = imageUrl.split('/')
    const last_two = split.splice(-2)
    
    const publicIdWithoutExtension = last_two[1].split('.')[0]
    const folderName = last_two[0]
    // console.log(`${last_two[0]}/${removeExtension}`);
    
    return `${folderName}/${publicIdWithoutExtension}`
    
  } catch (err) {
    console.error('Failed to extract publicId from URL:', imageUrl, err);
    return '';
  }
};