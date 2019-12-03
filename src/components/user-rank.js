import {createElement} from './utils.js';

const getUserRank = (watchedFilmsSum) => {
  let rank = null;
  if (watchedFilmsSum > 90) {
    rank = `Cinema expert`;
  } else if (watchedFilmsSum > 70) {
    rank = `Cinema connoisseur`;
  } else if (watchedFilmsSum > 40) {
    rank = `Movie Buff`;
  } else if (watchedFilmsSum < 40) {
    rank = `Cinema newbie`;
  }
  return `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank {
  constructor(watchedFilmsSum) {
    this._watchedFilmsSum = watchedFilmsSum;
    this._element = null;
  }
  getTemplate() {
    return getUserRank(this._watchedFilmsSum);
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    this._element = null;
  }
}
