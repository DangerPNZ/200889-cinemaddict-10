export default class Movies {
  constructor(moviesData) {
    this.moviesData = moviesData;
  }
  // setMoviesData() {

  // }
  getMoviesData() {
    return this.moviesData;
  }
  updateMovieData(id, newData) {
    const controllers = [...this._controllers.mainSection, ...this._controllers.extraSection].filter((item) => {
      return item.id === id;
    });
    controllers.forEach((item) => {
      this.rerender(item, newData);
    });
    this.refreshFilmDataInFilmsList(id, newData, this.totalFilmsData);
    this.refreshFilmDataInFilmsList(id, newData, this._allFilmsData);
  }
}
