export default class Movies {
  constructor(moviesData) {
    this.moviesData = moviesData;
  }
  // setMoviesData() {

  // }
  getMoviesData() {
    return this.moviesData;
  }
  updateMovieData(oldData, newData) {
    const controllers = [...this._controllers.mainSection, ...this._controllers.extraSection].filter((item) => {
      return item.data === oldData;
    });
    controllers.forEach((item) => {
      this.rerender(item, newData);
    });
    const index = this._allFilmsData.indexOf(oldData);
    this._allFilmsData.splice(index, 1, newData);
  }
}
