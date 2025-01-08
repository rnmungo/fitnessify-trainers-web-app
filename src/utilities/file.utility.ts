export const getFileExtension = (title: string) => {
  const match = title.match(/\.[^/.]+$/);
  return match ? match[0] : '';
};

export const removeFileExtension = (title: string) => {
  return title.replace(/\.[^/.]+$/, '');
};
