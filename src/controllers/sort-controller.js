import Sort from '../components/sort.js';
import {insertElementInMarkup} from '../components/utils.js';

const ACTIVE_SORT_BTN_CLS = `sort__button--active`;
const DATA_SORT_ATTRIBUTE = `data-sorttype`;

export default class SortController {
  constructor(model, container) {
    this.container = container;
    this.model = model;
    this.component = new Sort();
    this.handler = this.handler.bind(this);
  }
  handler(event) {
    event.preventDefault();
    const targetBtn = event.target;
    if (!targetBtn.classList.contains(ACTIVE_SORT_BTN_CLS)) {
      const sortType = targetBtn.getAttribute(DATA_SORT_ATTRIBUTE);
      const activeBtn = this.component.getElement().querySelector(`.${ACTIVE_SORT_BTN_CLS}`);
      activeBtn.classList.remove(ACTIVE_SORT_BTN_CLS);
      targetBtn.classList.add(ACTIVE_SORT_BTN_CLS);
      this.model.onChangeSortType(sortType);
    }
  }
  render() {
    insertElementInMarkup(this.component.getElement(), this.container);
    this.component.setHandlers(this.handler);
  }
}
