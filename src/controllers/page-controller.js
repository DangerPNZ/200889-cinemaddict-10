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
  constructor(applicationContainer) {
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
    this._filmsInThePage = 0;
    this._filmCards = [];
  }
  rerender(oldData, newData) {
    const cards = this._filmCards.filter((card) => {
      return card._data === oldData;
    });
    console.log(cards);
    cards.forEach((cardItem) => {
      cardItem.rerender(newData);
      cardItem.recoveryListeners();
    });
  }
  _onDataChange(oldData, newData) {
    this.rerender(oldData, newData);
  }
  outputFilmParts() {
    for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
      const index = this._filmsInThePage;
      const thisFilmData = this._allFilmsData[index];
      const card = new MovieController(this._elements.moviesContainer, this._onDataChange);
      this._filmCards.push(card);
      card.render(thisFilmData);
      this._filmsInThePage++;
      if (this._filmsInThePage === this._allFilmsData.length) {
        removeIt(this._elements.showMoreBtn);
        break;
      }
    }
  }
  setFilmsContainerInitialState(totalFilmsData) {
    this._allFilmsData = totalFilmsData;
    const sortHandler = (event) => {
      const targenSortBtn = event.target;
      if (!targenSortBtn.classList.contains(ACTIVE_SORT_BTN_CLASS)) {
        const sortType = targenSortBtn.getAttribute(DATA_SORT_ATTRIBUTE);
        if (sortType !== SORT_TYPE_VALUES.default) {
          if (sortType === SORT_TYPE_VALUES.byDate) {
            this._allFilmsData = totalFilmsData.slice().sort(compare(SORT_TYPE_VALUES.byDate, true));
          } else if (sortType === SORT_TYPE_VALUES.byRating) {
            this._allFilmsData = totalFilmsData.slice().sort(compare(SORT_TYPE_VALUES.byRating));
          }
        } else {
          this._allFilmsData = totalFilmsData;
        }
        const activeSortBtn = this._components.sort.getElement().querySelector(`.${ACTIVE_SORT_BTN_CLASS}`);
        activeSortBtn.classList.remove(ACTIVE_SORT_BTN_CLASS);
        targenSortBtn.classList.add(ACTIVE_SORT_BTN_CLASS);
        this._elements.moviesContainer.innerHTML = ``;
        this._filmsInThePage = 0;
        this._filmCards = [];
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
      topElementsByParameter.forEach((item) => {
        const card = new MovieController(extraSectionFilmsContainer, this._onDataChange);
        this._filmCards.push(card);
        card.render(item);
      });
      insertElementInMarkup(extraSection, container);
    }
  }

  render(totalFilmsData) {
    this.totalFilmsData = totalFilmsData;
    this._elements.menu = new Nav(totalFilmsData).getElement();
    this.setFilmsContainerInitialState(totalFilmsData);
    insertElementInMarkup(this._elements.menu, this._elements.main);
    insertElementInMarkup(this._components.sort, this._elements.main);
    insertElementInMarkup(this._components.films, this._elements.main);
    insertElementInMarkup(this._components.filmsSection, this._components.films);
    this._elements.footerFilmTotalSum.textContent = `${totalFilmsData.length} movies inside`;
    insertElementInMarkup(this._elements.userRank, this._elements.header);
    this.createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, this._components.films, totalFilmsData);
    this.createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this._components.films, totalFilmsData);
  }
}
