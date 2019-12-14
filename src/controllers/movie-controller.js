import FilmCard from '../components/film-card.js';
import FilmPopup from '../components/film-popup.js';
import {insertElementInMarkup} from '../components/utils.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this.onDataChange = onDataChange;
    this.showPopup = this.showPopup.bind(this);
  }
  setStatusHandlers() {
    this._filmCard.onDataChange = this.onDataChange;
    this._filmPopup.onDataChange = this.onDataChange;
    this._filmCard.changeInWatchlistStatusHandler();
    this._filmCard.changeInAlreadyStatusHandler();
    this._filmCard.changeInFavoritesStatusHandler();
    this._filmPopup.changeInWatchlistStatusHandler();
    this._filmPopup.changeInAlreadyStatusHandler();
    this._filmPopup.changeInFavoritesStatusHandler();
  }
  showPopup() {
    insertElementInMarkup(this._filmPopup.getElement(), document.body);
    this._filmPopup.setHandlers();
  }
  render(filmData) {
    this._data = filmData;
    this._filmCard = new FilmCard(this._data);
    this._filmPopup = new FilmPopup(this._data);
    this._filmCard.setClickHandler(this.showPopup);
    this.setStatusHandlers();
    this._filmPopup.setUserRating();
    this._filmPopup.selectReactionHandler();
    insertElementInMarkup(this._filmCard, this._container);
  }
}
