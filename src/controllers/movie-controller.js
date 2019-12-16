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
      if (item.filmPopup) {
        item.filmPopup.closeHandler();
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
    this.filmPopup = new FilmPopup(this.data);
    this.filmPopup.onDataChange = this.onDataChange;
    this.filmPopup.setCloseHandlers();
    this.filmPopup.setUserRatingChangeHandler();
    this.filmPopup.setSelectReactionHandler();
    this.filmPopup.setChangeStatusHandler(this.changeStatus);
    insertElementInMarkup(this.filmPopup.getElement(), document.body);
  }
  render(filmData) {
    this.data = filmData;
    this.filmCard = new FilmCard(this.data);
    this.filmCard.onDataChange = this.onDataChange;
    this.filmCard.setShowDetailsHandlers(this.showPopup);
    this.filmCard.setChangeStatusHandler(this.changeStatus);
    insertElementInMarkup(this.filmCard, this._container);
  }
}
