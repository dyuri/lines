import './style.css';
import { copyImageToCanvasFromURL, handleUploadImage } from './imageUtils.ts';
import { setupSimpleLineDrawer } from './simpleLineDrawer.ts';

copyImageToCanvasFromURL(document.querySelector<HTMLCanvasElement>('#refcanvas')!, './example.jpg');

handleUploadImage(document.querySelector<HTMLCanvasElement>('#refcanvas')!, document.querySelector<HTMLInputElement>('#fileinput')!);

setupSimpleLineDrawer(document.querySelector<HTMLCanvasElement>('#linecanvas')!, document.querySelector<HTMLCanvasElement>('#refcanvas')!);
