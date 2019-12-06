import AbstractComponent from "./abstract-component.js";


const getFilmsListSection = () => `
  <section class="films-list">
    <div class="films-list__container"></div>
  </section>
`;

export default class FilmsListSection extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return getFilmsListSection();
  }
  getContainerElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
