export default (base64data, width, height) => new Promise((resolve, reject) => {
  const srcOrientation = 6;
  let img = new Image();
  img.onload = () => {
    const width = img.width;
    const height = img.height;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    // set proper canvas dimensions before transform & export
    if (srcOrientation > 4 && srcOrientation < 9) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
    // transform context before drawing image
    switch (srcOrientation) {
      case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
      case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
      case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
      case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
      case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
      case 7: ctx.transform(0, -1, -1, 0, height, width); break;
      case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
      default: break;
    }
    // draw image
    ctx.drawImage(img, 0, 0);
    // export base64
    const dataURL = canvas.toDataURL('image/jpeg', 0.5);
    resolve(dataURL);
  };
  img.onerror = (e) => {
    reject(e);
  };
  img.src = base64data;
});
