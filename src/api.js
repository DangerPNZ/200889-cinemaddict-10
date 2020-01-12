import DataAdapter from './data-adapter.js';
const AUTHORIZATION_URL = `Basic cinemaddict_10_200889`;
const API_URL = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const METHOD = {
  post: `POST`,
  get: `GET`,
  put: `PUT`,
  delete: `DELETE`
};
const headers = {
  Authorization: AUTHORIZATION_URL,
  [`Content-Type`]: `application/json`
};

export default class API {
  constructor(applicationDataModel) {
    this.applicationDataModel = applicationDataModel;
    this.dataAdapter = new DataAdapter();
  }
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
  _load(url, method = METHOD.get, body = null) {
    return fetch(`${API_URL}/${url}`, {method, body, headers})
    .then(this.checkStatus)
    .catch((err) => {
      throw err;
    });
  }
  setMoviesData(movies) {
    const applicationMoviesData = this.dataAdapter.getAllFilmsDataToAppStructure(movies);
    this.applicationDataModel.moviesData = applicationMoviesData;
    this.applicationDataModel.filmsDataForRender = applicationMoviesData;
    this.applicationDataModel.onDataLoad();
  }
  getComments(film, onUpdateMovieData) {
    return this._load(`comments/${film.id}`)
    .then((commentsList) => {
      film.comments = commentsList;
      if (!onUpdateMovieData) {
        this.filmsWithCommentsAmounth += 1;
        if (this.filmsAmounth === this.filmsWithCommentsAmounth) {
          this.setMoviesData(this.allMoviesData);
        }
      } else {
        const updatedFilmDataInAppStructure = this.dataAdapter.formatFilmDataToAppStructure(film);
        let index = this.applicationDataModel.moviesData.findIndex((item) => item.id === updatedFilmDataInAppStructure.id);
        this.applicationDataModel.moviesData[index] = updatedFilmDataInAppStructure;
        index = this.applicationDataModel.filmsDataForRender.findIndex((item) => item.id === updatedFilmDataInAppStructure.id);
        this.applicationDataModel.filmsDataForRender[index] = updatedFilmDataInAppStructure;
        onUpdateMovieData(updatedFilmDataInAppStructure);
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
    .then((filmsData) => {
      this.getCommentsForAllMovies(filmsData);
    })
    .catch((err) => {
      throw err;
    });
  }
  updateMovie(id, newData, onMovieUpdated) {
    return this._load(`movies/${id}`, METHOD.put, this.dataAdapter.formatMovieDataToServerStructure(newData))
    .then((film) => {
      this.getComments(film, onMovieUpdated);
    })
    .catch((err) => {
      throw err;
    });
  }
  postComment(filmId, body) {
    return this._load(`comments/${filmId}`, METHOD.post, body)
    .then()
    .catch((err) => {
      throw err;
    });
  }
  deleteComment(commentId) {
    return this._load(`comments/${commentId}`, METHOD.delete)
    .then()
    .catch((err) => {
      throw err;
    });
  }
  // добавить метод для syncMovies для 9 раздела
}
