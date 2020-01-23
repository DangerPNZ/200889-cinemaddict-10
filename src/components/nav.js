import AbstractComponent from "./abstract-component.js";

const getNav = (totalFilmsData) => {
  const inWatchlistFilms = totalFilmsData.filter((item) => item.isInWatchlist);
  const inHistoryFilms = totalFilmsData.filter((item) => item.isAlready);
  const inFavoritesFilms = totalFilmsData.filter((item) => item.isFavorites);
  return `
  <nav class="main-navigation">
      <a data-filtertype="#all" href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a data-filtertype="#watchlist" href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${inWatchlistFilms.length}</span></a>
      <a data-filtertype="#history" href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${inHistoryFilms.length}</span></a>
      <a data-filtertype="#favorites" href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${inFavoritesFilms.length}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
};

export default class Nav extends AbstractComponent {
  constructor(filmsData) {
    super();
    this.filmsData = filmsData;
  }
  getTemplate() {
    return getNav(this.filmsData);
  }
  setFilterHandlers(handler) {
    const filterItems = this.getElement().querySelectorAll(`.main-navigation__item:not(.main-navigation__item--additional)`);
    for (const item of filterItems) {
      item.addEventListener(`click`, handler);
    }
  }
  setToStatisticBtnHandler(handler) {
    const toStatisticBtn = this.getElement().querySelector(`.main-navigation__item.main-navigation__item--additional`);
    toStatisticBtn.addEventListener(`click`, handler);
  }
}
