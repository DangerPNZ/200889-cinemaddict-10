import {insertElementInMarkup} from '../utils/utils.js';
import moment from 'moment';
import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

const MINUTES_IN_HOUR = 60;
const INDEX_OF_FIRST_ELEMENT = 0;
const ONE_ELEMENT_FOR_GENGES_COUNT = 1;
const AMOUNT_OF_TIME_PERIOD = 1;

const StatisticState = {
  DEFAULT: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};
const TimeParameter = {
  HOURS: `hours`,
  MINUTES: `minutes`
};
const TimeUnit = {
  DAY: `day`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};
const ChartOptionValue = {
  CHART_TYPE: `horizontalBar`,
  BACKGROUND_COLOR: `#ffe800`,
  BAR_THICKNESS: 22,
  MIN_BAR_LENGTH: 0,
  DISPLAY_NONE_STATE: false,
  COLOR: `#fff`,
  TOOLTIPS_ENABLED_STATE: false,
  FONT_SIZE: 16,
  LEGEND_STATE: false,
  DATA_LABELS_POSITION: `start`,
  DATA_LABELS_OFFSET: 25,
  STACKED_STATE: true,
  TICKS_PADDING: 60
};

let genresLabels = [];
let values = [];
let genresCounts = {};

const getWatchedMovies = (movies) => {
  return movies.filter((item) => item.isAlready === true);
};
const getAllWatchedMoviesTime = (movies, parameter) => {
  if (movies.length) {
    const watchedFilms = movies.filter((item) => item.isAlready === true);
    if (watchedFilms.length) {
      const totalDuration = watchedFilms.map((item) => item.filmDuration).reduce((sum, current) => sum + current);
      if (parameter === TimeParameter.HOURS) {
        return Math.floor(totalDuration / MINUTES_IN_HOUR);
      } else if (parameter === TimeParameter.MINUTES) {
        return Math.floor(totalDuration % MINUTES_IN_HOUR);
      }
    } else {
      return 0;
    }
  }
  return 0;
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
const getTopGenre = (movies) => {
  genresLabels = [];
  values = [];
  genresCounts = {};
  const allGenres = getAllMoviesGenres(movies);
  let max = 0;
  const topGenres = [];
  for (const genre of allGenres) {
    if (!genresCounts[genre]) {
      genresCounts[genre] = ONE_ELEMENT_FOR_GENGES_COUNT;
      genresLabels.push(genre);
    } else {
      genresCounts[genre] += ONE_ELEMENT_FOR_GENGES_COUNT;
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
  return topGenres[INDEX_OF_FIRST_ELEMENT];
};
const getUserRank = (userRank) => {
  if (userRank) {
    return `
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>`;
  }
  return ``;
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
      <p class="statistic__item-text">${getAllWatchedMoviesTime(filmsData, TimeParameter.HOURS)} <span class="statistic__item-description">h</span> ${getAllWatchedMoviesTime(filmsData, TimeParameter.MINUTES)} <span class="statistic__item-description">m</span></p>
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

export default class Stat extends AbstractSmartComponent {
  constructor(userRank, filmsData, container) {
    super();
    this._userRank = userRank;
    this.data = filmsData;
    this._statisticContainer = container;
    this._createChart = this._createChart.bind(this);
    this._setStatisticPeriodHandlers = this._setStatisticPeriodHandlers.bind(this);
    this._staticticState = StatisticState.DEFAULT;
    this._filmsDataByPeriod = this.data;
    this.rerender = this.rerender.bind(this);
  }
  getTemplate() {
    return getStat(this._userRank, this._filmsDataByPeriod);
  }
  render() {
    insertElementInMarkup(this, this._statisticContainer);
    this._setStatisticPeriodHandlers();
    this._createChart();
  }
  rerender(userRank, showState) {
    this._userRank = userRank;
    this.getElement().remove();
    this.removeElement();
    this._defineStatisticData();
    this.render();
    if (!showState) {
      this.hide();
    }
    this._setCurrentStatisticPeriod();
  }
  _setStatisticPeriodHandlers() {
    const statisticRadioBtns = this.getElement().querySelectorAll(`.statistic__filters-input`);
    for (const radioBtn of statisticRadioBtns) {
      radioBtn.addEventListener(`change`, (event) => {
        event.preventDefault();
        this._staticticState = event.target.value;
        this.rerender(this._userRank, true);
      });
    }
  }
  _createChart() {
    if (genresLabels.length && values.length) {
      const ctx = this.getElement().querySelector(`#genres-chart`).getContext(`2d`);
      return new Chart(ctx, {
        plugins: [chartDataLabels],
        type: ChartOptionValue.CHART_TYPE,
        data: {
          labels: genresLabels,
          datasets: [{
            data: values,
            backgroundColor: ChartOptionValue.BACKGROUND_COLOR,
            barThickness: ChartOptionValue.BAR_THICKNESS,
            minBarLength: ChartOptionValue.MIN_BAR_LENGTH
          }]
        },
        gridLines: {
          display: ChartOptionValue.DISPLAY_NONE_STATE
        },
        options: {
          label: {
            font: {
              color: ChartOptionValue.COLOR
            }
          },
          tooltips: {
            enabled: ChartOptionValue.TOOLTIPS_ENABLED_STATE
          },
          plugins: {
            datalabels: {
              anchor: ChartOptionValue.DATA_LABELS_POSITION,
              align: ChartOptionValue.DATA_LABELS_POSITION,
              offset: ChartOptionValue.DATA_LABELS_OFFSET,
              color: ChartOptionValue.COLOR,
              font: {
                size: ChartOptionValue.FONT_SIZE
              }
            }
          },
          legend: ChartOptionValue.LEGEND_STATE,
          scales: {
            xAxes: [{
              gridLines: {
                display: ChartOptionValue.DISPLAY_NONE_STATE
              },
              ticks: {
                display: ChartOptionValue.DISPLAY_NONE_STATE
              },
              stacked: ChartOptionValue.STACKED_STATE
            }],
            yAxes: [{
              gridLines: {
                display: ChartOptionValue.DISPLAY_NONE_STATE
              },
              ticks: {
                fontSize: ChartOptionValue.FONT_SIZE,
                fontColor: ChartOptionValue.COLOR,
                padding: ChartOptionValue.TICKS_PADDING
              },
              stacked: ChartOptionValue.STACKED_STATE
            }]
          }
        }
      });
    }
    return null;
  }
  _setCurrentStatisticPeriod() {
    if (this._staticticState !== StatisticState.DEFAULT) {
      this.getElement().querySelector(`.statistic__filters-input[value="${this._staticticState}"]`).setAttribute(`checked`, true);
    }
  }
  _defineStatisticData() {
    switch (this._staticticState) {
      case StatisticState.DEFAULT:
        this._filmsDataByPeriod = this.data;
        break;
      case StatisticState.TODAY:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isSame(moment(), TimeUnit.DAY));
        break;
      case StatisticState.WEEK:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isAfter(moment().subtract(AMOUNT_OF_TIME_PERIOD, TimeUnit.WEEK)));
        break;
      case StatisticState.MONTH:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isAfter(moment().subtract(AMOUNT_OF_TIME_PERIOD, TimeUnit.MONTH)));
        break;
      case StatisticState.YEAR:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isAfter(moment().subtract(AMOUNT_OF_TIME_PERIOD, TimeUnit.YEAR)));
        break;
    }
  }
}
