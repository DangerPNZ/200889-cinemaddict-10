import AbstractSmartComponent from "./abstract-smart-component.js";
import {getFilmDuration} from './utils.js';

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
    comments
  } = filmData;

  return `
    <article class="film-card">
        <h3 class="film-card__title">${filmTitle}</h3>
        <p class="film-card__rating">${ratingVal}</p>
        <p class="film-card__info">
            <span class="film-card__year">${releaseYear}</span>
            <span class="film-card__duration">${getFilmDuration(filmDuration)}</span>
            <span class="film-card__genre">${genre}</span>
        </p>
        <img src="${posterSrc}" alt="${`${filmTitle} movie poster`}" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">${comments.length} comments</a>
        <form class="film-card__controls">
            <button data-status="isInWatchlist" class="film-card__controls-item button film-card__controls-item--add-to-watchlist${setState(isInWatchlist)}">Add to watchlist</button>
            <button data-status="isAlready" class="film-card__controls-item button film-card__controls-item--mark-as-watched${setState(isAlready)}">Mark as watched</button>
            <button data-status="isFavorites" class="film-card__controls-item button film-card__controls-item--favorite${setState(isFavorites)}">Mark as favorite</button>
        </form>
  </article>`;
};
export default class FilmCard extends AbstractSmartComponent {
  constructor(data) {
    super();
    this.data = data;
  }
  getTemplate() {
    return getFilmCard(this.data);
  }
  getCallDetailsItems() {
    const poster = this.getElement().querySelector(`.film-card__poster`);
    const heading = this.getElement().querySelector(`.film-card__title`);
    const toCommentsLink = this.getElement().querySelector(`.film-card__comments`);
    return [poster, heading, toCommentsLink];
  }
  setShowDetailsHandlers(handler) {
    this.showDetailsHandler = handler;
    const elements = this.getCallDetailsItems();
    for (const item of elements) {
      item.addEventListener(`click`, handler);
    }
  }
  setChangeStatusCallbacks(callback) {
    this.changeStatusCallback = callback;
    const statusControlItems = [...this.getElement().querySelectorAll(`.film-card__controls-item`)];
    for (const btn of statusControlItems) {
      btn.addEventListener(`click`, (event) => {
        event.preventDefault();
        const dataProperty = event.target.dataset.status;
        callback(dataProperty);
      });
    }
  }
  recoveryListeners() {
    this.setShowDetailsHandlers(this.showDetailsHandler);
    this.setChangeStatusCallbacks(this.changeStatusCallback);
  }
}
// import moment from 'moment';
// console.log(moment().format(`D MMMM YYYY`));
