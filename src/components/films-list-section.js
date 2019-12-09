import AbstractComponent from "./abstract-component.js";


const getFilmsListSection = () => `
  <section class="films-list">
    <div class="films-list__container"></div>
    <button class="films-list__show-more">Show more</button>
  </section>
`;

export default class FilmsListSection extends AbstractComponent {
  getTemplate() {
    return getFilmsListSection();
  }
  getContainerElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }
  getShowMoreBtn() {
    return this.getElement().querySelector(`.films-list__show-more`);
  }
  setHandlerForShowMoreBtn(handler) {
    const btn = this.getShowMoreBtn();
    btn.addEventListener(`click`, handler);
  }
}
