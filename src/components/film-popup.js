import AbstractSmartComponent from './abstract-smart-component.js';
import {formatDate} from '../utils/utils.js';
import {getFilmDuration} from '../utils/utils.js';
import moment from 'moment';
import he from 'he';

const RELEASE_DATE_FORMAT = `D MMMM YYYY`;
const MAX_NEW_COMMENT_LENGTH = 140;
const COMMENT_CUT_START_INDEX = 139;
const SECONDS_IN_MINUTES = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTES * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;
const NO_VALID_COMMENT_INPUT_CLS = `film-details__comment-input--no-valid`;
const SHAKE_ANIMATION_CLS = `shake`;
const CommentDeleteBtnText = {
  STANDART: `Delete`,
  DELETING: `Deleting…`
};
const EventKey = {
  CTRL: `Control`,
  COMMAND: `Meta`,
  ENTER: `Enter`,
  ESCAPE: `Escape`
};
const Reaction = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`
};
const ReactionImageSrc = {
  SLEEPING: `/images/emoji/sleeping.png`,
  PUKE: `/images/emoji/puke.png`,
  ANGRY: `/images/emoji/angry.png`,
  SMILE: `/images/emoji/smile.png`
};
const CreateTime = {
  NOW: `now`,
  A_MINUTE_AGO: `a minute ago`,
  A_FEW_MINUTES_AGO: `a few minutes ago`,
  A_HOUR_AGO: `a hour ago`,
  A_FEW_HOURS_AGO: `a few hours ago`,
  A_DAY_AGO: `a day ago`,
  A_TWO_DAYS_AGO: `a two days ago`
};

const addUserRating = (isAlready, userRatingValue) => {
  return (isAlready && userRatingValue) ? `<p class="film-details__user-rating">Your rate ${userRatingValue}</p>` : ``;
};
const getCommentReactionImageSrc = (emotion) => {
  let reactionImageSrc = null;
  switch (emotion) {
    case Reaction.SLEEPING:
      reactionImageSrc = ReactionImageSrc.SLEEPING;
      break;
    case Reaction.PUKE:
      reactionImageSrc = ReactionImageSrc.PUKE;
      break;
    case Reaction.ANGRY:
      reactionImageSrc = ReactionImageSrc.ANGRY;
      break;
    case Reaction.SMILE:
      reactionImageSrc = ReactionImageSrc.SMILE;
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
  }
  return `<span class="film-details__genre">${genreName}</span>`;
};
const addReactionSection = (isAlready, posterSrc, filmTitle) => {
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
  }
  return ``;
};
const getCommentCreateTime = (date) => {
  const secondsElapsed = moment().diff(date, `seconds`, false);
  if (secondsElapsed < SECONDS_IN_MINUTES) {
    return CreateTime.NOW;
  } else if (secondsElapsed >= SECONDS_IN_MINUTES && secondsElapsed <= SECONDS_IN_MINUTES * 3) {
    return CreateTime.A_MINUTE_AGO;
  } else if (secondsElapsed > SECONDS_IN_MINUTES * 3 && secondsElapsed <= SECONDS_IN_MINUTES * 59) {
    return CreateTime.A_FEW_MINUTES_AGO;
  } else if (secondsElapsed >= SECONDS_IN_HOUR && secondsElapsed < SECONDS_IN_HOUR * 2) {
    return CreateTime.A_HOUR_AGO;
  } else if (secondsElapsed >= SECONDS_IN_HOUR * 2 && secondsElapsed < SECONDS_IN_DAY) {
    return CreateTime.A_FEW_HOURS_AGO;
  } else if (secondsElapsed >= SECONDS_IN_DAY && secondsElapsed < SECONDS_IN_DAY * 2) {
    return CreateTime.A_DAY_AGO;
  } else if (secondsElapsed >= SECONDS_IN_DAY * 2 && secondsElapsed <= SECONDS_IN_DAY * 3) {
    return CreateTime.A_TWO_DAYS_AGO;
  }
  return moment(date).fromNow();
};
const addComments = (commentsFromData) => {
  let commentsList = ``;
  if (commentsFromData.length) {
    for (const commentItem of commentsFromData) {
      commentsList += `
            <li class="film-details__comment">
                <span class="film-details__comment-emoji">
                    <img src="${getCommentReactionImageSrc(commentItem.emotion)}" width="55" height="55" alt="emoji">
                </span>
                <div>
                    <p class="film-details__comment-text">${he.encode(commentItem.comment)}</p>
                    <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${commentItem.author}</span>
                    <span class="film-details__comment-day">${getCommentCreateTime(commentItem.date)}</span>
                    <button class="film-details__comment-delete" data-id="${commentItem.id}">Delete</button>
                    </p>
                </div>
            </li>`;
    }
  }
  return commentsList;
};
const setState = (parameter) => {
  return (parameter) ? `checked` : ``;
};

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
                    ${addUserRating(isAlready, userRatingValue)}
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
            <input type="checkbox" data-status="isInWatchlist" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${setState(isInWatchlist)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" data-status="isAlready" class="film-details__control-input visually-hidden" id="watched" name="watched" ${setState(isAlready)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" data-status="isFavorites" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${setState(isFavorites)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
            </section>
        </div>

        ${addReactionSection(isAlready, posterSrc, filmTitle)}

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
    this.data = data;
    this._escapeBtnHandler = this._escapeBtnHandler.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this._firstBtnHandlerForSendComment = this._firstBtnHandlerForSendComment.bind(this);
    this._secondBtnHandlerForSendComment = this._secondBtnHandlerForSendComment.bind(this);
    this._removeFirstBtnKey = this._removeFirstBtnKey.bind(this);
    this.onUserRatingUpdateError = this.onUserRatingUpdateError.bind(this);
    this.onCommentSendError = this.onCommentSendError.bind(this);
    this.onCommentDeleteError = this.onCommentDeleteError.bind(this);
    this.enabledChangeStatusBtns = this.enabledChangeStatusBtns.bind(this);
  }
  getTemplate() {
    return getFilmPopup(this.data);
  }
  setAddNewCommentCallback(callback) {
    this.addNewComment = callback;
  }
  closePopup() {
    this.getElement().remove();
    this.removeElement();
    this._removeHandlers();
  }
  setCloseHandlers() {
    const closeBtn = this.getElement().querySelector(`.film-details__close-btn`);
    closeBtn.addEventListener(`click`, this.closePopup);
    window.addEventListener(`keydown`, this._escapeBtnHandler);
  }
  enabledChangeStatusBtns() {
    for (const item of this._getStatusControlItems()) {
      item.removeAttribute(`disabled`);
    }
  }
  setChangeStatusCallbacks(callback) {
    this.changeStatusCallback = callback;
    for (const item of this._getStatusControlItems()) {
      item.addEventListener(`click`, (event) => {
        event.preventDefault();
        const dataProperty = event.target.dataset.status;
        for (const controlItem of this._getStatusControlItems()) {
          controlItem.setAttribute(`disabled`, true);
        }
        callback(dataProperty);
      });
    }
  }
  onUserRatingUpdateError() {
    this.userRatingBlock = this.getElement().querySelector(`.film-details__user-rating-score`);
    if (!this.userRatingBlock.classList.contains(SHAKE_ANIMATION_CLS)) {
      this.userRatingBlock.classList.add(SHAKE_ANIMATION_CLS);
    } else {
      this.userRatingBlock.classList.remove(SHAKE_ANIMATION_CLS);
      setTimeout(() => {
        this.userRatingBlock.classList.add(SHAKE_ANIMATION_CLS);
      }, 0);
    }
    for (const btn of this._getUserRatingInputs()) {
      btn.removeAttribute(`disabled`);
      btn.checked = false;
    }
  }
  setUserRatingChangeCallbacks(callback) {
    this._changeUserRatingCallback = callback;
    if (this.data.isAlready) {
      for (const radioBtn of this._getUserRatingInputs()) {
        radioBtn.addEventListener(`change`, (event) => {
          const currentUserRating = +(event.target.value);
          event.target.classList.add(`selected`);
          for (const btn of this._getUserRatingInputs()) {
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
    this._changeUserRatingCallback = callback;
    if (this.data.isAlready) {
      const resetUserRatingBtn = this.getElement().querySelector(`.film-details__watched-reset`);
      resetUserRatingBtn.addEventListener(`click`, () => {
        for (const btn of this._getUserRatingInputs()) {
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
    const reactionRadioBtns = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    for (const radio of reactionRadioBtns) {
      radio.addEventListener(`change`, (event) => {
        this._selectedReactionId = event.target.getAttribute(`id`);
        const selectedReactionLabel = this.getElement().querySelector(`label[for="${this._selectedReactionId}"]`);
        const emojiPictureSrc = selectedReactionLabel.querySelector(`img`).getAttribute(`src`);
        reactionEmojiContainer.innerHTML = `<img src="${emojiPictureSrc}" width="55" height="55" alt="emoji">`;
      });
    }
  }
  onCommentSendError() {
    this._newCommentBlock = this.getElement().querySelector(`.film-details__new-comment`);
    if (!this._newCommentBlock.classList.contains(SHAKE_ANIMATION_CLS)) {
      this._newCommentBlock.classList.add(SHAKE_ANIMATION_CLS);
    } else {
      this._newCommentBlock.classList.remove(SHAKE_ANIMATION_CLS);
      setTimeout(() => {
        this._newCommentBlock.classList.add(SHAKE_ANIMATION_CLS);
      }, 0);
    }
    const newCommentInput = this._getCommentInput();
    newCommentInput.removeAttribute(`disabled`);
    newCommentInput.classList.add(NO_VALID_COMMENT_INPUT_CLS);
  }
  sendNewComment() {
    window.addEventListener(`keydown`, this._firstBtnHandlerForSendComment);
  }
  setCurrentUserRating() {
    if (this.data.isAlready && this.data.userRatingValue) {
      const ratingLevelRadioBtns = this._getUserRatingInputs();
      for (const radioBtn of ratingLevelRadioBtns) {
        if (+radioBtn.value === this.data.userRatingValue) {
          radioBtn.checked = true;
          return;
        }
      }
    }
  }
  getRemoveCommentBtn() {
    return this.getElement().querySelectorAll(`.film-details__comment-delete`);
  }
  onCommentDeleteError() {
    const noDeletingCommentRemoveBtn = this.getElement().querySelector(`.film-details__comment-delete[data-id="${this.commentId}"]`);
    noDeletingCommentRemoveBtn.innerText = `${CommentDeleteBtnText.STANDART}`;
    noDeletingCommentRemoveBtn.removeAttribute(`disabled`);
  }
  setRemoveCommentCallbacks(callback) {
    this._commentRemoveCallback = callback;
    const removeCommentBtns = this.getRemoveCommentBtn();
    removeCommentBtns.forEach((btn) => {
      btn.addEventListener(`click`, (event) => {
        event.preventDefault();
        event.target.innerText = `${CommentDeleteBtnText.DELETING}`;
        event.target.setAttribute(`disabled`, true);
        const commentId = event.target.getAttribute(`data-id`);
        callback(commentId);
      });
    });
  }
  recoveryListeners() {
    this._removeReaction();
    this.setCurrentUserRating();
    this.setRemoveCommentCallbacks(this._commentRemoveCallback);
    this.setCloseHandlers();
    this.setUserRatingChangeCallbacks(this._changeUserRatingCallback);
    this.setUserRatingResetCallback(this._changeUserRatingCallback);
    this.setChangeStatusCallbacks(this.changeStatusCallback);
    this.sendNewComment();
    this.onSelectReaction();
  }
  _removeReaction() {
    if (this._selectedReactionId) {
      this._selectedReactionId = null;
    }
  }
  _createNewComment() {
    const newCommentInput = this._getCommentInput();
    if (newCommentInput.classList.contains(NO_VALID_COMMENT_INPUT_CLS)) {
      newCommentInput.classList.remove(NO_VALID_COMMENT_INPUT_CLS);
    }
    if (this._selectedReactionId && this._getNewCommentText() && !newCommentInput.hasAttribute(`disabled`)) {
      newCommentInput.setAttribute(`disabled`, true);
      const newCommentData = JSON.stringify({
        emotion: this._getNewCommentReaction(this._selectedReactionId),
        comment: this._getNewCommentText(),
        date: moment().toISOString()
      });
      this.addNewComment(newCommentData);
    }
  }
  _removeHandlers() {
    window.removeEventListener(`keydown`, this._escapeBtnHandler);
    window.removeEventListener(`keydown`, this._firstBtnHandlerForSendComment);
    window.removeEventListener(`keydown`, this._secondBtnHandlerForSendComment);
    window.removeEventListener(`keyup`, this._removeFirstBtnKey);
  }
  _getStatusControlItems() {
    return this.getElement().querySelectorAll(`.film-details__control-input`);
  }
  _getUserRatingInputs() {
    return this.getElement().querySelectorAll(`.film-details__user-rating-input`);
  }
  _getCommentInput() {
    return this.getElement().querySelector(`.film-details__comment-input`);
  }
  _getNewCommentText() {
    this._newCommentText = he.encode(this._getCommentInput().value);
    if (this._newCommentText !== ``) {
      if (this._newCommentText.length > MAX_NEW_COMMENT_LENGTH) {
        this._newCommentText = `${this._newCommentText.substr(0, COMMENT_CUT_START_INDEX)}...`;
      }
      return this._newCommentText;
    }
    return false;
  }
  _getNewCommentReaction(reactionId) {
    let reaction = null;
    switch (reactionId) {
      case `emoji-smile`:
        reaction = Reaction.SMILE;
        break;
      case `emoji-sleeping`:
        reaction = Reaction.SLEEPING;
        break;
      case `emoji-gpuke`:
        reaction = Reaction.PUKE;
        break;
      case `emoji-angry`:
        reaction = Reaction.ANGRY;
        break;
    }
    return reaction;
  }
  _escapeBtnHandler(event) {
    if (event.key === EventKey.ESCAPE) {
      this.getElement().remove();
      this.removeElement();
      this._removeHandlers();
    }
  }
  _removeFirstBtnKey(event) {
    if (event.key === this._firstBtnKeyForCommentSend) {
      this._firstBtnKeyForCommentSend = null;
    }
  }
  _secondBtnHandlerForSendComment(event) {
    if (event.key === EventKey.ENTER) {
      event.preventDefault();
      if (this._firstBtnKeyForCommentSend) {
        this._createNewComment();
      }
    }
  }
  _firstBtnHandlerForSendComment(event) {
    if (event.key === EventKey.CTRL || event.key === EventKey.COMMAND) {
      this._firstBtnKeyForCommentSend = event.key;
      window.addEventListener(`keyup`, this._removeFirstBtnKey);
      window.addEventListener(`keydown`, this._secondBtnHandlerForSendComment);
    }
  }
}
