
import PageController from './controllers/page-controller.js';
import Movies from './models/movies.js';

new PageController(document.body, new Movies()).render();
