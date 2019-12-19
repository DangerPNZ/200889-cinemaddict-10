import AbstractComponent from "./abstract-component.js";


const getNav = (totalFilmsData) => {
  const inWatchlistFilms = totalFilmsData.filter((item) => {
    return item.isInWatchlist;
  });
  const inHistoryFilms = totalFilmsData.filter((item) => {
    return item.isAlready;
  });
  const inFavoritesFilms = totalFilmsData.filter((item) => {
    return item.isFavorites;
  });
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
  constructor(totalFilmsData) {
    super();
    this._totalFilmsData = totalFilmsData;
  }
  getTemplate() {
    return getNav(this._totalFilmsData);
  }
  getActiveFilterType() {
    return this.getElement().querySelector(`.main-navigation__item--active:not(.main-navigation__item--additional)`).getAttribute(`data-filtertype`);
  }
}
