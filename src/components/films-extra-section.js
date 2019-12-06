import AbstractComponent from './abstract-component.js';

const getFilmsExtraSection = (headingText) => `
<section class="films-list--extra">
  <h2 class="films-list__title">${headingText}</h2>
  <div class="films-list__container"></div>
</section>`;

export default class FilmsExtraSection extends AbstractComponent {
  constructor(headingText) {
    super();
    this._headingText = headingText;
  }
  getTemplate() {
    return getFilmsExtraSection(this._headingText);
  }
  getContainerElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
