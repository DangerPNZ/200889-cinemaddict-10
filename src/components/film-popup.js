import AbstractSmartComponent from './abstract-smart-component.js';

const getFilmPopup = (filmData) => {
  const {
    posterSrc,
    filmTitle,
    ageLimit,
    ratingVal,
    directorName,
    writers,
    actors,
    releaseDate,
    filmDuration,
    countryOfOrigin,
    genre,
    genres,
    description,
    isAlready,
    userRatingValue,
    isInWatchlist,
    isFavorites,
    comments
  } = filmData;
  const addUserRating = () => {
    if (isAlready && userRatingValue) { // && userRatingValue
      return `<p class="film-details__user-rating">Your rate ${userRatingValue}</p>`;
    } else {
      return ``;
    }
  };
  const addGenres = (genreName, genresItems) => {
    if (genresItems.length) {
      let genresList = ``;
      for (let genresItem of genresItems) {
        genresList += `<span class="film-details__genre">${genresItem} </span>`;
      }
      return genresList;
    } else {
      return `<span class="film-details__genre">${genreName}</span>`;
    }
  };
  const addReactionSection = () => {
    if (isAlready) {
      return `
          <div class="form-details__middle-container">
            <section class="film-details__user-rating-wrap">
              <div class="film-details__user-rating-controls">
                <button class="film-details__watched-reset" type="button">Undo</button>
              </div>
    
              <div class="film-details__user-score">
                <div class="film-details__user-rating-poster">
                    <img src="${posterSrc}" alt="film-poster" class="film-details__user-rating-img">
                </div>
    
                <section class="film-details__user-rating-inner">
                    <h3 class="film-details__user-rating-title">${filmTitle}</h3>
    
                    <p class="film-details__user-rating-feelings">How you feel it?</p>
    
                    <div class="film-details__user-rating-score">
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
                    <label class="film-details__user-rating-label" for="rating-1">1</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
                    <label class="film-details__user-rating-label" for="rating-2">2</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
                    <label class="film-details__user-rating-label" for="rating-3">3</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
                    <label class="film-details__user-rating-label" for="rating-4">4</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
                    <label class="film-details__user-rating-label" for="rating-5">5</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
                    <label class="film-details__user-rating-label" for="rating-6">6</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
                    <label class="film-details__user-rating-label" for="rating-7">7</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
                    <label class="film-details__user-rating-label" for="rating-8">8</label>
    
                    <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9">
                    <label class="film-details__user-rating-label" for="rating-9">9</label>
    
                    </div>
                </section>
              </div>
            </section>
          </div>`;
    } else {
      return ``;
    }
  };
  const addComments = (commentsFromData) => {
    let commentsList = ``;
    if (commentsFromData.length) {
      for (let commentsItem of commentsFromData) {
        commentsList += `
              <li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                      <img src="./images/emoji/${commentsItem.emojiPictureSrc}" width="55" height="55" alt="emoji">
                  </span>
                  <div>
                      <p class="film-details__comment-text">${commentsItem.commentText}</p>
                      <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${commentsItem.commentAuthor}</span>
                      <span class="film-details__comment-day">${commentsItem.commentDate}</span>
                      <button class="film-details__comment-delete">Delete</button>
                      </p>
                  </div>
              </li>`;
      }
    }
    return commentsList;
  };
  const setState = (parameter) => {
    if (parameter) {
      return `checked`;
    } else {
      return ``;
    }
  };
  return `
    <section class="film-details">
        <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
            <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
            <div class="film-details__poster">
                <img class="film-details__poster-img" src="${posterSrc}" alt="${`${filmTitle} movie poster`}">

                <p class="film-details__age">${ageLimit}</p>
            </div>

            <div class="film-details__info">
                <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${filmTitle}</h3>
                    <p class="film-details__title-original">Original: ${filmTitle}</p>
                </div>

                <div class="film-details__rating">
                    <p class="film-details__total-rating">${ratingVal}</p>
                    ${addUserRating()}
                </div>
                </div>

                <table class="film-details__table">
                <tr class="film-details__row">
                    <td class="film-details__term">Director</td>
                    <td class="film-details__cell">${directorName}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Writers</td>
                    <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Actors</td>
                    <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Release Date</td>
                    <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${filmDuration}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Country</td>
                    <td class="film-details__cell">${countryOfOrigin}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Genres</td>
                    <td class="film-details__cell">
                        ${addGenres(genre, genres)}
                    </td>
                </tr>
                </table>

                <p class="film-details__film-description">
                  ${description}
                </p>
            </div>
            </div>

            <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${setState(isInWatchlist)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${setState(isAlready)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${setState(isFavorites)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
        </div>

        ${addReactionSection()}

        <div class="form-details__bottom-container">
            <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
                ${addComments(comments)}
            </ul>

            <div class="film-details__new-comment">
                <div for="add-emoji" class="film-details__add-emoji-label"></div>

                <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                </label>

                <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-smile">
                    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
                </div>
            </div>
            </section>
        </div>
        </form>
    </section>`;
};

export default class FilmPopup extends AbstractSmartComponent {
  constructor(data) {
    super();
    this._data = data;
    this.escapeBtnHandler = this.escapeBtnHandler.bind(this);
  }
  getTemplate() {
    return getFilmPopup(this._data);
  }
  getStatusControlItems() {
    return [...this.getElement().querySelectorAll(`.film-details__control-label`)];
  }
  closeBtnHandler() {
    this.getElement().remove();
    this.removeElement();
    window.removeEventListener(`keydown`, this.escapeBtnHandler);
  }
  escapeBtnHandler(event) {
    const ESCAPE_KEY_CODE = 27;
    if (event.keyCode === ESCAPE_KEY_CODE) {
      this.getElement().remove();
      this.removeElement();
      window.removeEventListener(`keydown`, this.escapeBtnHandler);
    }
  }
  setCloseHandlers() {
    const closeBtn = this.getElement().querySelector(`.film-details__close-btn`);
    closeBtn.addEventListener(`click`, this.closeBtnHandler.bind(this));
    window.addEventListener(`keydown`, this.escapeBtnHandler);
  }
  setChangeStatusHandler(handler) {
    this.changeStatusHandler = handler;
    const statusControlItems = [...this.getElement().querySelectorAll(`.film-details__control-label`)];
    for (const btn of statusControlItems) {
      btn.addEventListener(`click`, (event) => {
        event.preventDefault();
        const dataProperty = event.target.dataset.status;
        handler(dataProperty);
      });
    }
  }
  setUserRatingChangeHandler() {
    if (this._data.isAlready) {
      const ratingLevelRadioBtns = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
      for (const radioBtn of ratingLevelRadioBtns) {
        radioBtn.addEventListener(`change`, (event) => {
          const currentUserRating = event.target.value;
          this._data.userRatingValue = currentUserRating;
          this.onDataChange(this, this._data);
        });
      }
    }
  }
  setSelectReactionHandler() {
    const reactionEmojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const reactionLabels = this.getElement().querySelectorAll(`.film-details__emoji-label`);
    for (const label of reactionLabels) {
      label.addEventListener(`click`, (event) => {
        const emojiPictureSrc = event.currentTarget.querySelector(`img`).getAttribute(`src`);
        reactionEmojiContainer.innerHTML = `<img src="${emojiPictureSrc}" width="55" height="55" alt="emoji">`;
      });
    }
  }
  recoveryListeners() {
    this.setCloseHandlers();
    this.setUserRatingChangeHandler();
    this.setSelectReactionHandler();
    this.setChangeStatusHandler(this.changeStatusHandler);
  }
}
// import moment from 'moment';
// console.log(moment().format(`D MMMM YYYY`));
