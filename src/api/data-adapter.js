export default class DataAdapter {
  constructor(model, onUpdateMoviesData, onUpdateMovieDataItem) {
    this.model = model;
    this.onUpdateMoviesData = onUpdateMoviesData;
    this.onUpdateMovieDataItem = onUpdateMovieDataItem;
  }
  formatMovieDataToServerStructure(movieData) {
    return JSON.stringify({
      id: movieData.id,
      [`film_info`]: {
        title: movieData.filmTitle,
        [`alternative_title`]: movieData.originalTitle,
        [`total_rating`]: movieData.ratingVal,
        runtime: movieData.filmDuration,
        genre: movieData.genres,
        poster: movieData.posterSrc,
        description: movieData.description,
        [`age_rating`]: movieData.ageLimit,
        director: movieData.directorName,
        writers: movieData.writers,
        actors: movieData.actors,
        release: {
          date: movieData.releaseDate,
          [`release_country`]: movieData.countryOfOrigin
        }
      },
      [`user_details`]: {
        [`already_watched`]: movieData.isAlready,
        [`personal_rating`]: movieData.userRatingValue,
        watchlist: movieData.isInWatchlist,
        favorite: movieData.isFavorites,
        [`watching_date`]: movieData.watchingDate
      },
      comments: movieData.comments.map((item) => item.id)
    });
  }
  setMoviesData(movies) {
    const applicationMoviesData = this._getAllFilmsDataToAppStructure(movies);
    this.onUpdateMoviesData(applicationMoviesData);
  }
  onGetMovieWithUpdatedComments(newMovieData, onUpdateMovieData) {
    const updatedFilmDataInAppStructure = this._formatFilmDataToAppStructure(newMovieData);
    this.onUpdateMovieDataItem(updatedFilmDataInAppStructure);
    onUpdateMovieData(updatedFilmDataInAppStructure);
  }
  _formatFilmDataToAppStructure(movieData) {
    return {
      id: movieData.id,
      filmTitle: movieData.film_info.title,
      originalTitle: movieData.film_info.alternative_title,
      ratingVal: movieData.film_info.total_rating,
      filmDuration: movieData.film_info.runtime,
      genre: movieData.film_info.genre[0] ? movieData.film_info.genre[0] : ``,
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
      comments: movieData.comments
    };
  }
  _getAllFilmsDataToAppStructure(serverMoviesData) {
    const appMoviesData = [];
    for (const movieData of serverMoviesData) {
      appMoviesData.push(this._formatFilmDataToAppStructure(movieData));
    }
    return appMoviesData;
  }
}
