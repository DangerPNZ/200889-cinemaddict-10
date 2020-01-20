import {compare} from '../utils/utils.js';
import API from '../api/index.js';
import DataAdapter from '../api/data-adapter.js';

const SortTypeValue = {
  DEFAULT: `default`,
  BY_DATE: `releaseDate`,
  BY_RATING: `ratingVal`
};
const FilterTypeValue = {
  IN_WATCHLIST: `#watchlist`,
  ALREADY: `#history`,
  IN_FAVORITES: `#favorites`,
  ALL: `#all`
};

export default class Movies {
  constructor() {
    this.moviesData = [];
    this.filmsDataForRender = this.moviesData;
    this.dataAdapter = new DataAdapter(this, this.onUpdateMoviesData.bind(this), this.onUpdateMovieDataItem.bind(this));
    this.api = new API(this.dataAdapter);
  }
  setChangeCallback(callback) {
    this.onFilmsPartsChange = callback;
  }
  onUpdateMoviesData(filmsData) {
    this.moviesData = filmsData;
    this.filmsDataForRender = this.moviesData;
    this.setStateAfterDataLoad();
  }
  onUpdateMovieDataItem(movieData) {
    const movieDataIndex = this.moviesData.findIndex((item) => item.id === movieData.id);
    this.moviesData[movieDataIndex] = movieData;
    const filmsDataFormRenderIndex = this.filmsDataForRender.findIndex((item) => item.id === movieData.id);
    this.filmsDataForRender[filmsDataFormRenderIndex] = movieData;
  }
  getMoviesData() {
    this.api.getMovies();
  }
  getMoviesAmount() {
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
      case SortTypeValue.BY_DATE:
        this.filmsDataForRender = this.moviesData.slice().sort(compare(SortTypeValue.BY_DATE, true));
        break;
      case SortTypeValue.BY_RATING:
        this.filmsDataForRender = this.moviesData.slice().sort(compare(SortTypeValue.BY_RATING));
        break;
      case SortTypeValue.DEFAULT:
        this.filmsDataForRender = this.moviesData.slice();
        break;
    }
  }
  filterByType(type) {
    const films = this.currentSortType ? this.filmsDataForRender : this.moviesData;
    switch (type) {
      case FilterTypeValue.IN_WATCHLIST:
        this.filmsDataForRender = films.slice().filter((item) => item.isInWatchlist === true);
        break;
      case FilterTypeValue.ALREADY:
        this.filmsDataForRender = films.slice().filter((item) => item.isAlready === true);
        break;
      case FilterTypeValue.IN_FAVORITES:
        this.filmsDataForRender = films.slice().filter((item) => item.isFavorites === true);
        break;
      case FilterTypeValue.ALL:
        this.filmsDataForRender = films.slice();
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
