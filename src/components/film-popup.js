import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate} from './utils.js';
import {getFilmDuration} from './utils.js';
import moment from 'moment';
import he from 'he';

const RELEASE_DATE_FORMAT = `D MMMM YYYY`;
const COMMENT_DATE_FORMAT = `YYYY/MM/DD HH:MM`;
const MAX_NEW_COMMENT_LENGTH = 140;
const COMMENT_CUT_START_INDEX = 139;
const CTRL_EVENT_KEY = `Control`;
const COMMAND_EVENT_KEY = `Meta`;
const ENTER_EVENT_KEY = `Enter`;
const getFilmPopup = (filmData) => {
  const {
    posterSrc,
    filmTitle,
    originalTitle,
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
    if (isAlready && userRatingValue) {
      return `<p class="film-details__user-rating">Your rate ${userRatingValue}</p>`;
    } else {
      return ``;
    }
  };
  const SLEEPING_REACTION_IMAGE_SRC = `/images/emoji/sleeping.png`;
  const PUKE_REACTION_IMAGE_SRC = `/images/emoji/puke.png`;
  const ANGRY_REACTION_IMAGE_SRC = `/images/emoji/angry.png`;
  const SMILE_REACTION_IMAGE_SRC = `/images/emoji/smile.png`;
  const getCommentReactionImageSrc = (emotion) => {
    let reactionImageSrc = null;
    switch (emotion) {
      case `sleeping`:
        reactionImageSrc = SLEEPING_REACTION_IMAGE_SRC;
        break;
      case `puke`:
        reactionImageSrc = PUKE_REACTION_IMAGE_SRC;
        break;
      case `angry`:
        reactionImageSrc = ANGRY_REACTION_IMAGE_SRC;
        break;
      case `smile`:
        reactionImageSrc = SMILE_REACTION_IMAGE_SRC;
        break;
    }
    return reactionImageSrc;
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
      for (let commentItem of commentsFromData) {
        commentsList += `
              <li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                      <img src="${getCommentReactionImageSrc(commentItem.emotion)}" width="55" height="55" alt="emoji">
                  </span>
                  <div>
                      <p class="film-details__comment-text">${he.encode(commentItem.comment)}</p>
                      <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${commentItem.author}</span>
                      <span class="film-details__comment-day">${moment(commentItem.date).format(COMMENT_DATE_FORMAT)}</span>
                      <button class="film-details__comment-delete" data-id="${commentItem.id}">Delete</button>
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
  const addFeedbackStyles = () => `
    <style>
      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        10%,
        30%,
        50%,
        70%,
        90% {
          transform: translateX(-5px);
        }
        20%,
        40%,
        60%,
        80% {
          transform: translateX(5px);
        }
      }
      .shake {
        animation: shake 0.6s;
      }
      .selected:checked + .film-details__user-rating-label {
        background-color: #d8d8d8;
      }
      .shake .selected + .film-details__user-rating-label {
        background-color: #f51a1a;
      }
      .film-details__comment-input--no-valid {
        border-color: #f51a1a;
      }
    </style>
  `;
  return `
    <section class="film-details">
        ${addFeedbackStyles()}
        <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
            <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
            </div>
            <div class="film-details__info-wrap">
            <div class="film-details__poster">
                <img class="film-details__poster-img" src="${posterSrc}" alt="${`${filmTitle} movie poster`}">

                <p class="film-details__age">${ageLimit}+</p>
            </div>

            <div class="film-details__info">
                <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                    <h3 class="film-details__title">${filmTitle}</h3>
                    <p class="film-details__title-original">Original: ${originalTitle}</p>
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
                    <td class="film-details__cell">${formatDate(releaseDate, RELEASE_DATE_FORMAT)}</td>
                </tr>
                <tr class="film-details__row">
                    <td class="film-details__term">Runtime</td>
                    <td class="film-details__cell">${getFilmDuration(filmDuration)}</td>
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
            <label data-status="isInWatchlist" for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${setState(isAlready)}>
            <label data-status="isAlready" for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${setState(isFavorites)}>
            <label data-status="isFavorites" for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
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
const NO_VALID_COMMENT_INPUT_CLS = `film-details__comment-input--no-valid`;
const SHAKE_ANIMATION_CLS = `shake`;


export default class FilmPopup extends AbstractSmartComponent {
  constructor(data) {
    super();
    this.data = data;
    this.escapeBtnHandler = this.escapeBtnHandler.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.firstBtnHandlerForSendComment = this.firstBtnHandlerForSendComment.bind(this);
    this.secondBtnHandlerForSendComment = this.secondBtnHandlerForSendComment.bind(this);
    this.removeSecondBtnHandler = this.removeSecondBtnHandler.bind(this);
    this.onUserRatingUpdateError = this.onUserRatingUpdateError.bind(this);
    this.onCommentSendError = this.onCommentSendError.bind(this);
  }
  getTemplate() {
    return getFilmPopup(this.data);
  }
  getStatusControlItems() {
    return [...this.getElement().querySelectorAll(`.film-details__control-label`)];
  }
  removeReaction() {
    if (this.selectedReactionId) {
      this.selectedReactionId = null;
    }
  }
  closePopup() {
    this.getElement().remove();
    this.removeElement();
    window.removeEventListener(`keydown`, this.escapeBtnHandler);
    window.removeEventListener(`keydown`, this.firstBtnHandlerForSendComment);
    window.removeEventListener(`keyup`, this.removeSecondBtnHandler);
  }
  escapeBtnHandler(event) {
    const ESCAPE_KEY_CODE = 27;
    if (event.keyCode === ESCAPE_KEY_CODE) {
      this.getElement().remove();
      this.removeElement();
      window.removeEventListener(`keydown`, this.escapeBtnHandler);
      window.removeEventListener(`keydown`, this.firstBtnHandlerForSendComment);
      window.removeEventListener(`keyup`, this.removeSecondBtnHandler);
    }
  }
  setCloseHandlers() {
    const closeBtn = this.getElement().querySelector(`.film-details__close-btn`);
    closeBtn.addEventListener(`click`, this.closePopup);
    window.addEventListener(`keydown`, this.escapeBtnHandler);
  }
  setChangeStatusCallbacks(callback) {
    this.changeStatusCallback = callback;
    const statusControlItems = [...this.getElement().querySelectorAll(`.film-details__control-label`)];
    for (const btn of statusControlItems) {
      btn.addEventListener(`click`, (event) => {
        event.preventDefault();
        const dataProperty = event.target.dataset.status;
        callback(dataProperty);
      });
    }
  }
  getUserRatingInputs() {
    return this.getElement().querySelectorAll(`.film-details__user-rating-input`);
  }
  onUserRatingUpdateError() {
    if (!this.userRatingBlock) {
      this.userRatingBlock = this.getElement().querySelector(`.film-details__user-rating-score`);
    }
    if (!this.userRatingBlock.classList.contains(SHAKE_ANIMATION_CLS)) {
      this.userRatingBlock.classList.add(SHAKE_ANIMATION_CLS);
    } else {
      this.userRatingBlock.classList.remove(SHAKE_ANIMATION_CLS);
      setInterval(() => {
        this.userRatingBlock.classList.add(SHAKE_ANIMATION_CLS);
      }, 0);
    }
    for (const btn of this.getUserRatingInputs()) {
      btn.removeAttribute(`disabled`);
      btn.checked = false;
    }
  }
  setUserRatingChangeCallbacks(callback) {
    this.changeUserRatingCallback = callback;
    if (this.data.isAlready) {
      for (const radioBtn of this.getUserRatingInputs()) {
        radioBtn.addEventListener(`change`, (event) => {
          const currentUserRating = +(event.target.value);
          event.target.classList.add(`selected`);
          for (const btn of this.getUserRatingInputs()) {
            btn.setAttribute(`disabled`, true);
            btn.classList.remove(`selected`);
          }
          event.target.classList.add(`selected`);
          callback(currentUserRating);
        });
      }
    }
  }
  setUserRatingResetCallback(callback) {
    this.changeUserRatingCallback = callback;
    if (this.data.isAlready) {
      const resetUserRatingBtn = this.getElement().querySelector(`.film-details__watched-reset`);
      resetUserRatingBtn.addEventListener(`click`, () => {
        for (const btn of this.getUserRatingInputs()) {
          btn.setAttribute(`disabled`, true);
          if (btn.checked === true) {
            btn.classList.add(`selected`);
          }
        }
        callback();
      });
    }
  }
  onSelectReaction() {
    const reactionEmojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const reactionLabels = this.getElement().querySelectorAll(`.film-details__emoji-label`);
    const reactionRadioBtns = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    for (const label of reactionLabels) {
      label.addEventListener(`click`, (event) => {
        const emojiPictureSrc = event.currentTarget.querySelector(`img`).getAttribute(`src`);
        reactionEmojiContainer.innerHTML = `<img src="${emojiPictureSrc}" width="55" height="55" alt="emoji">`;
      });
    }
    for (const radio of reactionRadioBtns) {
      radio.addEventListener(`change`, (event) => {
        this.selectedReactionId = event.target.getAttribute(`id`);
      });
    }
  }
  getCommentInput() {
    return this.getElement().querySelector(`.film-details__comment-input`);
  }
  getNewCommentText() {
    this.newCommentText = he.encode(this.getCommentInput().value);
    if (this.newCommentText !== ``) {
      if (this.newCommentText.length > MAX_NEW_COMMENT_LENGTH) {
        this.newCommentText = `${this.newCommentText.substr(0, COMMENT_CUT_START_INDEX)}...`;
      }
      return this.newCommentText;
    } else {
      return false;
    }
  }
  getNewCommentReaction(reactionId) {
    let reaction = null;
    switch (reactionId) {
      case `emoji-smile`:
        reaction = `smile`;
        break;
      case `emoji-sleeping`:
        reaction = `sleeping`;
        break;
      case `emoji-gpuke`:
        reaction = `puke`;
        break;
      case `emoji-angry`:
        reaction = `angry`;
        break;
    }
    return reaction;
  }
  getCommentInput() {
    if (!this.commentInput) {
      this.commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    }
    return this.commentInput;
  }
  onCommentSendError() {
    if (!this.newCommentBlock) {
      this.newCommentBlock = this.getElement().querySelector(`.film-details__new-comment`);
    }
    if (!this.newCommentBlock.classList.contains(SHAKE_ANIMATION_CLS)) {
      this.newCommentBlock.classList.add(SHAKE_ANIMATION_CLS);
    } else {
      this.newCommentBlock.classList.remove(SHAKE_ANIMATION_CLS);
      setInterval(() => {
        this.newCommentBlock.classList.add(SHAKE_ANIMATION_CLS);
      }, 0);
    }
    const newCommentInput = this.getCommentInput();
    newCommentInput.removeAttribute(`disabled`);
    newCommentInput.classList.add(NO_VALID_COMMENT_INPUT_CLS);
  }
  createNewComment() {
    const newCommentInput = this.getCommentInput();
    if (newCommentInput.classList.contains(NO_VALID_COMMENT_INPUT_CLS)) {
      newCommentInput.classList.remove(NO_VALID_COMMENT_INPUT_CLS);
    }
    if (this.selectedReactionId && this.getNewCommentText() && !newCommentInput.hasAttribute(`disabled`)) {
      newCommentInput.setAttribute(`disabled`, true);
      const newCommentData = JSON.stringify({
        emotion: this.getNewCommentReaction(this.selectedReactionId),
        comment: this.getNewCommentText(),
        date: moment().toISOString()
      });
      this.addNewComment(newCommentData);
    }
  }
  removeSecondBtnHandler(event) {
    if (event.key === this.firstBtnKeyForCommentSend) {
      window.removeEventListener(`keydown`, this.secondBtnHandlerForSendComment);
    }
  }
  secondBtnHandlerForSendComment(event) {
    if (event.key === ENTER_EVENT_KEY) {
      this.createNewComment();
    }
  }
  firstBtnHandlerForSendComment(event) {
    if (event.key === CTRL_EVENT_KEY || event.key === COMMAND_EVENT_KEY) {
      this.firstBtnKeyForCommentSend = event.key;
      window.addEventListener(`keydown`, this.secondBtnHandlerForSendComment);
      window.addEventListener(`keyup`, this.removeSecondBtnHandler);
    }
  }
  sendNewComment() {
    window.addEventListener(`keydown`, this.firstBtnHandlerForSendComment);
  }
  setCurrentUserRating() {
    if (this.data.isAlready && this.data.userRatingValue) {
      const ratingLevelRadioBtns = this.getUserRatingInputs();
      for (const radioBtn of ratingLevelRadioBtns) {
        if (+radioBtn.value === +this.data.userRatingValue) {
          radioBtn.checked = true;
          return;
        }
      }
    }
  }
  setRemoveCommentCallbacks(callback) {
    this.commentRemoveCallback = callback;
    const removeCommentBtns = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    removeCommentBtns.forEach((btn) => {
      btn.addEventListener(`click`, (event) => {
        event.preventDefault();
        const commentId = event.target.getAttribute(`data-id`);
        callback(commentId);
      });
    });
  }
  recoveryListeners() {
    this.removeReaction();
    this.setCurrentUserRating();
    this.setRemoveCommentCallbacks(this.commentRemoveCallback);
    this.setCloseHandlers();
    this.setUserRatingChangeCallbacks(this.changeUserRatingCallback);
    this.setUserRatingResetCallback(this.changeUserRatingCallback);
    this.onSelectReaction();
    this.setChangeStatusCallbacks(this.changeStatusCallback);
  }
}
