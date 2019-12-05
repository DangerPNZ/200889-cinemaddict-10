import {createElement} from './utils.js';

const getFilmsListSection = () => `
  <section class="films-list">
    <div class="films-list__container"></div>
  </section>
`;

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
    this._element.remove();
    this._element = null;
  }
  getContainerElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
