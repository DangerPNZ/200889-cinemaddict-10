import FilmCard from '../components/film-card.js';
import FilmPopup from '../components/film-popup.js';
import {insertElementInMarkup} from '../components/utils.js';

export default class MovieController {
  constructor(container) {
    this._container = container;
    this.showPopup = this.showPopup.bind(this);
  }
  showPopup() {
    insertElementInMarkup(this._filmPopup.getElement(), this._container);
    this._filmPopup.setHandlers();
  }
  render(filmData) {
    this._filmCard = new FilmCard(filmData);
    this._filmPopup = new FilmPopup(filmData);
    this._filmCard.setClickHandler(this.showPopup);
    this._filmCard.setStatusHandlers();
    insertElementInMarkup(this._filmCard, this._container);
  }
}
