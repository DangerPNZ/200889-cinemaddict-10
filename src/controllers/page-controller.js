import StateHeading from '../components/state-heading.js';
import UserRank from '../components/user-rank.js';
import Films from '../components/films.js';
import FilmsListSection from '../components/films-list-section.js';
import FilmsExtraSection from '../components/films-extra-section.js';
import {getRandomNum} from '../components/utils.js';
import {insertElementInMarkup} from '../components/utils.js';
import {removeIt} from '../utils/remove-it.js';
import {compare} from '../components/utils.js';
import MovieController from '../controllers/movie-controller.js';
import SortController from '../controllers/sort-controller.js';
import NavController from './nav-controller.js';
import Stat from '../components/stat.js';

const STATE_LOAD_TEXT = `Loading...`;
const STATE_NO_MOVIES_TEXT = `There are no movies in our database`;
const FILMS_PART_FOR_RENDER_ON_PAGE = 5;
const MIN_WATCHED_FILMS_SUM = 0;
const MAX_WATCHED_FILMS_SUM = 100;
const watchedFilmsSum = getRandomNum(MIN_WATCHED_FILMS_SUM, MAX_WATCHED_FILMS_SUM);
const MAX_ELEMENTS_IN_EXTRA_SECTION = 2;
const TOP_RATED_SECTION_HEADING_TEXT = `Top rated`;
const MOST_COMMENTED_SECTION_HEADING_TEXT = `Most commented`;
const PARAMETER_FOR_CREATE_TOP_RATED_SECTION = `ratingVal`;
const PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION = `comments`;

export default class PageController {
  constructor(applicationContainer, moviesModel) {
    this.moviesModel = moviesModel;
    this._components = {
      films: new Films(),
      filmsSection: new FilmsListSection(),
      searchStateHeading: new StateHeading(STATE_LOAD_TEXT),
      noMoviesStateHeading: new StateHeading(STATE_NO_MOVIES_TEXT),
      userRank: new UserRank(watchedFilmsSum)
    };
    this._elements = {
      header: document.querySelector(`.header`),
      main: document.querySelector(`.main`),
      body: applicationContainer,
      moviesContainer: this._components.filmsSection.getContainerElement(),
      showMoreBtn: this._components.filmsSection.getShowMoreBtn(),
      footerFilmTotalSum: document.querySelector(`.footer__statistics p`)
    };
    this.outputFilmParts = this.outputFilmParts.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onStateCountShange = this._onStateCountShange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this.onToFilms = this.onToFilms.bind(this);
    this.onToStatistic = this.onToStatistic.bind(this);
    this._filmsInThePage = 0;
    this._controllers = {
      mainSection: [],
      extraSections: {}
    };
    this._controllers.extraSections[TOP_RATED_SECTION_HEADING_TEXT] = [];
    this._controllers.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT] = [];
    this.moviesModel.onFilmsPartsChange = this.onFilmsPartsChange.bind(this);
  }
  onToFilms() {
    this.showComponents(this.sortController.component, this._components.films, this._components.stat);
    this.hideComponents(this._components.stat);
  }
  onToStatistic() {
    this.hideComponents(this.sortController.component, this._components.films, this._components.stat);
    this.showComponents(this._components.stat);
  }
  showComponents(...components) {
    for (const component of components) {
      component.show();
    }
  }
  hideComponents(...components) {
    for (const component of components) {
      component.hide();
    }
  }
  _onDataChange(id, newData, oldData) {
    const allControllers = [...this._controllers.mainSection,
      ...this._controllers.extraSections[TOP_RATED_SECTION_HEADING_TEXT],
      ...this._controllers.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT]].filter((item) => {
      return item.id === id;
    });
    allControllers.forEach((item) => {
      item.rerenderComponent(newData);
    });
    this.moviesModel.changeMovieData(id, newData);
    if (oldData && newData.isAlready !== oldData.isAlready) {
      this._components.stat.rerender();
    }
  }
  _onStateCountShange() {
    this.navController.rerender();
  }
  _onViewChange() {
    const controllers = [...this._controllers.mainSection,
      ...this._controllers.extraSections[TOP_RATED_SECTION_HEADING_TEXT],
      ...this._controllers.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT]
    ];
    controllers.forEach((item) => {
      item.closePopup();
    });
  }
  outputFilmParts() {
    for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
      const index = this._filmsInThePage;
      const thisFilmData = this.moviesModel.getMoviesDataforRender()[index];
      const controller = new MovieController(this._elements.moviesContainer, this._onDataChange, this._onViewChange, this._onStateCountShange);
      this._controllers.mainSection.push(controller);
      controller.render(thisFilmData);
      this._filmsInThePage++;
      if (this._filmsInThePage === this.moviesModel.getMoviesDataforRender().length) {
        removeIt(this._elements.showMoreBtn);
        break;
      }
    }
  }
  onFilmsPartsChange(filmsData) {
    this._elements.moviesContainer.innerHTML = ``;
    this._filmsInThePage = 0;
    this._controllers.mainSection = [];
    if (this._components.filmsSection.getShowMoreBtn() === null && filmsData.length !== 0) {
      insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
    }
    if (filmsData.length !== 0) {
      this.outputFilmParts();
    } else {
      // вывести сообщение отсутствия фильмов, удалить контейнер (?)
      removeIt(this._elements.showMoreBtn);
    }
  }
  setFilmsContainerInitialState() {
    this.hideComponents(this._components.stat);
    if (this.moviesModel.getMoviesDataforRender().length) {
      insertElementInMarkup(this._components.searchStateHeading, this._components.filmsSection, `prepend`);
      insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
      this._components.filmsSection.setHandlerForShowMoreBtn(this.outputFilmParts);
      this.outputFilmParts();
    } else {
      removeIt(this._elements.showMoreBtn);
      removeIt(this._elements.moviesContainer);
      insertElementInMarkup(this._components.noMoviesStateHeading, this._components.filmsSection);
    }
  }
  getExtraSectionFilmsCardsData(sortParameter, totalFilmsData) {
    const sortedCardsDataByParameter = totalFilmsData.slice().sort(compare(sortParameter));
    return sortedCardsDataByParameter.filter((item) => {
      return Array.isArray(item[sortParameter]) ? item[sortParameter].length > 0 : item[sortParameter] > 0;
    });
  }
  createExtraSection(sortParameter, container, totalFilmsData) {
    const extraSectionFilmsCardsData = this.getExtraSectionFilmsCardsData(sortParameter, totalFilmsData);
    if (extraSectionFilmsCardsData.length) {
      const topElementsByParameter = extraSectionFilmsCardsData.slice(0, MAX_ELEMENTS_IN_EXTRA_SECTION);
      let headingText = ``;
      switch (sortParameter) {
        case PARAMETER_FOR_CREATE_TOP_RATED_SECTION:
          headingText = TOP_RATED_SECTION_HEADING_TEXT;
          break;
        case PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION:
          headingText = MOST_COMMENTED_SECTION_HEADING_TEXT;
          break;
      }
      const extraSection = new FilmsExtraSection(headingText);
      const extraSectionFilmsContainer = extraSection.getContainerElement();
      topElementsByParameter.forEach((item) => {
        const controller = new MovieController(extraSectionFilmsContainer, this._onDataChange, this._onViewChange, this._onStateCountShange);
        this._controllers.extraSections[headingText].push(controller);
        controller.render(item);
      });
      insertElementInMarkup(extraSection, container);
    }
  }
  render() {
    this._components.stat = new Stat(this._components.userRank.getRank(), this.moviesModel.getMoviesDataforRender(), this._elements.main);
    this._components.stat.render();
    this.sortController = new SortController(this.moviesModel, this._elements.main);
    this.navController = new NavController(this.moviesModel, this._elements.main, this.onToStatistic, this.onToFilms);
    this.sortController.render();
    this.navController.render();
    this.setFilmsContainerInitialState();
    insertElementInMarkup(this._components.films, this._elements.main);
    insertElementInMarkup(this._components.filmsSection, this._components.films);
    this._elements.footerFilmTotalSum.textContent = `${this.moviesModel.getMoviesData().length} movies inside`;
    insertElementInMarkup(this._components.userRank, this._elements.header);
    this.createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, this._components.films, this.moviesModel.getMoviesData());
    this.createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this._components.films, this.moviesModel.getMoviesData());
  }
}
