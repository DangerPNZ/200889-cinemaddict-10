import {createElement} from './utils.js';
const getFilmsExtraSection = () => `<section class="films-list--extra"></section>`;

export default class FilmsExtraSection {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return getFilmsExtraSection();
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
