import {compare} from '../components/utils.js';
import API from '../api/index.js';
import DataAdapter from '../api/data-adapter.js';

const SORT_TYPE_VALUES = {
  default: `default`,
  byDate: `releaseDate`,
  byRating: `ratingVal`
};
const FILTER_TYPE_VALUES = {
  inWatchlist: `#watchlist`,
  already: `#history`,
  inFavorites: `#favorites`,
  all: `#all`
};

export default class Movies {
  constructor() {
    this.moviesData = [];
    this.filmsDataForRender = this.moviesData;
    this.dataAdapter = new DataAdapter(this, this.onUpdateMoviesData.bind(this), this.onUpdateMovieDataItem.bind(this));
    this.api = new API(this.dataAdapter);
  }
  onUpdateMoviesData(filmsData) {
    this.moviesData = filmsData;
    this.filmsDataForRender = this.moviesData;
    this.setStateAfterDataLoad();
  }
  onUpdateMovieDataItem(movieData) {
    let index = this.moviesData.findIndex((item) => item.id === movieData.id);
    this.moviesData[index] = movieData;
    index = this.filmsDataForRender.findIndex((item) => item.id === movieData.id);
    this.filmsDataForRender[index] = movieData;
  }
  getMoviesData() {
    this.api.getMovies();
  }
  getMoviesAmounth() {
    return this.filmsDataForRender.length;
  }
  getMovieDataByIndex(index) {
    return this.filmsDataForRender[index];
  }
  getMoviesDataForRender() {
    return this.filmsDataForRender;
  }
  changeMovieData(id, newData, onServerDataUpdate, onError = null) {
    this.api.updateMovie(id, newData, onServerDataUpdate, onError);
  }
  addNewComment(id, commentData, onServerDataUpdate, onError) {
    this.api.sendComment(id, commentData, onServerDataUpdate, onError);
  }
  deleteComment(id, onServerDataUpdate, onError) {
    this.api.deleteComment(id, onServerDataUpdate, onError);
  }
  sortByType(type) {
    switch (type) {
      case SORT_TYPE_VALUES.byDate:
        this.filmsDataForRender = this.moviesData.slice().sort(compare(SORT_TYPE_VALUES.byDate, true));
        break;
      case SORT_TYPE_VALUES.byRating:
        this.filmsDataForRender = this.moviesData.slice().sort(compare(SORT_TYPE_VALUES.byRating));
        break;
      case SORT_TYPE_VALUES.default:
        this.filmsDataForRender = this.moviesData.slice();
        break;
    }
  }
  filterByType(type) {
    const dataArray = this.currentSortType ? this.filmsDataForRender : this.moviesData;
    switch (type) {
      case FILTER_TYPE_VALUES.inWatchlist:
        this.filmsDataForRender = dataArray.slice().filter((item) => item.isInWatchlist === true);
        break;
      case FILTER_TYPE_VALUES.already:
        this.filmsDataForRender = dataArray.slice().filter((item) => item.isAlready === true);
        break;
      case FILTER_TYPE_VALUES.inFavorites:
        this.filmsDataForRender = dataArray.slice().filter((item) => item.isFavorites === true);
        break;
      case FILTER_TYPE_VALUES.all:
        this.filmsDataForRender = dataArray.slice();
        break;
    }
  }
  changeSortType(type) {
    this.currentSortType = type;
    if (this.currentFilterType) {
      this.sortByType(type);
      this.filterByType(this.currentFilterType);
    } else {
      this.sortByType(type);
    }
    this.onFilmsPartsChange(this.filmsDataForRender);
  }
  changeFilterType(type) {
    this.currentFilterType = type;
    if (this.currentSortType) {
      this.sortByType(this.currentSortType);
      this.filterByType(type);
    } else {
      this.filterByType(type);
    }
    this.onFilmsPartsChange(this.filmsDataForRender);
  }
}
