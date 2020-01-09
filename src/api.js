const AUTHORIZATION_URL = `Basic cinemaddict_10_200889`;
const API_URL = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const METHOD = {
  post: `POST`,
  get: `GET`,
  put: `PUT`,
  delete: `DELETE`
};

export default class API {
  constructor(applicationDataModel) {
    this.applicationDataModel = applicationDataModel;
  }
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }
  _load(url, method = METHOD.get, body = null, headers = new Headers()) {
    headers.append(`Authorization`, AUTHORIZATION_URL);
    return fetch(`${API_URL}/${url}`, {method, body, headers})
    .then(this.checkStatus)
    .catch((err) => {
      throw err;
    });
  }
  setMoviesData(movies) {
    this.applicationDataModel.moviesData = movies;
    this.applicationDataModel.filmsDataForRender = movies;
    this.applicationDataModel.onDataLoad();
  }
  getCommentsForMovie(index, movies) {
    this.getComments(movies[index])
    .then(() => {
      if (index === (movies.length - 1)) {
        this.setMoviesData(movies);
      } else {
        index += 1;
        this.getCommentsForMovie(index, movies);
      }
    });
  }
  getComments(film) {
    return this._load(`comments/${film.id}`)
    .then((commentsList) => {
      film.comments = commentsList;
    })
    .catch((err) => {
      throw err;
    });
  }
  structureMoviesDataForRender(filmsData) {
    const moviesDataForRender = [];
    let index = 0;
    for (const movieData of filmsData) {
      moviesDataForRender.push({
        id: movieData.id,
        filmTitle: movieData.film_info.title,
        originalTitle: movieData.film_info.alternative_title,
        ratingVal: +movieData.film_info.total_rating,
        filmDuration: movieData.film_info.runtime,
        genre: movieData.film_info.genre[0],
        posterSrc: movieData.film_info.poster,
        description: movieData.film_info.description,
        ageLimit: movieData.film_info.age_rating,
        directorName: movieData.film_info.director,
        writers: movieData.film_info.writers,
        actors: movieData.film_info.actors,
        releaseDate: movieData.film_info.release.date,
        countryOfOrigin: movieData.film_info.release.release_country,
        genres: movieData.film_info.genre,
        isAlready: movieData.user_details.already_watched,
        userRatingValue: movieData.user_details.personal_rating,
        isInWatchlist: movieData.user_details.watchlist,
        isFavorites: movieData.user_details.favorite,
        watchingDate: movieData.user_details.watching_date,
      });
    }
    this.getCommentsForMovie(index, moviesDataForRender);
    return moviesDataForRender;
  }
  getMovies() {
    return this._load(`movies`)
    .then((filmsData) => {
      this.structureMoviesDataForRender(filmsData);
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
