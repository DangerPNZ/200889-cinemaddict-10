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
  getMovies() {
    return this._load(`movies`)
    .then((response) => response.json())
    .then((filmsData) => this._getCommentsForAllMovies(filmsData))
    .then((allComments) => {
      this.allMoviesData.forEach((filmData, index) => {
        filmData.comments = allComments[index];
      });
      this.dataAdapter.setMoviesData(this.allMoviesData);
      return this.allMoviesData;
    });
  }
  updateMovie(id, newData, onMovieUpdated, onError) {
    return this._load(`movies/${id}`, Method.PUT, this.dataAdapter.formatMovieDataToServerStructure(newData), onError)
    .then((response) => response.json())
    .then((film) => this._getComments(film, onMovieUpdated));
  }
  sendComment(filmId, body, onUpdateMovieData, onError) {
    return this._load(`comments/${filmId}`, Method.POST, body, onError)
    .then((response) => response.json())
    .then((data) => {
      data.movie.comments = data.comments;
      if (onUpdateMovieData) {
        this.dataAdapter.onGetMovieWithUpdatedComments(data.movie, onUpdateMovieData);
      }
      return data.movie;
    })
    .catch((err) => {
      throw err;
    });
  }
  deleteComment(commentId, onUpdateMovieData, onError) {
    return this._load(`comments/${commentId}`, Method.DELETE, null, onError)
    .then(() => {
      if (onUpdateMovieData) {
        onUpdateMovieData(commentId);
      }
    });
  }
  syncMovies(movies) {
    return this._load(`/movies/sync`, Method.POST, this.dataAdapter.formatAllMoviesDataToServerStructure(movies))
    .then((response) => response.json())
    .then((syncMoviesData) => this._getCommentsForAllMovies(syncMoviesData))
    .then((allComments) => {
      this.allMoviesData.forEach((filmData, index) => {
        filmData.comments = allComments[index];
      });
      return this.dataAdapter.getAllFilmsDataToAppStructure(this.allMoviesData);
    });
  }
  _checkStatus(response) {
    if (response.status >= Status.STATUS_OK_CODE && response.status < Status.STATUS_MULTIPLE_CHOISES_CODE) {
      return response;
    }
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  _load(url, method = Method.GET, body = null, onError = null) {
    return fetch(`${API_URL}/${url}`, {method, body, headers})
    .then(this._checkStatus)
    .catch((err) => {
      if (onError) {
        onError();
      }
      throw err;
    });
  }
  _getComments(film, onUpdateMovieData) {
    return this._load(`comments/${film.id}`)
    .then((response) => response.json())
    .then((commentsList) => {
      if (onUpdateMovieData) {
        film.comments = commentsList;
        this.dataAdapter.onGetMovieWithUpdatedComments(film, onUpdateMovieData);
      }
      return commentsList;
    });
  }
  _getCommentsForAllMovies(filmsData) {
    this.allMoviesData = filmsData;
    return Promise.all(this.allMoviesData.map((data) => this._getComments(data)));
  }
}
