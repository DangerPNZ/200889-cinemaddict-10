import AbstractComponent from "./abstract-component.js";

const RankName = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};
const ValueForRank = {
  NOVICE: {
    MIN: 1,
    MAX: 10
  },
  FAN: {
    MIN: 11,
    MAX: 20
  },
  MOVIE_BUFF: {
    MIN: 21
  }
};

const getWatchedMoviesSum = (moviesData) => {
  if (moviesData.length) {
    const watchedMoviesData = moviesData.filter((item) => item.isAlready === true);
    return watchedMoviesData.length;
  }
  return moviesData.length;
};
const getUserRank = (rank) => {
  if (rank) {
    return `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }
  return `<section class="header__profile profile"></section>`;
};

export default class UserRank extends AbstractComponent {
  constructor(moviesData) {
    super();
    this._watchedFilmsSum = getWatchedMoviesSum(moviesData);
  }
  getRank() {
    if (this._watchedFilmsSum >= ValueForRank.MOVIE_BUFF.MIN) {
      return RankName.MOVIE_BUFF;
    } else if (this._watchedFilmsSum >= ValueForRank.FAN.MIN && this._watchedFilmsSum <= ValueForRank.FAN.MAX) {
      return RankName.FAN;
    } else if (this._watchedFilmsSum >= ValueForRank.NOVICE.MIN && this._watchedFilmsSum <= ValueForRank.NOVICE.MAX) {
      return RankName.NOVICE;
    }
    return null;
  }
  getTemplate() {
    return getUserRank(this.getRank());
  }
}
