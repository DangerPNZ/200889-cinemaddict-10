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
import FilterController from '../controllers/filter-controller.js';

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
const PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION = `commentsSum`;

export default class PageController {
  constructor(applicationContainer, moviesModel) {
    this.moviesModel = moviesModel;
    this._components = {
      films: new Films(),
      filmsSection: new FilmsListSection(),
      searchStateHeading: new StateHeading(STATE_LOAD_TEXT),
      noMoviesStateHeading: new StateHeading(STATE_NO_MOVIES_TEXT)
    };
    this._elements = {
      header: document.querySelector(`.header`),
      main: document.querySelector(`.main`),
      body: applicationContainer,
      moviesContainer: this._components.filmsSection.getContainerElement(),
      showMoreBtn: this._components.filmsSection.getShowMoreBtn(),
      userRank: new UserRank(watchedFilmsSum).getElement(),
      footerFilmTotalSum: document.querySelector(`.footer__statistics p`)
    };
    this.outputFilmParts = this.outputFilmParts.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._filmsInThePage = 0;
    this._controllers = {
      mainSection: [],
      extraSection: []
    };
  }
  rerenderComponent(controller, newData) {
    controller.data = newData;
    controller.filmCard.rerender(newData);
    if (controller.filmPopup) {
      controller.filmPopup.rerender(newData);
    }
  }
  _onDataChange(id, newData) {
    const allControllers = [...this._controllers.mainSection, ...this._controllers.extraSection].filter((item) => {
      return item.id === id;
    });
    allControllers.forEach((item) => {
      this.rerenderComponent(item, newData);
    });
    const index = this.totalFilmsData.findIndex((item) => item.id === id);
    this.totalFilmsData[index] = newData;
  }
  _onViewChange() {
    return [...this._controllers.mainSection, ...this._controllers.extraSection];
  }
  outputFilmParts() {
    for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
      const index = this._filmsInThePage;
      const thisFilmData = this.totalFilmsData[index];
      const controller = new MovieController(this._elements.moviesContainer, this._onDataChange, this._onViewChange);
      this._controllers.mainSection.push(controller);
      controller.render(thisFilmData);
      this._filmsInThePage++;
      if (this._filmsInThePage === this.totalFilmsData.length) {
        removeIt(this._elements.showMoreBtn);
        break;
      }
    }
  }
  rerenderMainFilmsContainer(filmsData) {
    this.totalFilmsData = filmsData;
    this._elements.moviesContainer.innerHTML = ``;
    this._filmsInThePage = 0;
    this._controllers.mainSection = [];
    if (this._components.filmsSection.getShowMoreBtn() === null) {
      insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
    }
    this.outputFilmParts();
  }
  onFilmsPartsChange(filmsData) {
    this.rerenderMainFilmsContainer(filmsData);
  }
  setFilmsContainerInitialState() {
    if (this.totalFilmsData.length) {
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
      return item[sortParameter] > 0;
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
      for (let i = 0; i < this.totalFilmsData.length; i++) {
        for (let j = 0; j < topElementsByParameter.length; j++) {
          if (this.totalFilmsData[i] === topElementsByParameter[j]) {
            const controller = new MovieController(extraSectionFilmsContainer, this._onDataChange, this._onViewChange);
            this._controllers.extraSection.push(controller);
            controller.render(this.totalFilmsData[i]);
          }
        }
      }
      insertElementInMarkup(extraSection, container);
    }
  }

  render() {
    this.moviesModel.onFilmsPartsChange = this.onFilmsPartsChange.bind(this);
    this.sortController = new SortController(this.moviesModel, this._elements.main);
    this.filterController = new FilterController(this.moviesModel, this._elements.main);
    this.sortController.render();
    this.filterController.render();
    this.totalFilmsData = this.moviesModel.filmsDataForRender;
    this.setFilmsContainerInitialState();
    insertElementInMarkup(this._components.films, this._elements.main);
    insertElementInMarkup(this._components.filmsSection, this._components.films);
    this._elements.footerFilmTotalSum.textContent = `${this.totalFilmsData.length} movies inside`;
    insertElementInMarkup(this._elements.userRank, this._elements.header);
    this.createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, this._components.films, this.totalFilmsData);
    this.createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this._components.films, this.totalFilmsData);
  }
}
