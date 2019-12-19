export default class FilterController {
  constructor(filterComponent) {
    this.filterComponent = filterComponent;
  }
  setFilterHandlers(handler) {
    this.filterHandler = handler;
    const filterItems = this.filterComponent.getElement().querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);
    for (const item of filterItems) {
      item.addEventListener(`click`, handler);
    }
  }
}
