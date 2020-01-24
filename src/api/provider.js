const isOnline = () => window.navigator.onLine;

export default class Provider {
  constructor(api, store) {
    this.api = api;
    this.store = store;
  }
  getMovies() {
    if (isOnline()) {
      /*
      синхронизация
      1) удаляем удаленные комментарии
      2) обновляем фильмы из modyfied
      3) добавляем новые комментарии, созданные в offline
      */

      // добавить обработчики на offline и online (добавлять/удалять title[offline])
      // синхронизация по online
      this.api.getMovies()
      .then((movies) => {
        const waitComments = setInterval(() => {
          const comments = [];
          for (const film of movies) {
            if (film.comments) {
              comments.push(film.comments);
            }
            if (comments.length === movies.length) {
              this.store.saveMoviesFromServer(movies);
              clearInterval(waitComments);
            }
          }
        }, 200);
      });
    } else {
      this.store.getMovies();
    }
  }
  updateMovie(id, newData, onMovieUpdated, onError) {
    if (isOnline()) {
      this.api.updateMovie(id, newData, onMovieUpdated, onError);
    } else {
      this.store.updateMovieData(id, newData, onMovieUpdated);
    }
  }
  sendComment(filmId, body, onUpdateMovieData, onError) {
    if (isOnline()) {
      this.api.sendComment(filmId, body, onUpdateMovieData, onError);
    } else {
      this.store.sendComment(filmId, body, onUpdateMovieData);
    }
  }
  deleteComment(commentId, onUpdateMovieData, onError) {
    if (isOnline()) {
      this.api.deleteComment(commentId, onUpdateMovieData, onError);
    } else {
      this.store.deleteComment(commentId, onUpdateMovieData);
    }
  }
}
