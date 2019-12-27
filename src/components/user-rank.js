import AbstractComponent from "./abstract-component.js";

const getUserRank = (rank) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank extends AbstractComponent {
  constructor(watchedFilmsSum) {
    super();
    this._watchedFilmsSum = watchedFilmsSum;
  }
  getTemplate() {
    return getUserRank(this.getRank());
  }
  getRank() {
    if (!this.rank) {
      let rank = null;
      if (this._watchedFilmsSum >= 90) {
        rank = `Cinema expert`;
      } else if (this._watchedFilmsSum >= 70) {
        rank = `Cinema connoisseur`;
      } else if (this._watchedFilmsSum >= 40) {
        rank = `Movie Buff`;
      } else if (this._watchedFilmsSum < 40) {
        rank = `Cinema newbie`;
      }
      this.rank = rank;
    }
    return this.rank;
  }
}
