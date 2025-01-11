export function setupSimpleLineDrawer(canvas: HTMLCanvasElement, refImage: HTMLImageElement) {
  let drawerRunning = false;
  const ctx = canvas.getContext('2d')!;
  canvas.width = refImage.width;
  canvas.height = refImage.height;
  let lines = 0;
  let startTime = Date.now();

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.log(canvas.width, refImage.width);

  // canvas click: start/stop drawing until next click
  canvas.addEventListener('click', () => {
    drawerRunning = !drawerRunning;
    if (drawerRunning) {
      startTime = Date.now();
      lines = 0;
      updateLines();
    } else {
      console.log(`Drew ${lines} lines in ${(Date.now() - startTime)/1000}s`);
    }
  });

  // image click: draw lines for 10 seconds
  refImage.addEventListener('click', () => {
    if (drawerRunning) {
      return;
    }

    startTime = Date.now();
    lines = 0;
    drawerRunning = true;
    updateLines();
    setTimeout(() => {
      drawerRunning = false;
      console.log(`Drew ${lines} lines in ${(Date.now() - startTime)/1000}s`);
    }, 10000);
  });

  function updateLines() {
    if (!drawerRunning) {
      return;
    }

    lines++;

    const x0 = Math.random() * canvas.width;
    const y0 = Math.random() * canvas.height;
    const x1 = Math.random() * canvas.width;
    const y1 = Math.random() * canvas.height;
    const red = Math.random() * 255;
    const green = Math.random() * 255;
    const blue = Math.random() * 255

    ctx.beginPath();
    ctx.strokeStyle = `rgb(${red}, ${green}, ${blue})`;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // we don't need proper visual updates, so requestAnimationFrame is not necessary
    setTimeout(updateLines, 0);
  }

  updateLines();
}
