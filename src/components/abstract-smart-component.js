import AbstractComponent from "./abstract-component.js";

export default class AbstractSmartComponent extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }
  rerender(newData) {
    // console.log(newData);
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;
    this.removeElement();
    this._data = newData;
    const newElement = this.getElement();
    parent.replaceChild(newElement, oldElement);
    this.recoveryListeners();
  }
}
