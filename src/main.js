import FilmCard from './components/film-card.js';
import FilmPopup from './components/film-popup.js';
import Nav from './components/nav.js';
import Sort from './components/sort.js';
import SearchHeading from './components/search-heading.js';
import ShowMoreBtn from './components/show-more-btn.js';
import UserRank from './components/user-rank.js';
// import ExtraSectionHeading from './components/extra-section-heading.js';
import FilmsSectionContainer from './components/films-section-container.js';
import FilmsListSection from './components/films-list-section.js';
// import FilmsListContainer from './components/films-list-container.js';
import FilmsExtraSection from './components/films-extra-section.js';
import {createFilmsDataList} from './components/films-data-list.js';
import {getRandomNum} from './components/utils.js';
import {compare} from './components/utils.js';

const elements = {
  header: document.querySelector(`.header`),
  main: document.querySelector(`.main`),
  body: document.body
};
const insertElementInMarkup = (element, container, where = `append`) => {
  switch (where) {
    case `append`:
      container.append(element);
      break;
    case `prepend`:
      container.prepend(element);
      break;
    case `before`:
      container.before(element);
      break;
    case `after`:
      container.after(element);
      break;
    case `replaceWith`:
      container.replaceWith(element);
      break;
  }
};
const multipleInsertElementsInMarkup = (ElementGeneratedClass, dataElements, container, where = `append`) => {
  for (const oneDataElement of dataElements) {
    const element = new ElementGeneratedClass(oneDataElement).getElement();
    insertElementInMarkup(element, container, where);
  }
};


const totalFilmsData = createFilmsDataList(12);
const FILMS_PART_FOR_RENDER_ON_PAGE = 5; // размер партии карточек фильмов для вывода на страницу
let filmsInThePage = 0;
const addFilmCardHandlers = (filmCard, popup) => {
  const filmPoster = filmCard.querySelector(`.film-card__poster`);
  const filmName = filmCard.querySelector(`.film-card__title`);
  const filmToCommentsLink = filmCard.querySelector(`.film-card__comments`);
  const popupCloseBtn = popup.querySelector(`.film-details__close-btn`);
  const removePopup = () => {
    elements.body.removeChild(popup);
  };
  const showPopup = () => {
    insertElementInMarkup(popup, elements.body);
  };
  filmPoster.addEventListener(`click`, showPopup);
  filmName.addEventListener(`click`, showPopup);
  filmToCommentsLink.addEventListener(`click`, showPopup);
  popupCloseBtn.addEventListener(`click`, removePopup);
};
const outputFilmParts = () => {
  for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
    const index = filmsInThePage;
    const thisFilmData = totalFilmsData[index];
    const filmCard = new FilmCard(thisFilmData).getElement();
    const filmPopup = new FilmPopup(thisFilmData).getElement();
    addFilmCardHandlers(filmCard, filmPopup);
    insertElementInMarkup(filmCard, elements.filmsListContainer);
    filmsInThePage++;
    if (filmsInThePage === totalFilmsData.length) {
      elements.showMoreBtn.style.display = `none`;
      break;
    }
  }
};
elements.menu = new Nav(totalFilmsData).getElement();
elements.sort = new Sort().getElement();
elements.films = new FilmsSectionContainer().getElement();
elements.filmsList = new FilmsListSection().getElement();
elements.search = new SearchHeading().getElement();
elements.filmsListContainer = new FilmsListSection().getContainerElement();
elements.showMoreBtn = new ShowMoreBtn().getElement();

elements.showMoreBtn.addEventListener(`click`, () => {
  outputFilmParts();
});

const MIN_WATCHED_FILMS_SUM = 0;
const MAX_WATCHED_FILMS_SUM = 100;
const watchedFilmsSum = getRandomNum(MIN_WATCHED_FILMS_SUM, MAX_WATCHED_FILMS_SUM);
elements.userRank = new UserRank(watchedFilmsSum).getElement();
elements.footerFilmTotalSum = document.querySelector(`.footer__statistics p`);

insertElementInMarkup(elements.menu, elements.main);
insertElementInMarkup(elements.sort, elements.main);
insertElementInMarkup(elements.films, elements.main);
insertElementInMarkup(elements.filmsList, elements.films);
insertElementInMarkup(elements.search, elements.filmsList);
elements.footerFilmTotalSum.textContent = `${totalFilmsData.length} movies inside`;
outputFilmParts();
insertElementInMarkup(elements.showMoreBtn, elements.filmsList);
insertElementInMarkup(elements.userRank, elements.header);

const MAX_ELEMENTS_IN_EXTRA_SECTION = 2;
const topRatedHeadingText = `Top rated`;
const mostCommentedHeadingText = `Most commented`;
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
        headingText = topRatedHeadingText;
        break;
      case `commentsSum`:
        headingText = mostCommentedHeadingText;
        break;
    }
    const extraSection = new FilmsExtraSection(headingText);
    const extraSectionFilmsContainer = new FilmsExtraSection(headingText).getContainerElement();
    multipleInsertElementsInMarkup(FilmCard, topElementsByParameter, extraSectionFilmsContainer);
    insertElementInMarkup(extraSection.getElement(), container);
  }
};
createExtraSection(`ratingVal`, elements.films);
createExtraSection(`commentsSum`, elements.films);
