import {createElement} from './utils.js';
const getExtraSectionHeading = (headingText) => `<h2 class="films-list__title">${headingText}</h2>`;

export default class ExtraSectionHeading {
  constructor(headingText) {
    this._element = null;
    this._headingText = headingText;
  }
  getTemplate() {
    return getExtraSectionHeading(this._headingText);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
