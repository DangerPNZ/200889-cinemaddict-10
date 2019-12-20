import {createFilmsDataList} from './components/films-data-list.js';
import PageController from './controllers/page-controller.js';
import Movies from './models/movies.js';

const CREATED_MOCS_FILMS_DATA_LENGTH = 12;
const filmsData = createFilmsDataList(CREATED_MOCS_FILMS_DATA_LENGTH);
const moviesModel = new Movies(filmsData);
new PageController(document.body, moviesModel).render();
