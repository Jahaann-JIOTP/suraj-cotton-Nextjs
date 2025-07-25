export const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
  });
};
