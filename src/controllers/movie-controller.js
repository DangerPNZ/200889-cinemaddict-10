import FilmCard from '../components/film-card.js';
import FilmPopup from '../components/film-popup.js';
import {insertElementInMarkup} from '../utils/utils.js';
import {removeIt} from '../utils/utils.js';
import moment from 'moment';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this.onDataChange = onDataChange;
    this.onViewChange = onViewChange;
    this.showPopup = this.showPopup.bind(this);
    this.changeUserRatingValue = this.changeUserRatingValue.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.removeComment = this.removeComment.bind(this);
    this.addNewComment = this.addNewComment.bind(this);
    this.rerenderComponent = this.rerenderComponent.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.removeElements = this.removeElements.bind(this);
  }
  rerenderComponent(newData) {
    this.data = newData;
    this.filmCard.rerender(newData);
    if (this.filmPopup) {
      this.filmPopup.rerender(newData);
    }
  }
  closePopup() {
    if (this.filmPopup) {
      this.filmPopup.closePopup();
      this.filmPopup = undefined;
    }
  }
  removeElements() {
    let hasPopup = false;
    if (this.filmPopup) {
      hasPopup = true;
      this.closePopup();
    }
    removeIt(this.filmCard);
    return hasPopup;
  }
  showPopup() {
    this.onViewChange();
    this.filmPopup = new FilmPopup(this.data);
    this.filmPopup.setAddNewCommentCallback(this.addNewComment);
    insertElementInMarkup(this.filmPopup.getElement(), document.body);
    this.filmPopup.setCurrentUserRating();
    this.filmPopup.setRemoveCommentCallbacks(this.removeComment);
    this.filmPopup.setCloseHandlers();
    this.filmPopup.setUserRatingChangeCallbacks(this.changeUserRatingValue);
    this.filmPopup.setUserRatingResetCallback(this.changeUserRatingValue);
    this.filmPopup.onSelectReaction();
    this.filmPopup.setChangeStatusCallbacks(this.changeStatus);
    this.filmPopup.sendNewComment();
  }
  render(filmData) {
    this.data = filmData;
    this.id = filmData.id;
    this.filmCard = new FilmCard(this.data);
    insertElementInMarkup(this.filmCard, this._container);
    this.filmCard.setShowDetailsHandlers(this.showPopup);
    this.filmCard.setChangeStatusCallbacks(this.changeStatus);
  }
  changeUserRatingValue(value = 0) {
    const oldData = this.data;
    const newData = Object.assign({}, this.data);
    newData.userRatingValue = value;
    this.onDataChange(this.id, newData, oldData);
  }
  changeStatus(property) {
    const oldData = this.data;
    const newData = Object.assign({}, this.data);
    newData[property] = !newData[property];
    if (property === `isAlready` && newData[property]) {
      newData.watchingDate = moment().toISOString();
    }
    this.onDataChange(this.id, newData, oldData);
  }
  removeComment(commentId) {
    this.onDataChange(commentId);
  }
  addNewComment(newCommentData) {
    this.onDataChange(this.id, newCommentData);
  }
}
