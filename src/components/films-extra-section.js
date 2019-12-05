import {createElement} from './utils.js';
const getExtraSectionHeading = (headingText) => `<h2 class="films-list__title">${headingText}</h2>`;
const getFilmsExtraSection = (headingText) => `
<section class="films-list--extra">
  ${getExtraSectionHeading(headingText)}
  <div class="films-list__container"></div>
</section>`;

export default class FilmsExtraSection {
  constructor(headingText) {
    this._headingText = headingText;
    this._element = null;
  }
  getTemplate() {
    return getFilmsExtraSection(this._headingText);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element.remove();
    this._element = null;
  }
  getContainerElement() {
    return this.getElement().querySelector(`.films-list__container`);
  }
}
