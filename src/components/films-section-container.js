import {createElement} from './utils.js';

const getFilmsSectionContainer = () => `<section class="films"></section>`;

export default class FilmsSectionContainer {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return getFilmsSectionContainer();
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element.remove();
    this._element = null;
  }
}
