import {createElement} from './utils.js';

const getSearchHeading = () => `<h2 class="films-list__title">Loading...</h2>`;

export default class SearchHeading {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return getSearchHeading();
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
