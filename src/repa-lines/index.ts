import { copyImageToCanvasFromURL, handleUploadImage } from './imageUtils.ts';
import { setupSimpleLineDrawer } from './simpleLineDrawer.ts';
import styles from './style.css?inline';

export default class RepaLines extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  #refCanvas?: HTMLCanvasElement;
  #lineCanvas?: HTMLCanvasElement;
  #uploadBtn?: HTMLButtonElement;
  #imageInput?: HTMLInputElement;
  #resetBtn?: HTMLButtonElement;
  src: string = '';

  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <style>
        ${styles}
      </style>
      <div class="imagecontainer">
        <div class="toolbar">
          <button id="uploadBtn">Upload</button>
          <button id="resetBtn">Reset</button>
          <input type="file" id="fileinput" accept="image/*" />
        </div>
        <canvas class="refcanvas" id="refcanvas"></canvas>
        <canvas class="linecanvas" id="linecanvas"></canvas>
      </div>
      <slot></slot>
    `;

    this.#refCanvas = shadow.querySelector<HTMLCanvasElement>('#refcanvas')!;
    this.#lineCanvas = shadow.querySelector<HTMLCanvasElement>('#linecanvas')!;
    this.#uploadBtn = shadow.querySelector<HTMLButtonElement>('#uploadBtn')!;
    this.#resetBtn = shadow.querySelector<HTMLButtonElement>('#resetBtn')!;
    this.#imageInput = shadow.querySelector<HTMLInputElement>('#fileinput')!;

    this.#resetBtn.addEventListener('click', () => {
      this.reset();
    });

    // TODO implement as method, so it would be easier to start/stop
    setupSimpleLineDrawer(this.#lineCanvas, this.#refCanvas);

    handleUploadImage(this.#refCanvas, this.#imageInput);
    this.#uploadBtn.addEventListener('click', () => {
      this.#imageInput?.click();
    });

    if (this.src) {
      this.loadSrc();
    }
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    console.log('attributeChangedCallback', name, newValue);
    if (name === 'src') {
      this.src = newValue;
      this.reset();
    }
  }

  loadSrc() {
    if (this.#refCanvas && this.#lineCanvas) {
      copyImageToCanvasFromURL(this.#refCanvas, this.src);
    }
  }

  reset() {
    if (this.#refCanvas && this.#lineCanvas) {
      this.#refCanvas.width = 0;
      this.#refCanvas.height = 0;
      this.#lineCanvas.width = 0;
      this.#lineCanvas.height = 0;
      this.loadSrc(); // TODO
    }
  }
}

if (typeof window !== 'undefined') {
  window.customElements.define('repa-lines', RepaLines);
}
