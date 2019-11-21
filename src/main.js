import {getFilmCard} from './components/film-card.js';
import {getFilmPopup} from './components/film-popup.js';
import {getNav} from './components/nav.js';
import {getSort} from './components/sort.js';
import {getSearchHeading} from './components/search-heading.js';
import {getShowMoreBtn} from './components/show-more-btn.js';
import {getUserRank} from './components/user-rank.js';
import {getTopRatedSectionHeading} from './components/top-rated-section-heading.js';
import {getMostCommentedSectionHeading} from './components/most-commented-section-heading.js';
import {getFilmsSectionContainer} from './components/films-section-container.js';
import {getFilmsListSection} from './components/films-list-section.js';
import {getFilmsListContainer} from './components/films-list-container.js';
import {getFilmsExtraSection} from './components/films-extra-section.js';

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
const multipleInsertElementsInMarkup = (quantity, template, container) => {
  for (let i = 0; i < quantity; i++) {
    container.insertAdjacentHTML(`beforeEnd`, template);
  }
};

elements.menu = createNewElement(getNav());
elements.sort = createNewElement(getSort());
elements.films = createNewElement(getFilmsSectionContainer());
elements.filmsList = createNewElement(getFilmsListSection());
elements.search = createNewElement(getSearchHeading());
elements.filmsListContainer = createNewElement(getFilmsListContainer());
elements.showMoreBtn = createNewElement(getShowMoreBtn());
elements.filmPopup = createNewElement(getFilmPopup());
elements.userRank = createNewElement(getUserRank());
elements.topRated = createNewElement(getFilmsExtraSection());
elements.topRatedFilmsContainer = createNewElement(getFilmsListContainer());
elements.topRatedHeading = createNewElement(getTopRatedSectionHeading());
elements.mostCommented = createNewElement(getFilmsExtraSection());
elements.mostCommentedHeading = createNewElement(getMostCommentedSectionHeading());
elements.mostCommentedFilmsContainer = createNewElement(getFilmsListContainer());

insertElementInMarkup(elements.menu, elements.main);
insertElementInMarkup(elements.sort, elements.main);
insertElementInMarkup(elements.films, elements.main);
insertElementInMarkup(elements.filmsList, elements.films);
insertElementInMarkup(elements.search, elements.filmsList);
insertElementInMarkup(elements.filmsListContainer, elements.filmsList);
multipleInsertElementsInMarkup(5, getFilmCard(), elements.filmsListContainer);
insertElementInMarkup(elements.showMoreBtn, elements.filmsList);
insertElementInMarkup(elements.filmPopup, elements.body);
insertElementInMarkup(elements.userRank, elements.header);
insertElementInMarkup(elements.topRated, elements.films);
insertElementInMarkup(elements.topRatedHeading, elements.topRated);
multipleInsertElementsInMarkup(2, getFilmCard(), elements.topRatedFilmsContainer);
insertElementInMarkup(elements.topRatedFilmsContainer, elements.topRated);
insertElementInMarkup(elements.mostCommented, elements.films);
insertElementInMarkup(elements.mostCommentedHeading, elements.mostCommented);
multipleInsertElementsInMarkup(2, getFilmCard(), elements.mostCommentedFilmsContainer);
insertElementInMarkup(elements.mostCommentedFilmsContainer, elements.mostCommented);
