import {createElement} from './utils.js';

const getNav = (totalFilmsData) => {
  const inWatchlistFilms = totalFilmsData.filter((item) => {
    return item.isInWatchlist;
  });
  const inHistoryFilms = totalFilmsData.filter((item) => {
    return item.isAlready;
  });
  const inFavoritesFilms = totalFilmsData.filter((item) => {
    return item.ifFavorites;
  });
  return `
  <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${inWatchlistFilms.length}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${inHistoryFilms.length}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${inFavoritesFilms.length}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`;
};

export default class Nav {
  constructor(totalFilmsData) {
    this._totalFilmsData = totalFilmsData;
    this._element = null;
  }
  getTemplate() {
    return getNav(this._totalFilmsData);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
