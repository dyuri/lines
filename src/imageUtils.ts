export function copyImageToCanvasFromURL(canvas: HTMLCanvasElement, imgUrl: string) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const img = new Image();
  img.src = imgUrl;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const event = new CustomEvent('imageLoaded', { detail: { img: img } });
    canvas.dispatchEvent(event);
  };
}

export function uploadImageToCanvas(canvas: HTMLCanvasElement, file: File) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const event = new CustomEvent('imageLoaded', { detail: { img: img } });
    canvas.dispatchEvent(event);

    setTimeout(() => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width < img.width || height < img.height) {
        const scale = Math.min(width / img.width, height / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const event = new CustomEvent('imageLoaded', { detail: { img: img } });
        canvas.dispatchEvent(event);
      }
    }, 0);

  };
}

export function handleUploadImage(canvas: HTMLCanvasElement, fileInput: HTMLInputElement) {
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      uploadImageToCanvas(canvas, file);
    }
  });
}
