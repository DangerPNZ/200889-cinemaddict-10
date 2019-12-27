import {getRandomNum} from './utils.js';
import AbstractComponent from "./abstract-component.js";

const getWatchedMovies = (movies) => {
  return movies.filter((item) => {
    return item.isAlready === true;
  });
};
const PARAMETER_FOR_GET_HOURS = `hours`;
const PARAMETER_FOR_GET_MINUTES = `minutes`;
const MINUTES_IN_HOUR = 60;
const getAllWatchedMoviesTime = (movies, parameter) => {
  const totalDuration = movies.map((item) => item.filmDuration).reduce((sum, current) => sum + current);
  let totalTimeValueByParameter = null;
  if (parameter === PARAMETER_FOR_GET_HOURS) {
    totalTimeValueByParameter = Math.floor(totalDuration / MINUTES_IN_HOUR);
  } else if (parameter === PARAMETER_FOR_GET_MINUTES) {
    totalTimeValueByParameter = Math.floor(totalDuration % MINUTES_IN_HOUR);
  }
  return totalTimeValueByParameter;
};
const getAllMoviesGenres = (movies) => {
  const allGenres = [];
  movies.forEach((movie) => {
    if (movie.genres) {
      for (const genre of movie.genres) {
        allGenres.push(genre);
      }
    } else {
      allGenres.push(movie.genre);
    }
  });
  return allGenres;
};
const getTopGenre = (movies) => {
  const allGenres = getAllMoviesGenres(movies);
  const genresCounts = {};
  let max = 0;
  const topGenres = [];
  for (const genre of allGenres) {
    genresCounts[genre] = (genresCounts[genre]) ? genresCounts[genre] + 1 : 1;
    if (genresCounts[genre] > max) {
      max = genresCounts[genre];
    }
  }
  for (const key in genresCounts) {
    if (genresCounts[key] === max) {
      topGenres.push(key);
    }
  }
  return topGenres[getRandomNum(0, (topGenres.length - 1))];
};

const getStat = (userRank, filmsData) => {
  const watchedMovies = getWatchedMovies(filmsData);
  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${userRank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked="">
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedMovies.length} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${getAllWatchedMoviesTime(filmsData, PARAMETER_FOR_GET_HOURS)} <span class="statistic__item-description">h</span> ${getAllWatchedMoviesTime(filmsData, PARAMETER_FOR_GET_MINUTES)} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${getTopGenre(filmsData)}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Stat extends AbstractComponent {
  constructor(userRank, filmsData) {
    super();
    this.data = filmsData;
    this.userRank = userRank;
  }
  getTemplate() {
    return getStat(this.userRank, this.data);
  }
}
