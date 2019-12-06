import AbstractComponent from "./abstract-component.js";

const getFilmsSectionContainer = () => `<section class="films"></section>`;

export default class FilmsSectionContainer extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return getFilmsSectionContainer();
  }
}
