import Nav from '../components/nav.js';
import Sort from '../components/sort.js';
import StateHeading from '../components/state-heading.js';
import UserRank from '../components/user-rank.js';
import Films from '../components/films.js';
import FilmsListSection from '../components/films-list-section.js';
import FilmsExtraSection from '../components/films-extra-section.js';
import MovieController from '../controllers/movie-controller.js';
import {getRandomNum} from '../components/utils.js';
import {insertElementInMarkup} from '../components/utils.js';
import {compare} from '../components/utils.js';
import {removeIt} from '../utils/remove-it.js';

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
const ACTIVE_SORT_BTN_CLASS = `sort__button--active`;
const DATA_SORT_ATTRIBUTE = `data-sorttype`;
const SORT_TYPE_VALUES = {
  default: `default`,
  byDate: `releaseDate`,
  byRating: `ratingVal`
};

export default class PageController {
  constructor(applicationContainer, moviesModel) {
    this.moviesModel = moviesModel;
    this.totalFilmsData = this.moviesModel.getMoviesData();
    this._components = {
      sort: new Sort(),
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
  rerender(controller, newData) {
    controller.data = newData;
    controller.filmCard.rerender(newData);
    if (controller.filmPopup) {
      controller.filmPopup.rerender(newData);
    }
  }
  refreshFilmDataInFilmsList(id, newData, filmsList) {
    const index = filmsList.findIndex((item) => item.id === id);
    filmsList[index] = newData;
  }
  _onDataChange(id, newData) {
    const controllers = [...this._controllers.mainSection, ...this._controllers.extraSection].filter((item) => {
      return item.id === id;
    });
    controllers.forEach((item) => {
      this.rerender(item, newData);
    });
    this.refreshFilmDataInFilmsList(id, newData, this.totalFilmsData);
    this.refreshFilmDataInFilmsList(id, newData, this._allFilmsData);
  }
  _onViewChange() {
    return [...this._controllers.mainSection, ...this._controllers.extraSection];
  }
  outputFilmParts() {
    for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
      const index = this._filmsInThePage;
      const thisFilmData = this._allFilmsData[index];
      const controller = new MovieController(this._elements.moviesContainer, this._onDataChange, this._onViewChange);
      this._controllers.mainSection.push(controller);
      controller.render(thisFilmData);
      this._filmsInThePage++;
      if (this._filmsInThePage === this._allFilmsData.length) {
        removeIt(this._elements.showMoreBtn);
        break;
      }
    }
  }
  setFilmsContainerInitialState() {
    this._allFilmsData = this.totalFilmsData;
    const sortHandler = (event) => {
      event.preventDefault();
      const targenSortBtn = event.target;
      if (!targenSortBtn.classList.contains(ACTIVE_SORT_BTN_CLASS)) {
        const sortType = targenSortBtn.getAttribute(DATA_SORT_ATTRIBUTE);
        if (sortType !== SORT_TYPE_VALUES.default) {
          if (sortType === SORT_TYPE_VALUES.byDate) {
            this._allFilmsData = this.totalFilmsData.slice().sort(compare(SORT_TYPE_VALUES.byDate, true));
          } else if (sortType === SORT_TYPE_VALUES.byRating) {
            this._allFilmsData = this.totalFilmsData.slice().sort(compare(SORT_TYPE_VALUES.byRating));
          }
        } else {
          this._allFilmsData = this.totalFilmsData;
        }
        const activeSortBtn = this._components.sort.getElement().querySelector(`.${ACTIVE_SORT_BTN_CLASS}`);
        activeSortBtn.classList.remove(ACTIVE_SORT_BTN_CLASS);
        targenSortBtn.classList.add(ACTIVE_SORT_BTN_CLASS);
        this._elements.moviesContainer.innerHTML = ``;
        this._filmsInThePage = 0;
        this._controllers.mainSection = [];
        this.outputFilmParts();
        if (this._components.filmsSection.getShowMoreBtn() === null) {
          insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
        }
      }
    };
    if (this._allFilmsData.length) {
      insertElementInMarkup(this._components.searchStateHeading, this._components.filmsSection, `prepend`);
      insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
      this._components.filmsSection.setHandlerForShowMoreBtn(this.outputFilmParts);
      this.outputFilmParts();
    } else {
      removeIt(this._elements.showMoreBtn);
      removeIt(this._elements.moviesContainer);
      insertElementInMarkup(this._components.noMoviesStateHeading, this._components.filmsSection);
    }
    this._components.sort.setHandlers(sortHandler.bind(this));
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
    this._elements.menu = new Nav(this.totalFilmsData).getElement();
    this.setFilmsContainerInitialState();
    insertElementInMarkup(this._elements.menu, this._elements.main);
    insertElementInMarkup(this._components.sort, this._elements.main);
    insertElementInMarkup(this._components.films, this._elements.main);
    insertElementInMarkup(this._components.filmsSection, this._components.films);
    this._elements.footerFilmTotalSum.textContent = `${this.totalFilmsData.length} movies inside`;
    insertElementInMarkup(this._elements.userRank, this._elements.header);
    this.createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, this._components.films, this.totalFilmsData);
    this.createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this._components.films, this.totalFilmsData);
  }
}
