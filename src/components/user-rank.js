import AbstractComponent from "./abstract-component.js";

const getWatchedMoviesSum = (moviesData) => {
  if (moviesData.length) {
    const watchedMoviesData = moviesData.filter((item) => item.isAlready === true);
    return watchedMoviesData.length;
  } else {
    return moviesData.length;
  }
};
const getUserRank = (rank) => {
  if (rank) {
    return `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  } else {
    return `<section class="header__profile profile"></section>`;
  }
};

export default class UserRank extends AbstractComponent {
  constructor(moviesData) {
    super();
    this._watchedFilmsSum = getWatchedMoviesSum(moviesData);
  }
  getRank() {
    let rank = null;
    if (this._watchedFilmsSum >= 15) {
      rank = `Cinema expert`;
    } else if (this._watchedFilmsSum >= 10 && this._watchedFilmsSum <= 15) {
      rank = `Cinema connoisseur`;
    } else if (this._watchedFilmsSum >= 5 && this._watchedFilmsSum <= 10) {
      rank = `Movie Buff`;
    } else if (this._watchedFilmsSum < 5 && this._watchedFilmsSum > 0) {
      rank = `Cinema newbie`;
    }
    return rank;
  }
  getTemplate() {
    return getUserRank(this.getRank());
  }
}
