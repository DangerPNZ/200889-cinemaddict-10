import {insertElementInMarkup} from '../utils/utils.js';
import moment from 'moment';
import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

const StatisticState = {
  DEFAULT: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getWatchedMovies = (movies) => {
  return movies.filter((item) => {
    return item.isAlready === true;
  });
};
const TimeParameter = {
  HOURS: `hours`,
  MINUTES: `minutes`
};
const MINUTES_IN_HOUR = 60;
const getAllWatchedMoviesTime = (movies, parameter) => {
  if (movies.length) {
    const watchedFilms = movies.filter((item) => item.isAlready === true);
    let totalTimeValueByParameter = null;
    if (watchedFilms.length) {
      const totalDuration = watchedFilms.map((item) => item.filmDuration).reduce((sum, current) => sum + current);
      if (parameter === TimeParameter.HOURS) {
        totalTimeValueByParameter = Math.floor(totalDuration / MINUTES_IN_HOUR);
      } else if (parameter === TimeParameter.MINUTES) {
        totalTimeValueByParameter = Math.floor(totalDuration % MINUTES_IN_HOUR);
      }
    } else {
      totalTimeValueByParameter = 0;
    }
    return totalTimeValueByParameter;
  } else {
    return 0;
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
const INDEX_OF_FIRST_ELEMENT = 0;
const ONE_ELEMENT_FOR_GENGES_COUNT = 1;
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
const CHART_OPTION_VALUE = {
  chartType: `horizontalBar`,
  backgroundColor: `#ffe800`,
  barThickness: 22,
  minBarLength: 0,
  displayNoneState: false,
  color: `#fff`,
  tooltipsEnabledState: false,
  fontSize: 16,
  legendState: false,
  dataLabelsPosition: `start`,
  dataLabelsOffset: 25,
  stackedState: true,
  ticksPadding: 60
};
const AMOUNT_OF_TIME_UNITS = 1;
const TimeUnit = {
  DAY: `day`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
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
  _defineStatisticData() {
    switch (this._staticticState) {
      case StatisticState.DEFAULT:
        this._filmsDataByPeriod = this.data;
        break;
      case StatisticState.TODAY:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isSame(moment(), TimeUnit.DAY));
        break;
      case StatisticState.WEEK:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isAfter(moment().subtract(AMOUNT_OF_TIME_UNITS, TimeUnit.WEEK)));
        break;
      case StatisticState.MONTH:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isAfter(moment().subtract(AMOUNT_OF_TIME_UNITS, TimeUnit.MONTH)));
        break;
      case StatisticState.YEAR:
        this._filmsDataByPeriod = this.data.filter((item) => moment(item.watchingDate).isAfter(moment().subtract(AMOUNT_OF_TIME_UNITS, TimeUnit.YEAR)));
        break;
    }
  }
  _setStatisticPeriodHandlers() {
    const statisticRadioBtns = this.getElement().querySelectorAll(`.statistic__filters-input`);
    for (const radioBtn of statisticRadioBtns) {
      radioBtn.addEventListener(`change`, (event) => {
        event.preventDefault();
        this._staticticState = event.target.value;
        this.rerender(this._userRank);
      });
    }
  }
  _createChart() {
    if (genresLabels.length && values.length) {
      const ctx = this.getElement().querySelector(`#genres-chart`).getContext(`2d`);
      return new Chart(ctx, {
        plugins: [chartDataLabels],
        type: CHART_OPTION_VALUE.chartType,
        data: {
          labels: genresLabels,
          datasets: [{
            data: values,
            backgroundColor: CHART_OPTION_VALUE.backgroundColor,
            barThickness: CHART_OPTION_VALUE.barThickness,
            minBarLength: CHART_OPTION_VALUE.minBarLength
          }]
        },
        gridLines: {
          display: CHART_OPTION_VALUE.displayNoneState
        },
        options: {
          label: {
            font: {
              color: CHART_OPTION_VALUE.color
            }
          },
          tooltips: {
            enabled: CHART_OPTION_VALUE.tooltipsEnabledState
          },
          plugins: {
            datalabels: {
              anchor: CHART_OPTION_VALUE.dataLabelsPosition,
              align: CHART_OPTION_VALUE.dataLabelsPosition,
              offset: CHART_OPTION_VALUE.dataLabelsOffset,
              color: CHART_OPTION_VALUE.color,
              font: {
                size: CHART_OPTION_VALUE.fontSize
              }
            }
          },
          legend: CHART_OPTION_VALUE.legendState,
          scales: {
            xAxes: [{
              gridLines: {
                display: CHART_OPTION_VALUE.displayNoneState
              },
              ticks: {
                display: CHART_OPTION_VALUE.displayNoneState
              },
              stacked: CHART_OPTION_VALUE.stackedState
            }],
            yAxes: [{
              gridLines: {
                display: CHART_OPTION_VALUE.displayNoneState
              },
              ticks: {
                fontSize: CHART_OPTION_VALUE.fontSize,
                fontColor: CHART_OPTION_VALUE.color,
                padding: CHART_OPTION_VALUE.ticksPadding
              },
              stacked: CHART_OPTION_VALUE.stackedState
            }]
          }
        }
      });
    } else {
      return null;
    }
  }
  _setCurrentStatisticPeriod() {
    if (this._staticticState !== StatisticState.DEFAULT) {
      this.getElement().querySelector(`.statistic__filters-input[value="${this._staticticState}"]`).setAttribute(`checked`, true);
    }
  }
  render() {
    insertElementInMarkup(this, this._statisticContainer);
    this._setStatisticPeriodHandlers();
    this._createChart();
  }
  rerender(userRank) {
    this._userRank = userRank;
    this.getElement().remove();
    this.removeElement();
    this._defineStatisticData();
    this.render();
    this._setCurrentStatisticPeriod();
  }
}
