import {compare} from '../utils/utils.js';
import API from '../api/index.js';
import DataAdapter from '../api/data-adapter.js';
import Store from '../api/store.js';
import Provider from '../api/provider.js';

const STORE_KEY = `cinemaddict`;
const STORE = window.localStorage;

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
    this.onUpdateMovieDataItem = this.onUpdateMovieDataItem.bind(this);
    this.onUpdateMoviesData = this.onUpdateMoviesData.bind(this);
    this.getAllMoviesData = this.getAllMoviesData.bind(this);
    this.moviesData = [];
    this.filmsDataForRender = this.moviesData;
    this.dataAdapter = new DataAdapter(this, this.onUpdateMoviesData, this.onUpdateMovieDataItem);
    this.store = new Store(STORE_KEY, STORE, this.dataAdapter);
    this.api = new API(this.dataAdapter);
    this.apiWithProvider = new Provider(this.api, this.store);

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
  getAllMoviesData() {
    return this.moviesData;
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
  getMoviesDataFromServer() {
    this.apiWithProvider.getMovies();
  }
  setChangeCallback(callback) {
    this.onFilmsPartsChange = callback;
  }
  setAfterDataLoadCallback(callback) {
    this.setStateAfterDataLoad = callback;
  }
  changeMovieData(id, newData, onServerDataUpdate, onError = null) {
    this.apiWithProvider.updateMovie(id, newData, onServerDataUpdate, onError);
  }
  addNewComment(id, commentData, onServerDataUpdate, onError) {
    this.apiWithProvider.sendComment(id, commentData, onServerDataUpdate, onError);
  }
  deleteComment(id, onServerDataUpdate, onError) {
    this.apiWithProvider.deleteComment(id, onServerDataUpdate, onError);
  }
  changeSortType(type) {
    this._currentSortType = type;
    if (this._currentFilterType) {
      this._sortByType(type);
      this._filterByType(this._currentFilterType);
    } else {
      this._sortByType(type);
    }
    this.onFilmsPartsChange(this.filmsDataForRender);
  }
  changeFilterType(type) {
    this._currentFilterType = type;
    if (this._currentSortType) {
      this._sortByType(this._currentSortType);
      this._filterByType(type);
    } else {
      this._filterByType(type);
    }
    this.onFilmsPartsChange(this.filmsDataForRender);
  }
  _sortByType(type) {
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
  _filterByType(type) {
    const films = this._currentSortType ? this.filmsDataForRender : this.moviesData;
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
}
