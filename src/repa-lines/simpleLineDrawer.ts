interface Color {
  r: number;
  g: number;
  b: number;
}

function drawLineIfImproves(ctx: CanvasRenderingContext2D, refctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, color: Color) {
  let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let data = imgData.data;
  const refData = refctx.getImageData(0, 0, refctx.canvas.width, refctx.canvas.height).data;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);

  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;

  let err = dx - dy;

  let x = x0;
  let y = y0;

  let cdiff = 0;
  let ndiff = 0;

  // check if line improves the image
  while (true) {
    const index = (x + y * ctx.canvas.width) * 4;

    const r = refData[index];
    const g = refData[index + 1];
    const b = refData[index + 2];

    const cr = data[index];
    const cg = data[index + 1];
    const cb = data[index + 2];

    cdiff += Math.sqrt((r - cr)*(r - cr) + (g - cg)*(g - cg) + (b - cb)*(b - cb));
    ndiff += Math.sqrt((r - color.r)*(r - color.r) + (g - color.g)*(g - color.g) + (b - color.b)*(b - color.b));

    if (x === x1 && y === y1) {
      break;
    }

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  if (cdiff > ndiff) {
    x = x0;
    y = y0;

    while (true) {
      const index = (x + y * ctx.canvas.width) * 4;
      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = 255;

      if (x === x1 && y === y1) {
        break;
      }

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }
}

function initCanvas(canvas: HTMLCanvasElement, refcanvas: HTMLCanvasElement) {
  canvas.width = refcanvas.width;
  canvas.height = refcanvas.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = 'rgb(128, 128, 128, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// TODO add other options like no scheduler, etc.
export function setupSimpleLineDrawer(canvas: HTMLCanvasElement, refcanvas: HTMLCanvasElement, monochrome: boolean = false) {
  let drawerRunning = false;

  initCanvas(canvas, refcanvas);

  refcanvas.addEventListener('imageLoaded', () => {
    initCanvas(canvas, refcanvas);
  });

  const refctx = refcanvas.getContext('2d', { willReadFrequently: true })!;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  let lines = 0;
  let startTime = Date.now();

  let updateLines = () => {
    if (!drawerRunning) {
      return;
    }

    lines++;

    const x0 = Math.ceil(Math.random() * canvas.width);
    const y0 = Math.ceil(Math.random() * canvas.height);
    const x1 = Math.ceil(Math.random() * canvas.width);
    const y1 = Math.ceil(Math.random() * canvas.height);
    const red = Math.random() * 255;
    const green = monochrome ? red : Math.random() * 255;
    const blue = monochrome ? red : Math.random() * 255

    drawLineIfImproves(ctx, refctx, x0, y0, x1, y1, { r: red, g: green, b: blue });

    setTimeout(updateLines, 0);
  };

  // @ts-expect-error: scheduler is pretty new
  if (window.scheduler) {
    updateLines = async () => {
      while (drawerRunning) {
        lines++;

        const x0 = Math.ceil(Math.random() * canvas.width);
        const y0 = Math.ceil(Math.random() * canvas.height);
        const x1 = Math.ceil(Math.random() * canvas.width);
        const y1 = Math.ceil(Math.random() * canvas.height);
        const red = Math.random() * 255;
        const green = monochrome ? red : Math.random() * 255;
        const blue = monochrome ? red : Math.random() * 255

        drawLineIfImproves(ctx, refctx, x0, y0, x1, y1, { r: red, g: green, b: blue });

        // @ts-expect-error: scheduler is not defined
        await scheduler.yield(); // about twice as fast as setTimeout, but still slow
      }
    }
  }

  // canvas click: start/stop drawing until next click
  canvas.addEventListener('click', () => {
    drawerRunning = !drawerRunning;
    if (drawerRunning) {
      startTime = Date.now();
      lines = 0;
      updateLines();
    } else {
      const deltaTime = (Date.now() - startTime)/1000;
      console.log(`Drew ${lines} lines in ${deltaTime}s (${(lines/deltaTime).toFixed(2)} l/s)`);
    }
  });
}
