import {compare} from '../components/utils.js';

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
  constructor(moviesData) {
    this.moviesData = moviesData;
    this.filmsDataForRender = moviesData;
  }
  getMoviesData() {
    return this.moviesData;
  }
  changeMovieData(id, newData) {
    const index = this.moviesData.findIndex((item) => item.id === id);
    this.moviesData[index] = newData;
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
  onChangeSortType(type) {
    this.currentSortType = type;
    if (this.currentFilterType) {
      this.sortByType(type);
      this.filterByType(this.currentFilterType);
    } else {
      this.sortByType(type);
    }
    this.onFilmsPartsChange(this.filmsDataForRender);
  }
  onChangeFilterType(type) {
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
