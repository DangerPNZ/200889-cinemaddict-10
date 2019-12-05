import {createElement} from './utils.js';
const getFilmCard = (filmData) => {
  const {
    filmTitle,
    ratingVal,
    releaseYear,
    filmDuration,
    genre,
    posterSrc,
    description,
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
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
        </form>
  </article>`;
};
export default class FilmCard {
  constructor(data) {
    this._element = null;
    this._data = data;
  }
  getTemplate() {
    return getFilmCard(this._data);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element.remove();
    this._element = null;
  }
  getPopupCallElements() {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    const heading = this.getElement().querySelector(`.film-card__title`);
    const toCommentsLink = this.getElement().querySelector(`.film-card__comments`);
    return [poster, heading, toCommentsLink];
  }
  setClickHandler(handler) {
    const elementsForPopupCall = this.getPopupCallElements();
    for (const element of elementsForPopupCall) {
      element.addEventListener(`click`, handler);
    }
  }
}
