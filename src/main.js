import {getFilmCard} from './components/film-card.js';
import {getFilmPopup} from './components/film-popup.js';
import {getNav} from './components/nav.js';
import {getSort} from './components/sort.js';
import {getSearchHeading} from './components/search-heading.js';
import {getShowMoreBtn} from './components/show-more-btn.js';
import {getUserRank} from './components/user-rank.js';
import {getExtraSectionHeading} from './components/extra-section-heading.js';
import {getFilmsSectionContainer} from './components/films-section-container.js';
import {getFilmsListSection} from './components/films-list-section.js';
import {getFilmsListContainer} from './components/films-list-container.js';
import {getFilmsExtraSection} from './components/films-extra-section.js';
import {createFilmsDataList} from './components/films-data-list.js';
import {getRandomNum} from './utils/random-num.js';
import {compare} from './utils/compare.js';

const elements = {
  header: document.querySelector(`.header`),
  main: document.querySelector(`.main`),
  body: document.body
};
const createNewElement = (templateContent) => {
  const element = document.createElement(`template`);
  element.innerHTML = templateContent;
  return element.content.firstElementChild;
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
const multipleInsertElementsInMarkup = (template, templatesData, container) => {
  for (const templateDataItem of templatesData) {
    container.insertAdjacentHTML(`beforeEnd`, template(templateDataItem));
  }
};
const totalFilmsData = createFilmsDataList(12);
const filmsDataForOutput = []; // массив для создания карточек на странице
const FILMS_PART_FOR_RENDER_ON_PAGE = 5; // размер партии карточек фильмов для вывода на страницу
let filmsInThePage = 0;
const outputFilmParts = () => {
  let steps = FILMS_PART_FOR_RENDER_ON_PAGE;
  for (filmsInThePage; steps !== 0; steps--) {
    const index = filmsInThePage;
    filmsDataForOutput.push(totalFilmsData[index]);
    filmsInThePage++;
    if (filmsInThePage === totalFilmsData.length) {
      elements.showMoreBtn.style.display = `none`;
      break;
    }
  }
  multipleInsertElementsInMarkup(getFilmCard, filmsDataForOutput, elements.filmsListContainer);
};
elements.menu = createNewElement(getNav(totalFilmsData));
elements.sort = createNewElement(getSort());
elements.films = createNewElement(getFilmsSectionContainer());
elements.filmsList = createNewElement(getFilmsListSection());
elements.search = createNewElement(getSearchHeading());
elements.filmsListContainer = createNewElement(getFilmsListContainer());
elements.showMoreBtn = createNewElement(getShowMoreBtn());

elements.showMoreBtn.addEventListener(`click`, () => {
  elements.filmsListContainer.innerHTML = ``;
  outputFilmParts();
});

const MIN_WATCHED_FILMS_SUM = 0;
const MAX_WATCHED_FILMS_SUM = 100;
const watchedFilmsSum = getRandomNum(MIN_WATCHED_FILMS_SUM, MAX_WATCHED_FILMS_SUM);
elements.userRank = createNewElement(getUserRank(watchedFilmsSum));
elements.footerFilmTotalSum = document.querySelector(`.footer__statistics p`);

insertElementInMarkup(elements.menu, elements.main);
insertElementInMarkup(elements.sort, elements.main);
insertElementInMarkup(elements.films, elements.main);
insertElementInMarkup(elements.filmsList, elements.films);
insertElementInMarkup(elements.search, elements.filmsList);
insertElementInMarkup(elements.filmsListContainer, elements.filmsList);
elements.footerFilmTotalSum.textContent = `${totalFilmsData.length} movies inside`;
elements.filmPopup = createNewElement(getFilmPopup(totalFilmsData[0]));
outputFilmParts();
insertElementInMarkup(elements.showMoreBtn, elements.filmsList);
insertElementInMarkup(elements.filmPopup, elements.body);
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
    const extraSection = createNewElement(getFilmsExtraSection());
    const extraSectionHeading = createNewElement(getExtraSectionHeading(headingText));
    const extraSectionFilmsContainer = createNewElement(getFilmsListContainer());
    insertElementInMarkup(extraSectionHeading, extraSection);
    insertElementInMarkup(extraSectionFilmsContainer, extraSection);
    multipleInsertElementsInMarkup(getFilmCard, topElementsByParameter, extraSectionFilmsContainer);
    insertElementInMarkup(extraSection, container);
  }
};
createExtraSection(`ratingVal`, elements.films);
createExtraSection(`commentsSum`, elements.films);
