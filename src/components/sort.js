import {createElement} from './utils.js';

const getSort = () => `
<ul class="sort">
    <li>
        <a href="#" id="sort-default" class="sort__button sort__button--active">Sort by default</a>
    </li>
    <li>
        <a href="#" id="sort-by-date" class="sort__button">Sort by date</a>
    </li>
    <li>
        <a href="#" id="sort-by-rating" class="sort__button">Sort by rating</a>
    </li>
</ul>`;

export default class Sort {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return getSort();
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
}
