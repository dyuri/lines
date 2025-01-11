import './style.css';
import { setupSimpleLineDrawer } from './simpleLineDrawer.ts';

setupSimpleLineDrawer(document.querySelector<HTMLCanvasElement>('#linecanvas')!, document.querySelector<HTMLImageElement>('#refimage')!);
