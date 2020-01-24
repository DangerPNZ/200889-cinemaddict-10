import nanoid from 'nanoid';

const INDEX_NO_MATCH = -1;
const USER_NAME_FOR_NEW_COMMENT = `unknown user`;

export default class Store {
  constructor(key, store, dataAdapter) {
    this.store = store[key];
    this.dataAdapter = dataAdapter;
  }
  saveMoviesFromServer(movies) {
    if (!this.store) {
      this.store = JSON.stringify({
        synchronized: true,
        initial: movies,
        modyfied: [],
        deletedComments: [],
        createdComments: []
      });
    } else {
      const storeData = this.getStoreData;
      storeData.initial = movies;
      this.setStoreData(storeData);
    }
  }
  getMovies() {
    let movies = null;
    if (!this.store) {
      movies = [];
    } else {
      movies = this.dataAdapter.setMoviesData([...this.getStoreData().initial, ...this.getStoreData().modyfied]);
    }
    this.dataAdapter.setMoviesData(movies);
  }
  updateMovieData(id, newData, onMovieUpdated) {
    const storeData = this.getStoreData();
    let oldMovieDataIndex = storeData.initial.findIndex((item) => item.id === id);
    if (oldMovieDataIndex !== INDEX_NO_MATCH) {
      storeData.initial.splice(oldMovieDataIndex, 1);
    } else {
      oldMovieDataIndex = storeData.modyfied.findIndex((item) => item.id === id);
      storeData.modyfied.splice(oldMovieDataIndex, 1);
    }
    // // добавить созданные в оффлайне комментарии
    // for (const offlineNewComment of storeData.createdComments) {
    //   if (offlineNewComment.movieId === id) {
    //     newData.comments.push({
    //       emotion: offlineNewComment.emotion,
    //       comment: offlineNewComment.comment,
    //       date: offlineNewComment.date,
    //       id: offlineNewComment.id,
    //       author: offlineNewComment.author
    //     });
    //   }
    // }
    storeData.modyfied.push(newData);
    storeData.synchronized = false;
    this.setStoreData(storeData);
    this.dataAdapter.onUpdateMovieDataItem(newData);
    onMovieUpdated(newData);
  }
  deleteComment(commentId, onUpdateMovieData) {
    const storeData = this.getStoreData();
    let isDeleting = false;
    let deletingCommentIndex = null;
    storeData.initial.forEach((film, index, arr) => {
      deletingCommentIndex = film.comments.findIndex((commentItem) => commentItem.id === commentId);
      if (deletingCommentIndex !== INDEX_NO_MATCH) {
        film.comments.splice(deletingCommentIndex, 1);
        isDeleting = true;
        storeData.modyfied.push(film);
        arr.splice(index, 1);
        storeData.deletedComments.push(commentId);
      }
    });
    if (!isDeleting) {
      for (const film of storeData.modyfied) {
        deletingCommentIndex = film.comments.findIndex((commentItem) => commentItem.id === commentId);
        film.comments.splice(deletingCommentIndex, 1);
        if (storeData.createdComments.length) {
          const deletedCommentIndex = storeData.createdComments.findIndex((comment) => comment.id === commentId);
          if (deletedCommentIndex !== INDEX_NO_MATCH) {
            storeData.createdComments.splice(deletingCommentIndex, 1);
          } else {
            storeData.deletedComments.push(commentId);
          }
        } else {
          storeData.deletedComments.push(commentId);
        }
      }
    }
    storeData.synchronized = false;
    this.setStoreData(storeData);
    onUpdateMovieData(commentId);
  }
  sendComment(filmId, commentBody, onUpdateMovieData) {
    const commentData = JSON.parse(commentBody);
    const storeData = this.getStoreData();
    commentData.id = this._getId();
    commentData.movieId = filmId;
    commentData.author = USER_NAME_FOR_NEW_COMMENT;
    storeData.createdComments.push(commentData);
    const filmIndex = storeData.initial.findIndex((item) => item.id === filmId);
    let filmData = null;
    if (filmIndex !== INDEX_NO_MATCH) {
      storeData.initial[filmIndex].comments.push(commentData);
      filmData = storeData.initial[filmIndex];
      storeData.modyfied.push(filmData);
      storeData.initial.splice(filmIndex, 1);
    } else {
      filmData = storeData.modyfied.find((item) => item.id === filmId);
      filmData.comments.push(commentData);
    }
    storeData.synchronized = false;
    this.setStoreData(storeData);
    this.dataAdapter.onUpdateMovieDataItem(filmData);
    onUpdateMovieData(filmData);
  }

  _getId() {
    return nanoid();
  }
  getStoreData() {
    return JSON.parse(this.store);
  }
  setStoreData(data) {
    this.store = JSON.stringify(data);
  }
}
