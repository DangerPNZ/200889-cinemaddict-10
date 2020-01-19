import AbstractComponent from "./abstract-component.js";

const getStateHeading = (stateInfo) => `<h2 class="films-list__title">${stateInfo}</h2>`;

export default class StateHeading extends AbstractComponent {
  constructor(stateText) {
    super();
    this._stateText = stateText;
  }
  getTemplate() {
    return getStateHeading(this._stateText);
  }
}
