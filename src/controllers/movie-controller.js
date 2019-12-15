import FilmCard from '../components/film-card.js';
import FilmPopup from '../components/film-popup.js';
import {insertElementInMarkup} from '../components/utils.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this.onDataChange = onDataChange;
    this.showPopup = this.showPopup.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  changeStatus(property) {
    const newData = Object.assign({}, this._data);
    newData[property] = !newData[property];
    if (property === `isAlready` && newData[property] === false) {
      newData.userRatingValue = null;
    }
    this.onDataChange(this._data, newData);
  }
  showPopup() {
    this._filmPopup = new FilmPopup(this._data);
    this._filmPopup.setCloseHandlers();
    this._filmPopup.setUserRatingChangeHandler();
    this._filmPopup.setSelectReactionHandler();
    this._filmPopup.setChangeStatusHandler(this.changeStatus);
    insertElementInMarkup(this._filmPopup.getElement(), document.body);
  }
  render(filmData) {
    this._data = filmData;
    this._filmCard = new FilmCard(this._data);
    this._filmCard.onDataChange = this.onDataChange;
    this._filmCard.setShowDetailsHandlers(this.showPopup);
    this._filmCard.setChangeStatusHandler(this.changeStatus);
    insertElementInMarkup(this._filmCard, this._container);
  }
}
