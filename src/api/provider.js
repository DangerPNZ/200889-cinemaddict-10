const isOnline = () => window.navigator.onLine;
const createNewCommentBody = (data) => {
  return JSON.stringify({
    emotion: data.emotion,
    comment: data.comment,
    date: data.date
  });
};

export default class Provider {
  constructor(api, store) {
    this.api = api;
    this.store = store;
  }
  deleteCommentsBySync(deletedComments) {
    return Promise.all(deletedComments.map((id) => this.api.deleteComment(id)));
  }
  syncMovies() {
    const storeData = this.store.getStoreData();
    if (storeData && !storeData.synchronized) {
      if (storeData.deletedComments.length) {
        this.deleteCommentsBySync(storeData.deletedComments).then(() => {
          storeData.deletedComments = [];
        })
        .then(() => {
          return this.api.syncMovies(storeData.modyfied);
        })
        .then((updatedMovies) => {
          for (const newMovieData of updatedMovies) {
            for (const movie of storeData.all) {
              if (newMovieData.id === movie.id) {
                movie = newMovieData;
              }
            }
          }
          return Promise.all(storeData.createdComments.map((item) => this.api.sendComment(item.movieId, createNewCommentBody(item))));
        })
        .then((filmsDataWithNewComments) => console.log(filmsDataWithNewComments))
        .catch((err) => {
          throw err;
        });

      } else {
        this.api.syncMovies(storeData.modyfied);
      }
    }
  }
  getMovies() {
    if (isOnline()) {
      // добавить обработчики на offline и online (добавлять/удалять title[offline])
      // синхронизация по online

      // this.syncMovies();

      this.api.getMovies()
      .then((moviesData) => {
        this.store.saveMoviesFromServer(moviesData);
      })
      .catch((err) => {
        throw err;
      });
    } else {
      this.store.getMovies();
    }
  }
  updateMovie(id, newData, onMovieUpdated, onError) {
    if (!isOnline()) {
      this.api.updateMovie(id, newData, onMovieUpdated, onError)
      .catch((err) => {
        throw err;
      });
    } else {
      this.store.updateMovieData(id, newData, onMovieUpdated);
    }
  }
  sendComment(filmId, body, onUpdateMovieData, onError) {
    if (!isOnline()) {
      this.api.sendComment(filmId, body, onUpdateMovieData, onError)
      .catch((err) => {
        throw err;
      });
    } else {
      this.store.sendComment(filmId, body, onUpdateMovieData);
    }
  }
  deleteComment(commentId, onUpdateMovieData, onError) {
    if (!isOnline()) {
      this.api.deleteComment(commentId, onUpdateMovieData, onError)
      .catch((err) => {
        throw err;
      });
    } else {
      this.store.deleteComment(commentId, onUpdateMovieData);
    }
  }
}
