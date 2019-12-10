import FilmCard from '../components/film-card.js';
import {insertElementInMarkup} from '../components/utils.js';

export default class MovieController {
  constructor(container, popup) {
    this._container = container;
    this._popup = popup;
    this.showPopup = this.showPopup.bind(this);
  }
  showPopup() {
    insertElementInMarkup(this._popup.getElement(), this._container);
    this._popup.setHandlers();
  }
  render(filmData) {
    this._filmCard = new FilmCard(filmData);
    this._filmCard.setClickHandler(this.showPopup);
    insertElementInMarkup(this._filmCard, this._container);
  }
}
