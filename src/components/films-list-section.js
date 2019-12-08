import AbstractComponent from "./abstract-component.js";


const getFilmsListSection = (filmsContainer) => `
  <section class="films-list">
    ${filmsContainer}
    <button class="films-list__show-more">Show more</button>
  </section>
`;

export default class FilmsListSection extends AbstractComponent {
  constructor(filmsContainer) {
    super();
    this._filmsContainer = filmsContainer;
  }
  getTemplate() {
    return getFilmsListSection(this._filmsContainer);
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
