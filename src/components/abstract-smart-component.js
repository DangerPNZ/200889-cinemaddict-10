import AbstractComponent from "./abstract-component.js";

export default class AbstractSmartComponent extends AbstractComponent {
  constructor(data) {
    super();
    this.data = data;
  }
  rerender(newData) {
    if (this._element) {
      const oldElement = this.getElement();
      const parent = oldElement.parentElement;
      this.removeElement();
      if (newData) {
        this.data = newData;
      }
      const newElement = this.getElement();
      parent.replaceChild(newElement, oldElement);
      if (this.recoveryListeners) {
        this.recoveryListeners();
      }
    }
  }
}
