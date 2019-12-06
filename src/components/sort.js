import AbstractComponent from "./abstract-component.js";

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

export default class Sort extends AbstractComponent {
  constructor() {
    super();
  }
  getTemplate() {
    return getSort();
  }
}
