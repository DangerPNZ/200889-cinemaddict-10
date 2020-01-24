import StateHeading from '../components/state-heading.js';
import UserRank from '../components/user-rank.js';
import Films from '../components/films.js';
import FilmsListSection from '../components/films-list-section.js';
import FilmsExtraSection from '../components/films-extra-section.js';
import {insertElementInMarkup} from '../utils/utils.js';
import {removeIt} from '../utils/utils.js';
import {compare} from '../utils/utils.js';
import MovieController from '../controllers/movie-controller.js';
import SortController from '../controllers/sort-controller.js';
import NavController from './nav-controller.js';
import Stat from '../components/stat.js';

const STATE_LOAD_TEXT = `Loading...`;
const STATE_NO_MOVIES_TEXT = `There are no movies in our database`;
const FILMS_PART_FOR_RENDER_ON_PAGE = 5;
const MAX_ELEMENTS_IN_EXTRA_SECTION = 2;
const TOP_RATED_SECTION_HEADING_TEXT = `Top rated`;
const MOST_COMMENTED_SECTION_HEADING_TEXT = `Most commented`;
const PARAMETER_FOR_CREATE_TOP_RATED_SECTION = `ratingVal`;
const PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION = `comments`;
const AMOUNTH_ELEMENTS_WHEN_DELETING_ONE_ELEMENT = 1;

const getNextElementIndex = (index) => index + 1;
const getServerDataUpdateCallback = (that, allControllers, id, newData, oldData) => {
  return (data) => {
    const controllersForChange = newData ? allControllers.filter((item) => item.id === id) : allControllers.filter((item) => item.filmPopup !== undefined);
    for (const item of controllersForChange) {
      if (!newData) {
        item.data.comments.forEach((comment, index, array) => {
          if (comment.id === id) {
            array.splice(index, AMOUNTH_ELEMENTS_WHEN_DELETING_ONE_ELEMENT);
            that._updateMostCommentSection(item.data, that.moviesModel.onUpdateMovieDataItem);
          }
        });
        const controllersBesidesMostCommentSection = [...that._controllers.mainSection, ...that._controllers.extraSections[TOP_RATED_SECTION_HEADING_TEXT]];
        for (const controller of controllersBesidesMostCommentSection) {
          controller.rerenderComponent(that.moviesModel.getAllMoviesData().find((movieData) => movieData.id === controller.id));
        }
      } else if (newData && !oldData) {
        that._updateMostCommentSection(data, that.moviesModel.onUpdateMovieDataItem);
        item.rerenderComponent(data);
      } else {
        item.rerenderComponent(data);
      }
    }
    if (newData && oldData) {
      if (newData.isAlready !== oldData.isAlready) {
        that._getNewUserRank();
        that._components.stat.rerender(that._components.userRank.getRank(), false);
      }
      that._stateCountChange();
    }
  };
};
const getErrorCallback = (allControllers, newData, oldData, id) => {
  const controllerWithPopup = allControllers.find((item) => item.filmPopup !== undefined);
  if (newData) {
    if (oldData) {
      if (newData.userRatingValue !== oldData.userRatingValue) {
        return () => {
          controllerWithPopup.filmPopup.onUserRatingUpdateError();
          controllerWithPopup.filmPopup.enabledChangeStatusBtns();
        };
      }
      if (!controllerWithPopup) {
        const controllersForChange = allControllers.filter((item) => item.id === id);
        return () => {
          for (const controller of controllersForChange) {
            controller.filmCard.enabledChangeStatusBtns();
          }
        };
      } else {
        return controllerWithPopup.filmPopup.enabledChangeStatusBtns;
      }
    } else {
      return controllerWithPopup.filmPopup.onCommentSendError;
    }
  }
  return controllerWithPopup.filmPopup.onCommentDeleteError;
};

export default class PageController {
  constructor(applicationContainer, moviesModel) {
    this.moviesModel = moviesModel;
    this._components = {
      films: new Films(),
      filmsSection: new FilmsListSection(),
      loadingStateHeading: new StateHeading(STATE_LOAD_TEXT),
      noMoviesStateHeading: new StateHeading(STATE_NO_MOVIES_TEXT),
      userRank: new UserRank(this.moviesModel.getMoviesDataForRender())
    };
    this._elements = {
      header: document.querySelector(`.header`),
      main: document.querySelector(`.main`),
      body: applicationContainer,
      moviesContainer: this._components.filmsSection.getContainerElement(),
      showMoreBtn: this._components.filmsSection.getShowMoreBtn(),
      footerFilmTotalSum: document.querySelector(`.footer__statistics p`),
      extraSections: {}
    };
    this._outputFilmParts = this._outputFilmParts.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._stateCountChange = this._stateCountChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this.onToFilms = this.onToFilms.bind(this);
    this.onToStatistic = this.onToStatistic.bind(this);
    this._updateMostCommentSection = this._updateMostCommentSection.bind(this);
    this._filmsInThePage = 0;
    this._controllers = {
      mainSection: [],
      extraSections: {
        [TOP_RATED_SECTION_HEADING_TEXT]: [],
        [MOST_COMMENTED_SECTION_HEADING_TEXT]: []
      }
    };
  }
  onToFilms() {
    this._showComponents(this.sortController.component, this._components.films, this._components.stat);
    this._components.stat.hide();
  }
  onToStatistic() {
    this._hideComponents(this.sortController.component, this._components.films, this._components.stat);
    this._components.stat.show();
  }
  setFilmsContainerInitialState(init = false) {
    this._hideComponents(this._components.stat);
    if (this.moviesModel.getMoviesAmount()) {
      removeIt(this._components.loadingStateHeading.getElement());
      insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
      this._components.filmsSection.setHandlerForShowMoreBtn(this._outputFilmParts);
      this._outputFilmParts();
    } else {
      removeIt(this._elements.showMoreBtn);
      removeIt(this._elements.moviesContainer);
      if (!init) {
        removeIt(this._components.loadingStateHeading.getElement());
      }
      insertElementInMarkup(init ? this._components.loadingStateHeading : this._components.noMoviesStateHeading, this._components.filmsSection);
    }
  }
  setStateAfterDataLoad() {
    removeIt(this._components.stat.getElement());
    removeIt(this.sortController.component.getElement());
    removeIt(this.navController.component.getElement());
    this._components.userRank = new UserRank(this.moviesModel.getMoviesDataForRender());
    this._createStatComponent();
    this._createSortController();
    this._createNavController();
    insertElementInMarkup(this._components.userRank, this._elements.header);
    insertElementInMarkup(this._components.films, this._elements.main);
    insertElementInMarkup(this._elements.moviesContainer, this._components.filmsSection, `prepend`);
    insertElementInMarkup(this._components.filmsSection, this._components.films);
    this.setFilmsContainerInitialState();
    this._setFilmsAmountInFooter();
    this._createExtraSection(PARAMETER_FOR_CREATE_TOP_RATED_SECTION, this._components.films, this.moviesModel.getMoviesDataForRender());
    this._createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this._components.films, this.moviesModel.getMoviesDataForRender());
    this.onToFilms();
  }
  onFilmsPartsChange(filmsData) {
    this._elements.moviesContainer.innerHTML = ``;
    this._filmsInThePage = 0;
    this._controllers.mainSection = [];
    if (this._components.filmsSection.getShowMoreBtn() === null && filmsData.length !== 0) {
      insertElementInMarkup(this._elements.showMoreBtn, this._components.filmsSection);
    }
    return filmsData.length !== 0 ? this._outputFilmParts() : removeIt(this._elements.showMoreBtn);
  }
  render() {
    this.moviesModel.setChangeCallback(this.onFilmsPartsChange.bind(this));
    this.moviesModel.setAfterDataLoadCallback(this.setStateAfterDataLoad.bind(this));
    this._createStatComponent();
    this._createSortController();
    this._createNavController();
    this.setFilmsContainerInitialState(true);
    insertElementInMarkup(this._components.films, this._elements.main);
    insertElementInMarkup(this._components.filmsSection, this._components.films);
    this._setFilmsAmountInFooter();
    this.moviesModel.getMoviesDataFromServer();
  }
  _showComponents(...components) {
    for (const component of components) {
      component.show();
    }
  }
  _hideComponents(...components) {
    for (const component of components) {
      component.hide();
    }
  }
  _getNewUserRank() {
    removeIt(this._components.userRank);
    this._components.userRank = new UserRank(this.moviesModel.getMoviesDataForRender());
    insertElementInMarkup(this._components.userRank, this._elements.header);
  }
  _createStatComponent() {
    this._components.stat = new Stat(this._components.userRank.getRank(), this.moviesModel.getMoviesDataForRender(), this._elements.main);
    this._components.stat.render();
  }
  _createSortController() {
    this.sortController = new SortController(this.moviesModel, this._elements.main);
    this.sortController.render();
  }
  _createNavController() {
    this.navController = new NavController(this.moviesModel, this._elements.main, this.onToStatistic, this.onToFilms);
    this.navController.render();
  }
  _setFilmsAmountInFooter() {
    this._elements.footerFilmTotalSum.textContent = `${this.moviesModel.getMoviesAmount()} movies inside`;
  }
  _onViewChange() {
    const controllers = [...this._controllers.mainSection,
      ...this._controllers.extraSections[TOP_RATED_SECTION_HEADING_TEXT],
      ...this._controllers.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT]
    ];
    for (const item of controllers) {
      item.closePopup();
    }
  }
  _stateCountChange() {
    this.navController.rerender();
  }
  _onDataChange(id, newData, oldData) {
    const allControllers = [...this._controllers.mainSection,
      ...this._controllers.extraSections[TOP_RATED_SECTION_HEADING_TEXT],
      ...this._controllers.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT]];
    if (newData && oldData) {
      this.moviesModel.changeMovieData(id, newData, getServerDataUpdateCallback(this, allControllers, id, newData, oldData), getErrorCallback(allControllers, newData, oldData, id));
    } else if (newData) {
      this.moviesModel.addNewComment(id, newData, getServerDataUpdateCallback(this, allControllers, id, newData), getErrorCallback(allControllers, newData));
    } else {
      this.moviesModel.deleteComment(id, getServerDataUpdateCallback(this, allControllers, id), getErrorCallback(allControllers));
    }
  }
  _getExtraSectionFilmsCardsData(sortParameter, totalFilmsData) {
    const sortedCardsDataByParameter = totalFilmsData.slice().sort(compare(sortParameter));
    return sortedCardsDataByParameter.filter((item) => Array.isArray(item[sortParameter]) ? item[sortParameter].length > 0 : item[sortParameter] > 0);
  }
  _createExtraSection(sortParameter, container, totalFilmsData) {
    const extraSectionFilmsCardsData = this._getExtraSectionFilmsCardsData(sortParameter, totalFilmsData);
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
      this._elements.extraSections[headingText] = extraSection;
      const extraSectionFilmsContainer = extraSection.getContainerElement();
      for (const item of topElementsByParameter) {
        const controller = new MovieController(extraSectionFilmsContainer, this._onDataChange, this._onViewChange);
        this._controllers.extraSections[headingText].push(controller);
        controller.render(item);
      }
      insertElementInMarkup(extraSection, container);
    }
  }
  _updateMostCommentSectionControllers(topElementsByParameter, controllers) {
    const container = this._elements.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT].getContainerElement();
    topElementsByParameter.forEach((item, index, arr) => {
      let hasPopup = false;
      if (controllers[index]) {
        hasPopup = controllers[index].removeElements();
      }
      const newController = new MovieController(container, this._onDataChange, this._onViewChange);
      controllers.splice(index, 1, newController);
      newController.render(item);
      if (hasPopup) {
        newController.showPopup();
      }
      if (!arr[getNextElementIndex(index)] && controllers[getNextElementIndex(index)]) {
        controllers[getNextElementIndex(index)].removeElements();
        controllers.splice(getNextElementIndex(index), 1);
      }
    });
  }
  _updateMostCommentSection(updatedMovieData, onUpdateMovieDataItem) {
    onUpdateMovieDataItem(updatedMovieData);
    const extraSectionFilmsNewData = this._getExtraSectionFilmsCardsData(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this.moviesModel.getAllMoviesData());
    const controllersFromMostCommentedSection = this._controllers.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT];
    let topElementsByParameter = null;
    if (extraSectionFilmsNewData.length) {
      topElementsByParameter = extraSectionFilmsNewData.slice(0, MAX_ELEMENTS_IN_EXTRA_SECTION);
    }
    if (topElementsByParameter) {
      if (controllersFromMostCommentedSection.length) {
        this._updateMostCommentSectionControllers(topElementsByParameter, controllersFromMostCommentedSection);
      } else {
        this._createExtraSection(PARAMETER_FOR_CREATE_MOST_COMMENTED_SECTION, this._components.films, this.moviesModel.getAllMoviesData());
      }
    } else {
      if (controllersFromMostCommentedSection.length) {
        controllersFromMostCommentedSection.forEach((item, index, arr) => {
          item.removeElements();
          arr.splice(index, 1);
        });
      }
      removeIt(this._elements.extraSections[MOST_COMMENTED_SECTION_HEADING_TEXT]);
    }
  }
  _outputFilmParts() {
    for (let steps = FILMS_PART_FOR_RENDER_ON_PAGE; steps !== 0; steps--) {
      const index = this._filmsInThePage;
      const thisFilmData = this.moviesModel.getMovieDataByIndex(index);
      const controller = new MovieController(this._elements.moviesContainer, this._onDataChange, this._onViewChange);
      this._controllers.mainSection.push(controller);
      controller.render(thisFilmData);
      this._filmsInThePage++;
      if (this._filmsInThePage === this.moviesModel.getMoviesAmount()) {
        removeIt(this._elements.showMoreBtn);
        break;
      }
    }
  }
}
