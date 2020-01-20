const AUTHORIZATION_URL = `Basic cinemaddict_10_200889`;
const API_URL = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const Method = {
  POST: `POST`,
  GET: `GET`,
  PUT: `PUT`,
  DELETE: `DELETE`
};
const headers = {
  Authorization: AUTHORIZATION_URL,
  [`Content-Type`]: `application/json`
};
const Status = {
  STATUS_OK_CODE: 200,
  STATUS_MULTIPLE_CHOISES_CODE: 300
};

export default class API {
  constructor(dataAdapter) {
    this.dataAdapter = dataAdapter;
  }
  checkStatus(response) {
    if (response.status >= Status.STATUS_OK_CODE && response.status < Status.STATUS_MULTIPLE_CHOISES_CODE) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
  _load(url, method = Method.GET, body = null, onError = null) {
    return fetch(`${API_URL}/${url}`, {method, body, headers})
    .then(this.checkStatus)
    .catch((err) => {
      if (onError) {
        onError();
      }
      throw err;
    });
  }
  getComments(film, onUpdateMovieData) {
    return this._load(`comments/${film.id}`)
    .then((response) => response.json())
    .then((commentsList) => {
      film.comments = commentsList;
      if (!onUpdateMovieData) {
        this.filmsWithCommentsAmounth += 1;
        if (this.filmsAmounth === this.filmsWithCommentsAmounth) {
          this.dataAdapter.setMoviesData(this.allMoviesData);
        }
      } else {
        this.dataAdapter.onGetMovieWithUpdatedComments(film, onUpdateMovieData);
      }
    })
    .catch((err) => {
      throw err;
    });
  }
  getCommentsForAllMovies(filmsData) {
    this.allMoviesData = filmsData;
    this.filmsAmounth = this.allMoviesData.length;
    this.filmsWithCommentsAmounth = 0;
    for (const movieData of this.allMoviesData) {
      this.getComments(movieData);
    }
  }
  getMovies() {
    return this._load(`movies`)
    .then((response) => response.json())
    .then((filmsData) => {
      this.getCommentsForAllMovies(filmsData);
    })
    .catch((err) => {
      throw err;
    });
  }
  updateMovie(id, newData, onMovieUpdated, onError) {
    return this._load(`movies/${id}`, Method.PUT, this.dataAdapter.formatMovieDataToServerStructure(newData), onError)
    .then((response) => response.json())
    .then((film) => this.getComments(film, onMovieUpdated))
    .catch((err) => {
      throw err;
    });
  }
  sendComment(filmId, body, onUpdateMovieData, onError) {
    return this._load(`comments/${filmId}`, Method.POST, body, onError)
    .then((response) => response.json())
    .then((data) => {
      data.movie.comments = data.comments;
      this.dataAdapter.onGetMovieWithUpdatedComments(data.movie, onUpdateMovieData);
    })
    .catch((err) => {
      throw err;
    });
  }
  deleteComment(commentId, onUpdateMovieData, onError) {
    return this._load(`comments/${commentId}`, Method.DELETE, null, onError)
    .then(() => {
      onUpdateMovieData(commentId);
    })
    .catch((err) => {
      throw err;
    });
  }
}
