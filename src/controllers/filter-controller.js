import Nav from '../components/nav.js';
import {insertElementInMarkup} from '../components/utils.js';

const ACTIVE_FILTER_BTN_CLS = `main-navigation__item--active`;
const DATA_FILTER_ATTRIBUTE = `data-filtertype`;

export default class FilterController {
  constructor(model, container) {
    this.model = model;
    this.component = new Nav(model.filmsDataForRender);
    this.container = container;
    this.handler = this.handler.bind(this);
  }
  handler(event) {
    event.preventDefault();
    const targetBtn = event.target;
    if (!targetBtn.classList.contains(ACTIVE_FILTER_BTN_CLS)) {
      const filterType = targetBtn.getAttribute(DATA_FILTER_ATTRIBUTE);
      const activeBtn = this.component.getElement().querySelector(`.${ACTIVE_FILTER_BTN_CLS}:not(.main-navigation__item--additional)`);
      activeBtn.classList.remove(ACTIVE_FILTER_BTN_CLS);
      targetBtn.classList.add(ACTIVE_FILTER_BTN_CLS);
      this.model.onChangeFilterType(filterType);
    }
  }
  rerender() {
    this.component.removeElement();
    this.render();
  }
  render() {
    insertElementInMarkup(this.component.getElement(), this.container, `prepend`);
    this.component.setHandlers(this.handler);
  }
}
