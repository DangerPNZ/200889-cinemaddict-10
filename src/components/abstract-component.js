import {createElement} from './utils.js';

export default class AbstractComponent {
  constructor() {
    this._element = null;
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
  }
  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
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
  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }
  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }
}
