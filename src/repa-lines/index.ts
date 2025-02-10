import { copyImageToCanvasFromURL } from './imageUtils.ts';
import { setupSimpleLineDrawer } from './simpleLineDrawer.ts';
import styles from './style.css?inline';

export default class RepaLines extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  #refCanvas?: HTMLCanvasElement;
  #lineCanvas?: HTMLCanvasElement;
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
        <canvas class="refcanvas" id="refcanvas"></canvas>
        <canvas class="linecanvas" id="linecanvas"></canvas>
      </div>
      <slot></slot>
    `;

    this.#refCanvas = shadow.querySelector<HTMLCanvasElement>('#refcanvas')!;
    this.#lineCanvas = shadow.querySelector<HTMLCanvasElement>('#linecanvas')!;

    setupSimpleLineDrawer(this.#lineCanvas, this.#refCanvas);

    if (this.src) {
      this.loadSrc();
    }
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    console.log('attributeChangedCallback', name, newValue);
    if (name === 'src') {
      this.src = newValue;
      if (this.#refCanvas && this.#lineCanvas) {
        this.#refCanvas.width = 0;
        this.#refCanvas.height = 0;
        this.#lineCanvas.width = 0;
        this.#lineCanvas.height = 0;
        this.loadSrc();
      }
    }
  }

  loadSrc() {
    if (this.#refCanvas && this.#lineCanvas) {
      copyImageToCanvasFromURL(this.#refCanvas, this.src);
    }
  }
}

if (typeof window !== 'undefined') {
  window.customElements.define('repa-lines', RepaLines);
}
