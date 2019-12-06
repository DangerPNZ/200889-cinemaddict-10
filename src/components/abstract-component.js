import {createElement} from './utils.js';

export default class AbstractComponent {
  constructor(useCloseHandler = false) {
    this._element = null;
    this._useCloseHandler = useCloseHandler;
    this.escapeBtnHandler = this.escapeBtnHandler.bind(this);
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
    if (this._useCloseHandler) {
      this.setCloseHandler();
    }
    return this._element;
  }
  escapeBtnHandler(event) {
    const ESCAPE_KEY_CODE = 27;
    if (event.keyCode === ESCAPE_KEY_CODE) {
      this.removeElement();
    }
  }
  setClickHandler(handler) {
    const elements = this.getCallElements();
    for (const item of elements) {
      item.addEventListener(`click`, handler);
    }
  }
  setCloseHandler() {
    const closeBtn = this.getCloseBtn();
    closeBtn.addEventListener(`click`, () => this.removeElement());
    window.addEventListener(`keydown`, this.escapeBtnHandler);
  }
  removeElement() {
    if (this._useCloseHandler) {
      window.removeEventListener(`keydown`, this.escapeBtnHandler);
    }
    this._element.remove();
    this._element = null;
  }
}
