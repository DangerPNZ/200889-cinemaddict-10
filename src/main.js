import FilmCard from './components/film-card.js';
import FilmPopup from './components/film-popup.js';
import Nav from './components/nav.js';
import Sort from './components/sort.js';
import SearchHeading from './components/search-heading.js';
import ShowMoreBtn from './components/show-more-btn.js';
import UserRank from './components/user-rank.js';
import ExtraSectionHeading from './components/extra-section-heading.js';
import FilmsSectionContainer from './components/films-section-container.js';
import FilmsListSection from './components/films-list-section.js';
import FilmsListContainer from './components/films-list-container.js';
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
const outputFilmParts = () => {
  let steps = FILMS_PART_FOR_RENDER_ON_PAGE;
  for (; steps !== 0; steps--) {
    const index = filmsInThePage;
    const thisFilmData = totalFilmsData[index];
    const filmCard = new FilmCard(thisFilmData).getElement();
    const filmPopup = new FilmPopup(thisFilmData);
    const thisfilmPoster = filmCard.querySelector(`.film-card__poster`);
    const thisfilmName = filmCard.querySelector(`.film-card__title`);
    const thisFilmToCommentsLink = filmCard.querySelector(`.film-card__comments`);
    const thisPopupCloseBtn = filmPopup.getElement().querySelector(`.film-details__close-btn`);
    const removePopup = () => {
      elements.body.removeChild(filmPopup.getElement());
    };
    const showPopup = () => {
      insertElementInMarkup(filmPopup.getElement(), elements.body);
    };
    thisfilmPoster.addEventListener(`click`, showPopup);
    thisfilmName.addEventListener(`click`, showPopup);
    thisFilmToCommentsLink.addEventListener(`click`, showPopup);
    thisPopupCloseBtn.addEventListener(`click`, removePopup);

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
elements.filmsListContainer = new FilmsListContainer().getElement();
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
insertElementInMarkup(elements.filmsListContainer, elements.filmsList);
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
    const extraSection = new FilmsExtraSection().getElement();
    const extraSectionHeading = new ExtraSectionHeading(headingText);
    const extraSectionFilmsContainer = new FilmsListContainer().getElement();
    insertElementInMarkup(extraSectionHeading.getElement(), extraSection);
    insertElementInMarkup(extraSectionFilmsContainer, extraSection);
    multipleInsertElementsInMarkup(FilmCard, topElementsByParameter, extraSectionFilmsContainer);
    insertElementInMarkup(extraSection, container);
  }
};
createExtraSection(`ratingVal`, elements.films);
createExtraSection(`commentsSum`, elements.films);
