import nanoid from 'nanoid';

const INDEX_NO_MATCH = -1;
const USER_NAME_FOR_NEW_COMMENT = `unknown user`;
const StoreGroup = {
  ALL: `all`,
  MODYFIED: `modyfied`
};

export default class Store {
  constructor(key, store, dataAdapter) {
    this.storage = store;
    this.key = key;
    this.dataAdapter = dataAdapter;
  }
  getStoreData() {
    return JSON.parse(this.storage.getItem(this.key));
  }
  setStoreData(data) {
    this.storage.setItem(this.key, JSON.stringify(data));
  }
  findFilmIndexById(storeData, group, filmId) {
    return storeData[group].findIndex((item) => item.id === filmId);
  }
  saveMoviesFromServer(movies) {
    const moviesInAppFormat = this.dataAdapter.getAllFilmsDataToAppStructure(movies);
    if (!this.storage.getItem(this.key)) {
      this.storage.setItem(this.key, JSON.stringify({
        synchronized: true,
        all: moviesInAppFormat,
        modyfied: [],
        deletedComments: [],
        createdComments: []
      }));
    } else {
      const storeData = this.getStoreData();
      storeData.all = moviesInAppFormat;
      this.setStoreData(storeData);
    }
  }
  getMovies() {
    let movies = null;
    if (!this.storage.getItem(this.key)) {
      movies = [];
    } else {
      movies = this.getStoreData().all;
    }
    this.dataAdapter.onUpdateMoviesData(movies);
  }
  updateMovieData(id, newData, onMovieUpdated) {
    const storeData = this.getStoreData();
    const movieDataIndexInAll = this.findFilmIndexById(storeData, StoreGroup.ALL, id);
    storeData.all.splice(movieDataIndexInAll, 1, newData);
    const movieDataIndexInModyfied = this.findFilmIndexById(storeData, StoreGroup.MODYFIED, id);
    if (movieDataIndexInModyfied !== INDEX_NO_MATCH) {
      storeData.modyfied.splice(movieDataIndexInModyfied, 1, storeData.all[movieDataIndexInAll]);
    } else {
      storeData.modyfied.push(storeData.all[movieDataIndexInAll]);
    }
    storeData.synchronized = false;
    this.setStoreData(storeData);
    this.dataAdapter.onUpdateMovieDataItem(newData);
    onMovieUpdated(newData);
  }
  deleteComment(commentId, onUpdateMovieData) {
    const storeData = this.getStoreData();
    storeData.all.forEach((film) => {
      const deletingCommentIndex = film.comments.findIndex((commentItem) => commentItem.id === commentId);
      if (deletingCommentIndex !== INDEX_NO_MATCH) {
        film.comments.splice(deletingCommentIndex, 1);
        let indexInCreatedComments = INDEX_NO_MATCH;
        if (storeData.createdComments.length) {
          indexInCreatedComments = storeData.createdComments.findIndex((comment) => comment.id === commentId);
        }
        if (indexInCreatedComments !== INDEX_NO_MATCH) {
          storeData.createdComments.splice(indexInCreatedComments, 1);
        } else {
          storeData.deletedComments.push(commentId);
        }
        const filmIndexInModyfied = this.findFilmIndexById(storeData, StoreGroup.MODYFIED, film.id);
        if (filmIndexInModyfied !== INDEX_NO_MATCH) {
          storeData.modyfied.splice(filmIndexInModyfied, 1, film);
        } else {
          storeData.modyfied.push(film);
        }
      }
    });
    storeData.synchronized = false;
    this.setStoreData(storeData);
    onUpdateMovieData(commentId);
  }
  sendComment(filmId, commentBody, onUpdateMovieData) {
    const commentData = JSON.parse(commentBody);
    const storeData = this.getStoreData();
    commentData.id = this._getId();
    commentData.author = USER_NAME_FOR_NEW_COMMENT;
    const filmIndexInAll = this.findFilmIndexById(storeData, StoreGroup.ALL, filmId);
    storeData.all[filmIndexInAll].comments.push(commentData);
    const filmIndexInModyfied = this.findFilmIndexById(storeData, StoreGroup.MODYFIED, filmId);
    if (filmIndexInModyfied !== INDEX_NO_MATCH) {
      storeData.modyfied.splice(filmIndexInModyfied, 1, storeData.all[filmIndexInAll]);
    } else {
      storeData.modyfied.push(storeData.all[filmIndexInAll]);
    }
    commentData.movieId = filmId;
    storeData.createdComments.push(commentData);
    storeData.synchronized = false;
    this.dataAdapter.onUpdateMovieDataItem(storeData.all[filmIndexInAll]);
    onUpdateMovieData(storeData.all[filmIndexInAll]);
    this.setStoreData(storeData);
  }
  _getId() {
    return nanoid();
  }
}
