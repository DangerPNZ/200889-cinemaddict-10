import AbstractComponent from "./abstract-component.js";

export default class AbstractSmartComponent extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }
  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, oldElement);
  }
}
