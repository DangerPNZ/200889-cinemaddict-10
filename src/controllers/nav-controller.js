import Nav from '../components/nav.js';
import {insertElementInMarkup} from '../utils/utils.js';

const ACTIVE_NAV_BTN_CLS = `main-navigation__item--active`;
const DATA_FILTER_ATTRIBUTE = `data-filtertype`;
const DEFAULT_ACTIVE_FILTER_BTN_ATTR = `#all`;
const ACTIVE_FILTER_ITEM_SELECTOR = `.${ACTIVE_NAV_BTN_CLS}:not(.main-navigation__item--additional)`;

export default class NavController {
  constructor(model, container, onToStatistic, onToFilms) {
    this.model = model;
    this.component = new Nav(model.getAllMoviesData());
    this.container = container;
    this.filterBtnHandler = this.filterBtnHandler.bind(this);
    this.statBtnHandler = this.statBtnHandler.bind(this);
    this.onToStatistic = onToStatistic;
    this.onToFilms = onToFilms;
    this._filmsShowState = true;
  }
  rerender() {
    this.component.getElement().remove();
    this.component.removeElement();
    this.component = new Nav(this.model.getAllMoviesData());
    this.render();
    this._setCurrentActiveItem();
  }
  render() {
    insertElementInMarkup(this.component.getElement(), this.container, `prepend`);
    this.component.setFilterHandlers(this.filterBtnHandler);
    this.component.setToStatisticBtnHandler(this.statBtnHandler);
  }
  _setCurrentActiveItem() {
    if (this._selectedFilterType && this._selectedFilterType !== DEFAULT_ACTIVE_FILTER_BTN_ATTR) {
      this.component.getElement().querySelector(ACTIVE_FILTER_ITEM_SELECTOR).classList.remove(ACTIVE_NAV_BTN_CLS);
      this.component.getElement().querySelector(`.main-navigation__item[${DATA_FILTER_ATTRIBUTE}="${this._selectedFilterType}"]`)
      .classList.add(ACTIVE_NAV_BTN_CLS);
    }
  }
  filterBtnHandler(event) {
    event.preventDefault();
    const targetBtn = event.target;
    if (!targetBtn.classList.contains(ACTIVE_NAV_BTN_CLS)) {
      const filterType = targetBtn.getAttribute(DATA_FILTER_ATTRIBUTE);
      const activeBtn = this.component.getElement().querySelector(`.${ACTIVE_NAV_BTN_CLS}`);
      activeBtn.classList.remove(ACTIVE_NAV_BTN_CLS);
      targetBtn.classList.add(ACTIVE_NAV_BTN_CLS);
      this._selectedFilterType = filterType;
      this.model.changeFilterType(filterType);
      if (!this._filmsShowState) {
        this.onToFilms();
        this._filmsShowState = true;
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
      this._filmsShowState = false;
      this.onToStatistic();
    }
  }
}
