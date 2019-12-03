import {createElement} from './utils.js';

const getFilmsListSection = () => `<section class="films-list"></section>`;

export default class FilmsListSection {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return getFilmsListSection();
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
