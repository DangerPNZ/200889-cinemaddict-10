import AbstractComponent from "./abstract-component.js";

const getShowMoreBtn = () => `<button class="films-list__show-more">Show more</button>`;

export default class ShowMoreBtn extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return getShowMoreBtn();
  }
  getCallElements() {
    const btn = this.getElement();
    return [btn];
  }
}
