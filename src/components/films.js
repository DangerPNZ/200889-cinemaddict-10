import AbstractComponent from "./abstract-component.js";

const getFilmsSectionContainer = () => `<section class="films"></section>`;

export default class Films extends AbstractComponent {
  getTemplate() {
    return getFilmsSectionContainer();
  }
}
