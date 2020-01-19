import AbstractComponent from "./abstract-component.js";

const getSort = () => `
<ul class="sort">
    <li>
        <a href="#" data-sorttype="default" class="sort__button sort__button--active">Sort by default</a>
    </li>
    <li>
        <a href="#" data-sorttype="releaseDate" class="sort__button">Sort by date</a>
    </li>
    <li>
        <a href="#" data-sorttype="ratingVal" class="sort__button">Sort by rating</a>
    </li>
</ul>`;

export default class Sort extends AbstractComponent {
  getTemplate() {
    return getSort();
  }
  setHandlers(handler) {
    const sortBtns = this.getElement().querySelectorAll(`a[data-sorttype]`);
    sortBtns.forEach((btn) => {
      btn.addEventListener(`click`, handler);
    });
  }
}
