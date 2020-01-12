import Nav from '../components/nav.js';
import {insertElementInMarkup} from '../components/utils.js';

const ACTIVE_NAV_BTN_CLS = `main-navigation__item--active`;
const DATA_FILTER_ATTRIBUTE = `data-filtertype`;
const DEFAULT_ACTIVE_FILTER_BTN_ATTR = `#all`;
const ACTIVE_FILTER_ITEM_SELECTOR = `.${ACTIVE_NAV_BTN_CLS}:not(.main-navigation__item--additional)`;

export default class NavController {
  constructor(model, container, onToStatistic, onToFilms) {
    this.model = model;
    this.component = new Nav(model.getMoviesDataForRender());
    this.container = container;
    this.filterBtnHandler = this.filterBtnHandler.bind(this);
    this.statBtnHandler = this.statBtnHandler.bind(this);
    this.onToStatistic = onToStatistic;
    this.onToFilms = onToFilms;
    this.filmsShowState = true;
  }
  filterBtnHandler(event) {
    event.preventDefault();
    const targetBtn = event.target;
    if (!targetBtn.classList.contains(ACTIVE_NAV_BTN_CLS)) {
      const filterType = targetBtn.getAttribute(DATA_FILTER_ATTRIBUTE);
      const activeBtn = this.component.getElement().querySelector(`.${ACTIVE_NAV_BTN_CLS}`);
      activeBtn.classList.remove(ACTIVE_NAV_BTN_CLS);
      targetBtn.classList.add(ACTIVE_NAV_BTN_CLS);
      this.selectedFilterType = filterType;
      this.model.changeFilterType(filterType);
      if (!this.filmsShowState) {
        this.onToFilms();
        this.filmsShowState = true;
      }
    }
  }
  statBtnHandler(event) {
    event.preventDefault();
    const targetBtn = event.target;
    if (!targetBtn.classList.contains(ACTIVE_NAV_BTN_CLS)) {
      const activeBtn = this.component.getElement().querySelector(ACTIVE_FILTER_ITEM_SELECTOR);
      activeBtn.classList.remove(ACTIVE_NAV_BTN_CLS);
      targetBtn.classList.add(ACTIVE_NAV_BTN_CLS);
      this.filmsShowState = false;
      this.onToStatistic();
    }
  }
  setCurrentActiveItem() {
    if (this.selectedFilterType && this.selectedFilterType !== DEFAULT_ACTIVE_FILTER_BTN_ATTR) {
      this.component.getElement().querySelector(ACTIVE_FILTER_ITEM_SELECTOR).classList.remove(ACTIVE_NAV_BTN_CLS);
      this.component.getElement().querySelector(`.main-navigation__item[${DATA_FILTER_ATTRIBUTE}="${this.selectedFilterType}"]`)
      .classList.add(ACTIVE_NAV_BTN_CLS);
    }
  }
  rerender() {
    this.component.getElement().remove();
    this.component.removeElement();
    this.component = new Nav(this.model.moviesData);
    this.render();
    this.setCurrentActiveItem();
  }
  render() {
    insertElementInMarkup(this.component.getElement(), this.container, `prepend`);
    this.component.setFilterHandlers(this.filterBtnHandler);
    this.component.setToStatisticBtnHandler(this.statBtnHandler);
  }
}
