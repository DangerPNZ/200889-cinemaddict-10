import FilmCard from './film-card.js';
import FilmPopup from './film-popup.js';
import Nav from './nav.js';
import Sort from './sort.js';
import StateHeading from './state-heading.js';
import UserRank from './user-rank.js';
import Films from './films.js';
import FilmsListSection from './films-list-section.js';
import FilmsExtraSection from './films-extra-section.js';
import {getRandomNum} from './utils.js';
import {insertElementInMarkup} from './utils.js';
import {multipleInsertElementsInMarkup} from './utils.js';
import {compare} from './utils.js';
import {removeIt} from '../utils/remove-it.js';

const STATE_LOAD_TEXT = `Loading...`;
const STATE_NO_MOVIES_TEXT = `There are no movies in our database`;
const FILMS_PART_FOR_RENDER_ON_PAGE = 5; // размер партии карточек фильмов для вывода на страницу
const MIN_WATCHED_FILMS_SUM = 0;
const MAX_WATCHED_FILMS_SUM = 100;
const watchedFilmsSum = getRandomNum(MIN_WATCHED_FILMS_SUM, MAX_WATCHED_FILMS_SUM);
const MAX_ELEMENTS_IN_EXTRA_SECTION = 2;
const TOP_RATED_SECTION_HEADING_TEXT = `Top rated`;
const MOST_COMMENTED_SECTION_HEADING_TEXT = `Most commented`;
const PARAMETER_FOR_CREATE_TOP_RATED_SECTION = `ratingVal`;
const PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION = `commentsSum`;

export default class PageController {
  constructor(moviesContainer) {
    this._moviesContainerTemplate = moviesContainer;
    this._filmsListSection = new FilmsListSection(this._moviesContainerTemplate);
    this._components = {
      sort: new Sort(),
      films: new Films(),
      filmsSection: this._filmsListSection,
      searchStateHeading: new StateHeading(STATE_LOAD_TEXT),
      noMoviesStateHeading: new StateHeading(STATE_NO_MOVIES_TEXT)
    };
    this._elements = {
      header: document.querySelector(`.header`),
      main: document.querySelector(`.main`),
      body: document.body,
      filmsSectionMoviesContainer: this._filmsListSection.getContainerElement(),
      showMoreBtn: this._filmsListSection.getShowMoreBtn(),
      userRank: new UserRank(watchedFilmsSum).getElement(),
      footerFilmTotalSum: document.querySelector(`.footer__statistics p`)
    };
    this._filmsInThePage = 0;
  }
  outputFilmParts() {
    for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
      const index = this._filmsInThePage;
      const thisFilmData = this._totalFilmsData[index];
      const filmCard = new FilmCard(thisFilmData);
      const filmPopup = new FilmPopup(thisFilmData);
      const showPopup = () => {
        insertElementInMarkup(filmPopup.returnElementWithCloseHandlers(), this._elements.body);
      };
      filmCard.setClickHandler(showPopup);
      insertElementInMarkup(filmCard, this._elements.filmsSectionMoviesContainer);
      this._filmsInThePage++;
      if (this._filmsInThePage === this._totalFilmsData.length) {
        removeIt(this._elements.showMoreBtn);
        break;
      }
    }
  }
  setFilmsContainerInitialState(allFilmsData) {
    if (allFilmsData.length) {
      insertElementInMarkup(this._components.searchStateHeading, this._components.filmsSection, `prepend`);
      insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
      this.outputFilmParts = this.outputFilmParts.bind(this);
      this._components.filmsSection.setHandlerForShowMoreBtn(this.outputFilmParts);
      this.outputFilmParts();
    } else {
      removeIt(this._elements.showMoreBtn);
      removeIt(this._elements.filmsSectionMoviesContainer);
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
      multipleInsertElementsInMarkup(FilmCard, topElementsByParameter, extraSectionFilmsContainer);
      insertElementInMarkup(extraSection, container);
    }
  }

  render(totalFilmsData) {
    this._totalFilmsData = totalFilmsData;
    this._elements.menu = new Nav(this._totalFilmsData).getElement();
    this.setFilmsContainerInitialState(this._totalFilmsData);
    insertElementInMarkup(this._elements.menu, this._elements.main);
    insertElementInMarkup(this._components.sort, this._elements.main);
    insertElementInMarkup(this._components.films, this._elements.main);
    insertElementInMarkup(this._components.filmsSection, this._components.films);
    this._elements.footerFilmTotalSum.textContent = `${this._totalFilmsData.length} movies inside`;
    insertElementInMarkup(this._elements.userRank, this._elements.header);
    this.createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, this._components.films, this._totalFilmsData);
    this.createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this._components.films, this._totalFilmsData);
  }
}
