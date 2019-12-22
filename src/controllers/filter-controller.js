import Nav from '../components/nav.js';
import {insertElementInMarkup} from '../components/utils.js';

const ACTIVE_FILTER_BTN_CLS = `main-navigation__item--active`;
const DATA_FILTER_ATTRIBUTE = `data-filtertype`;
const DEFAULT_ACTIVE_FILTER_BTN_ATTR = `#all`;
const ACTIVE_FILTER_ITEM_SELECTOR = `.${ACTIVE_FILTER_BTN_CLS}:not(.main-navigation__item--additional)`;

export default class FilterController {
  constructor(model, container) {
    this.model = model;
    this.component = new Nav(model.getMoviesData());
    this.container = container;
    this.handler = this.handler.bind(this);
  }
  handler(event) {
    event.preventDefault();
    const targetBtn = event.target;
    if (!targetBtn.classList.contains(ACTIVE_FILTER_BTN_CLS)) {
      const filterType = targetBtn.getAttribute(DATA_FILTER_ATTRIBUTE);
      const activeBtn = this.component.getElement().querySelector(ACTIVE_FILTER_ITEM_SELECTOR);
      activeBtn.classList.remove(ACTIVE_FILTER_BTN_CLS);
      targetBtn.classList.add(ACTIVE_FILTER_BTN_CLS);
      this.selectedFilterType = filterType;
      this.model.onChangeFilterType(filterType);
    }
  }
  setCurrentActiveItem() {
    if (this.selectedFilterType && this.selectedFilterType !== DEFAULT_ACTIVE_FILTER_BTN_ATTR) {
      this.component.getElement().querySelector(ACTIVE_FILTER_ITEM_SELECTOR).classList.remove(ACTIVE_FILTER_BTN_CLS);
      this.component.getElement().querySelector(`.main-navigation__item[${DATA_FILTER_ATTRIBUTE}="${this.selectedFilterType}"]`)
      .classList.add(ACTIVE_FILTER_BTN_CLS);
    }
  }
  rerender() {
    this.component.getElement().remove();
    this.component.removeElement();
    this.component = new Nav(this.model.getMoviesData());
    this.render();
    this.setCurrentActiveItem();
  }
  render() {
    insertElementInMarkup(this.component.getElement(), this.container, `prepend`);
    this.component.setHandlers(this.handler);
  }
}
