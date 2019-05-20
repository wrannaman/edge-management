export default (id) => {
  const img = document.getElementById(id);
  img.crossOrigin = "Anonymous";
  const canvas = document.createElement("canvas");
  // canvas.crossOrigin = 'Anonymous';
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const dataURL = canvas.toDataURL();
  return dataURL;
};
