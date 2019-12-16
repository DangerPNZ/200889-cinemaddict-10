import FilmCard from '../components/film-card.js';
import FilmPopup from '../components/film-popup.js';
import {insertElementInMarkup} from '../components/utils.js';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this.onDataChange = onDataChange;
    this.onViewChange = onViewChange;
    this.showPopup = this.showPopup.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }
  setDefaultView() {
    const controllers = this.onViewChange();
    controllers.forEach((item) => {
      if (item._filmPopup) {
        item._filmPopup.closeHandler();
      }
    });
  }
  changeStatus(property) {
    const newData = Object.assign({}, this.data);
    newData[property] = !newData[property];
    if (property === `isAlready` && newData[property] === false) {
      newData.userRatingValue = null;
    }
    this.onDataChange(this.data, newData);
  }
  showPopup() {
    this.setDefaultView();
    this._filmPopup = new FilmPopup(this.data);
    this._filmPopup.onDataChange = this.onDataChange;
    this._filmPopup.setCloseHandlers();
    this._filmPopup.setUserRatingChangeHandler();
    this._filmPopup.setSelectReactionHandler();
    this._filmPopup.setChangeStatusHandler(this.changeStatus);
    insertElementInMarkup(this._filmPopup.getElement(), document.body);
  }
  render(filmData) {
    this.data = filmData;
    this._filmCard = new FilmCard(this.data);
    this._filmCard.onDataChange = this.onDataChange;
    this._filmCard.setShowDetailsHandlers(this.showPopup);
    this._filmCard.setChangeStatusHandler(this.changeStatus);
    insertElementInMarkup(this._filmCard, this._container);
  }
}
