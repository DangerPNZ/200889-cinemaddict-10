import PageController from './components/page-controller';
import {createFilmsDataList} from './components/films-data-list.js';

const totalFilmsData = createFilmsDataList(12); // []; для проверки заглушки
new PageController(`<div class="films-list__container"></div>`).render(totalFilmsData);
