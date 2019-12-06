import FilmCard from './components/film-card.js';
import FilmPopup from './components/film-popup.js';
import Nav from './components/nav.js';
import Sort from './components/sort.js';
import StateHeading from './components/state-heading.js';
import ShowMoreBtn from './components/show-more-btn.js';
import UserRank from './components/user-rank.js';
import FilmsSectionContainer from './components/films-section-container.js';
import FilmsListSection from './components/films-list-section.js';
import FilmsExtraSection from './components/films-extra-section.js';
import PageController from './components/page-controller';
import {createFilmsDataList} from './components/films-data-list.js';
import {getRandomNum} from './components/utils.js';
import {compare} from './components/utils.js';
import {removeIt} from './utils/remove-it.js';

const STATE_LOAD_TEXT = `Loading...`;
const STATE_NO_MOVIES_TEXT = `There are no movies in our database`;
const filmsListSection = new FilmsListSection();
const elements = {
  header: document.querySelector(`.header`),
  main: document.querySelector(`.main`),
  body: document.body,
  sort: new Sort(),
  films: new FilmsSectionContainer(),
  filmsList: filmsListSection,
  filmsListContainer: filmsListSection.getContainerElement(),
  showMoreBtn: new ShowMoreBtn(),
  searchStateHeading: new StateHeading(STATE_LOAD_TEXT),
  noMoviesStateHeading: new StateHeading(STATE_NO_MOVIES_TEXT),
};
const multipleInsertElementsInMarkup = (ElementGeneratedClass, dataElements, container, where = `append`) => {
  for (const oneDataElement of dataElements) {
    const element = new ElementGeneratedClass(oneDataElement);
    new PageController(element, container, where).render();
  }
};

const totalFilmsData = createFilmsDataList(12); // []; для проверки заглушки

const FILMS_PART_FOR_RENDER_ON_PAGE = 5; // размер партии карточек фильмов для вывода на страницу
let filmsInThePage = 0;
const outputFilmParts = () => {
  for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
    const index = filmsInThePage;
    const thisFilmData = totalFilmsData[index];
    const filmCard = new FilmCard(thisFilmData);
    const filmPopup = new FilmPopup(thisFilmData);
    const showPopup = () => {
      new PageController(filmPopup, elements.body).render();
    };
    filmCard.setClickHandler(showPopup);
    new PageController(filmCard, elements.filmsListContainer).render();
    filmsInThePage++;
    if (filmsInThePage === totalFilmsData.length) {
      removeIt(elements.showMoreBtn);
      break;
    }
  }
};

elements.menu = new Nav(totalFilmsData).getElement();
const setFilmsContainerInitialState = (allFilmsData) => {
  if (allFilmsData.length) {
    new PageController(elements.searchStateHeading, elements.filmsList, `prepend`).render();
    new PageController(elements.showMoreBtn, elements.filmsList).render();
    elements.showMoreBtn.setClickHandler(outputFilmParts);
    outputFilmParts();
  } else {
    removeIt(elements.filmsListContainer);
    new PageController(elements.noMoviesStateHeading, elements.filmsList).render();
  }
};
setFilmsContainerInitialState(totalFilmsData);

const MIN_WATCHED_FILMS_SUM = 0;
const MAX_WATCHED_FILMS_SUM = 100;
const watchedFilmsSum = getRandomNum(MIN_WATCHED_FILMS_SUM, MAX_WATCHED_FILMS_SUM);
elements.userRank = new UserRank(watchedFilmsSum).getElement();
elements.footerFilmTotalSum = document.querySelector(`.footer__statistics p`);

new PageController(elements.menu, elements.main).render();
new PageController(elements.sort, elements.main).render();
new PageController(elements.films, elements.main).render();
new PageController(elements.filmsList, elements.films).render();
elements.footerFilmTotalSum.textContent = `${totalFilmsData.length} movies inside`;
new PageController(elements.userRank, elements.header).render();

const MAX_ELEMENTS_IN_EXTRA_SECTION = 2;
const TOP_RATED_SECTION_HEADING_TEXT = `Top rated`;
const MOST_COMMENTED_SECTION_HEADING_TEXT = `Most commented`;
const getExtraSectionFilmsCardsData = (sortParameter) => {
  const sortedCardsDataByParameter = totalFilmsData.slice().sort(compare(sortParameter));
  return sortedCardsDataByParameter.filter((item) => {
    return item[sortParameter] > 0;
  });
};
const createExtraSection = (sortParameter, container) => {
  const extraSectionFilmsCardsData = getExtraSectionFilmsCardsData(sortParameter);
  if (extraSectionFilmsCardsData.length) {
    const topElementsByParameter = extraSectionFilmsCardsData.slice(0, MAX_ELEMENTS_IN_EXTRA_SECTION);
    let headingText = ``;
    switch (sortParameter) {
      case `ratingVal`:
        headingText = TOP_RATED_SECTION_HEADING_TEXT;
        break;
      case `commentsSum`:
        headingText = MOST_COMMENTED_SECTION_HEADING_TEXT;
        break;
    }
    const extraSection = new FilmsExtraSection(headingText);
    const extraSectionFilmsContainer = extraSection.getContainerElement();
    multipleInsertElementsInMarkup(FilmCard, topElementsByParameter, extraSectionFilmsContainer);
    new PageController(extraSection, container).render();
  }
};
const PARAMETER_FOR_CREATE_TOP_RATED_SECTION = `ratingVal`;
const PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION = `commentsSum`;
createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, elements.films);
createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, elements.films);
