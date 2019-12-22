import FilmCard from '../components/film-card.js';
import FilmPopup from '../components/film-popup.js';
import {insertElementInMarkup} from '../components/utils.js';

export default class MovieController {
  constructor(container, onDataChange, onViewChange, onStateCountChange) {
    this._container = container;
    this.onDataChange = onDataChange;
    this.onViewChange = onViewChange;
    this.onStateCountChange = onStateCountChange;
    this.showPopup = this.showPopup.bind(this);
    this.changeUserRatingValue = this.changeUserRatingValue.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }
  setDefaultView() {
    const controllers = this.onViewChange();
    controllers.forEach((item) => {
      if (item.filmPopup) {
        item.filmPopup.closeHandler();
      }
    });
  }
  changeUserRatingValue(value = null) {
    const newData = Object.assign({}, this.data);
    newData.userRatingValue = value;
    this.onDataChange(this.id, newData);
  }
  changeStatus(property) {
    const newData = Object.assign({}, this.data);
    newData[property] = !newData[property];
    if (property === `isAlready` && newData[property] === false) {
      newData.userRatingValue = null;
    }
    this.onDataChange(this.id, newData);
    this.onStateCountChange();
  }
  showPopup() {
    this.setDefaultView();
    this.filmPopup = new FilmPopup(this.data);
    insertElementInMarkup(this.filmPopup.getElement(), document.body);
    this.filmPopup.setCurrentUserRating();
    this.filmPopup.onDataChange = this.onDataChange;
    this.filmPopup.onStateCountChange = this.onStateCountChange;
    this.filmPopup.setCloseHandlers();
    this.filmPopup.setUserRatingChangeHandler(this.changeUserRatingValue);
    this.filmPopup.resetUserRatingChangeHandler(this.changeUserRatingValue);
    this.filmPopup.setSelectReactionHandler();
    this.filmPopup.setChangeStatusHandler(this.changeStatus);
  }
  render(filmData) {
    this.data = filmData;
    this.id = filmData.id;
    this.filmCard = new FilmCard(this.data);
    insertElementInMarkup(this.filmCard, this._container);
    this.filmCard.onDataChange = this.onDataChange;
    this.filmCard.onStateCountChange = this.onStateCountChange;
    this.filmCard.setShowDetailsHandlers(this.showPopup);
    this.filmCard.setChangeStatusHandler(this.changeStatus);
  }
}
