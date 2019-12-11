import AbstractComponent from "./abstract-component.js";

const setState = (parameter) => {
  if (parameter) {
    return ` film-card__controls-item--active`;
  } else {
    return ``;
  }
};
const getFilmCard = (filmData) => {
  const {
    filmTitle,
    ratingVal,
    releaseYear,
    filmDuration,
    genre,
    posterSrc,
    description,
    isAlready,
    isInWatchlist,
    isFavorites,
    commentsSum
  } = filmData;

  return `
    <article class="film-card">
        <h3 class="film-card__title">${filmTitle}</h3>
        <p class="film-card__rating">${ratingVal}</p>
        <p class="film-card__info">
            <span class="film-card__year">${releaseYear}</span>
            <span class="film-card__duration">${filmDuration}</span>
            <span class="film-card__genre">${genre}</span>
        </p>
        <img src="${posterSrc}" alt="${`${filmTitle} movie poster`}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${commentsSum} comments</a>
        <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${setState(isInWatchlist)}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${setState(isAlready)}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite${setState(isFavorites)}">Mark as favorite</button>
        </form>
  </article>`;
};
export default class FilmCard extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
    this.changeInWatchlistStatusHandler = this.changeInWatchlistStatusHandler.bind(this);
    this.changeInAlreadyStatusHandler = this.changeInAlreadyStatusHandler.bind(this);
    this.changeInFavoritesStatusHandler = this.changeInFavoritesStatusHandler.bind(this);
  }
  getTemplate() {
    return getFilmCard(this._data);
  }
  getCallElements() {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    const heading = this.getElement().querySelector(`.film-card__title`);
    const toCommentsLink = this.getElement().querySelector(`.film-card__comments`);
    return [poster, heading, toCommentsLink];
  }
  getStatusControlItems() {
    return [...this.getElement().querySelectorAll(`.film-card__controls-item`)];
  }
  setClickHandler(handler) {
    const elements = this.getCallElements();
    for (const item of elements) {
      item.addEventListener(`click`, handler);
    }
  }
  changeInWatchlistStatusHandler() {
    const statusBtn = this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`);
    statusBtn.addEventListener(`click`, () => {
      event.preventDefault();
      this._data.isInWatchlist = !this._data.isInWatchlist;
      this.onDataChange(this, this._data);
    });
  }
  changeInAlreadyStatusHandler() {
    const statusBtn = this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`);
    statusBtn.addEventListener(`click`, () => {
      event.preventDefault();
      this._data.isAlready = !this._data.isAlready;
      this.onDataChange(this, this._data);
    });
  }
  changeInFavoritesStatusHandler() {
    const statusBtn = this.getElement().querySelector(`.film-card__controls-item--favorite`);
    statusBtn.addEventListener(`click`, () => {
      event.preventDefault();
      this._data.isFavorites = !this._data.isFavorites;
      this.onDataChange(this, this._data);
    });
  }
}
