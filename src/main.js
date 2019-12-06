import FilmCard from './components/film-card.js';
import FilmPopup from './components/film-popup.js';
import Nav from './components/nav.js';
import Sort from './components/sort.js';
import StateHeading from './components/state-heading.js';
import UserRank from './components/user-rank.js';
import Films from './components/films.js';
import FilmsListSection from './components/films-list-section.js';
import FilmsExtraSection from './components/films-extra-section.js';
import PageController from './components/page-controller';
import {createFilmsDataList} from './components/films-data-list.js';
import {getRandomNum} from './components/utils.js';
import {compare} from './components/utils.js';
import {removeIt} from './utils/remove-it.js';

const pageController = new PageController();
const STATE_LOAD_TEXT = `Loading...`;
const STATE_NO_MOVIES_TEXT = `There are no movies in our database`;
const filmsListSection = new FilmsListSection();
const elementsAndComponents = {
  header: document.querySelector(`.header`),
  main: document.querySelector(`.main`),
  body: document.body,
  sort: new Sort(),
  films: new Films(),
  filmsSection: filmsListSection,
  filmsSectionMoviesContainer: filmsListSection.getContainerElement(),
  showMoreBtn: filmsListSection.getShowMoreBtn(),
  searchStateHeading: new StateHeading(STATE_LOAD_TEXT),
  noMoviesStateHeading: new StateHeading(STATE_NO_MOVIES_TEXT),
};
const multipleInsertElementsInMarkup = (ElementGenerator, dataElements, container, where = `append`) => {
  for (const oneDataElement of dataElements) {
    const element = new ElementGenerator(oneDataElement);
    pageController.render(element, container, where);
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
      pageController.render(filmPopup.setCloseHandler(), elementsAndComponents.body);
    };
    filmCard.setClickHandler(showPopup);
    pageController.render(filmCard, elementsAndComponents.filmsSectionMoviesContainer);
    filmsInThePage++;
    if (filmsInThePage === totalFilmsData.length) {
      removeIt(elementsAndComponents.showMoreBtn);
      break;
    }
  }
};

elementsAndComponents.menu = new Nav(totalFilmsData).getElement();
const setFilmsContainerInitialState = (allFilmsData) => {
  if (allFilmsData.length) {
    pageController.render(elementsAndComponents.searchStateHeading, elementsAndComponents.filmsSection, `prepend`);
    pageController.render(elementsAndComponents.showMoreBtn, elementsAndComponents.filmsSection);
    elementsAndComponents.filmsSection.setHandlerForShowMoreBtn(outputFilmParts);
    outputFilmParts();
  } else {
    removeIt(elementsAndComponents.showMoreBtn);
    removeIt(elementsAndComponents.filmsSectionMoviesContainer);
    pageController.render(elementsAndComponents.noMoviesStateHeading, elementsAndComponents.filmsSection);
  }
};
setFilmsContainerInitialState(totalFilmsData);

const MIN_WATCHED_FILMS_SUM = 0;
const MAX_WATCHED_FILMS_SUM = 100;
const watchedFilmsSum = getRandomNum(MIN_WATCHED_FILMS_SUM, MAX_WATCHED_FILMS_SUM);
elementsAndComponents.userRank = new UserRank(watchedFilmsSum).getElement();
elementsAndComponents.footerFilmTotalSum = document.querySelector(`.footer__statistics p`);

pageController.render(elementsAndComponents.menu, elementsAndComponents.main);
pageController.render(elementsAndComponents.sort, elementsAndComponents.main);
pageController.render(elementsAndComponents.films, elementsAndComponents.main);
pageController.render(elementsAndComponents.filmsSection, elementsAndComponents.films);
elementsAndComponents.footerFilmTotalSum.textContent = `${totalFilmsData.length} movies inside`;
pageController.render(elementsAndComponents.userRank, elementsAndComponents.header);

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
    pageController.render(extraSection, container);
  }
};
const PARAMETER_FOR_CREATE_TOP_RATED_SECTION = `ratingVal`;
const PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION = `commentsSum`;
createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, elementsAndComponents.films);
createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, elementsAndComponents.films);
