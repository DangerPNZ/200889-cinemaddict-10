import {getRandomNum} from './utils.js';
import {insertElementInMarkup} from './utils.js';
import AbstractComponent from "./abstract-component.js";
import Chart from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

const DEFAULT_STATISTIC_STATE = `all-time`;
const ZERO_FOR_NUMBER_VALUES = 0;
const getWatchedMovies = (movies) => {
  return movies.filter((item) => {
    return item.isAlready === true;
  });
};
const PARAMETER_FOR_GET_HOURS = `hours`;
const PARAMETER_FOR_GET_MINUTES = `minutes`;
const MINUTES_IN_HOUR = 60;
const getAllWatchedMoviesTime = (movies, parameter) => {
  if (movies.length) {
    const totalDuration = movies.filter((item) => item.isAlready === true).map((item) => item.filmDuration).reduce((sum, current) => sum + current);
    let totalTimeValueByParameter = null;
    if (parameter === PARAMETER_FOR_GET_HOURS) {
      totalTimeValueByParameter = Math.floor(totalDuration / MINUTES_IN_HOUR);
    } else if (parameter === PARAMETER_FOR_GET_MINUTES) {
      totalTimeValueByParameter = Math.floor(totalDuration % MINUTES_IN_HOUR);
    }
    return totalTimeValueByParameter;
  } else {
    return ZERO_FOR_NUMBER_VALUES;
  }
};
const getAllMoviesGenres = (movies) => {
  const allGenres = [];
  const watchedMovies = movies.filter((item) => item.isAlready === true);
  watchedMovies.forEach((movie) => {
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
let genresLabels = [];
let values = [];
let genresCounts = {};
const getTopGenre = (movies) => {
  genresLabels = [];
  values = [];
  genresCounts = {};
  const allGenres = getAllMoviesGenres(movies);
  let max = 0;
  const topGenres = [];
  for (const genre of allGenres) {
    if (!genresCounts[genre]) {
      genresCounts[genre] = 1;
      genresLabels.push(genre);
    } else {
      genresCounts[genre] += 1;
    }
    if (genresCounts[genre] > max) {
      max = genresCounts[genre];
    }
  }
  for (const genre in genresCounts) {
    if (genresCounts[genre]) {
      values.push(genresCounts[genre]);
    }
  }
  for (const key in genresCounts) {
    if (genresCounts[key] === max) {
      topGenres.push(key);
    }
  }
  return topGenres[getRandomNum(0, (topGenres.length - 1))];
};
const getUserRank = (userRank) => {
  if (userRank) {
    return `
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>`;
  } else {
    return ``;
  }
};

const getStat = (userRank, filmsData) => {
  const watchedMovies = getWatchedMovies(filmsData);
  return `<section class="statistic">
  ${getUserRank(userRank)}

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
    <canvas id="genres-chart" class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Stat extends AbstractComponent {
  constructor(userRank, filmsData, container) {
    super();
    this.userRank = userRank;
    this.data = filmsData;
    this.statisticContainer = container;
    this.createChart = this.createChart.bind(this);
    this.setStatisticPeriodHandlers = this.setStatisticPeriodHandlers.bind(this);
    this.staticticState = DEFAULT_STATISTIC_STATE;
    this.filmsDataByPeriod = this.data;
  }
  getTemplate() {
    return getStat(this.userRank, this.filmsDataByPeriod);
  }
  setStatisticPeriodHandlers() {
    const statisticRadioBtns = this.getElement().querySelectorAll(`.statistic__filters-input`);
    for (const radioBtn of statisticRadioBtns) {
      radioBtn.addEventListener(`change`, (event) => {
        event.preventDefault();
        this.staticticState = event.target.value;
      });
    }
  }
  createChart() {
    if (genresLabels.length && values.length) {
      const ctx = this.getElement().querySelector(`#genres-chart`).getContext(`2d`);
      return new Chart(ctx, {
        plugins: [chartDataLabels],
        type: `horizontalBar`,
        data: {
          labels: genresLabels,
          datasets: [{
            data: values,
            backgroundColor: `#ffe800`,
            barThickness: 22,
            minBarLength: 0
          }]
        },
        gridLines: {
          display: false
        },
        options: {
          label: {
            font: {
              color: `#fff`
            }
          },
          tooltips: {
            enabled: false
          },
          plugins: {
            datalabels: {
              anchor: `start`,
              align: `start`,
              offset: 25,
              color: `#fff`,
              font: {
                size: 16
              }
            }
          },
          legend: false,
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                display: false
              },
              stacked: true
            }],
            yAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 16,
                fontColor: `#fff`,
                padding: 60
              },
              stacked: true
            }]
          }
        }
      });
    } else {
      return null;
    }
  }
  setCurrentStatisticPeriod() {
    if (this.staticticState !== DEFAULT_STATISTIC_STATE) {
      this.getElement().querySelector(`.statistic__filters-input[value="${this.staticticState}"]`).setAttribute(`checked`, true);
    }
  }
  render() {
    insertElementInMarkup(this, this.statisticContainer);
    this.setStatisticPeriodHandlers();
    this.createChart();
  }
  rerender() {
    this.getElement().remove();
    this.removeElement();
    this.render();
    this.setCurrentStatisticPeriod();
  }
}
