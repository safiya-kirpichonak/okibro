export const createAudioFormData = (buffer, blob) => {
  const file = new File(buffer, "speech.mp3", {
    type: blob.type,
    lastModified: Date.now(),
  });
  const formData = new FormData();
  formData.append("audio", file);

  return formData;
};
