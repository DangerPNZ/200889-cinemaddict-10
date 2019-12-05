import {createElement} from './utils.js';

const getStateHeading = (stateInfo) => `<h2 class="films-list__title">${stateInfo}</h2>`;

export default class StateHeading {
  constructor(stateText) {
    this._stateText = stateText;
    this._element = null;
  }
  getTemplate() {
    return getStateHeading(this._stateText);
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
