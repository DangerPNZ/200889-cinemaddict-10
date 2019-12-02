import {getRandomNum} from '../methods/random-num';
let randomText = `It was possible that this would kill the project. 
After all, if it was such a great idea, why wouldn't Malcolm's company offer on it? 
I was afraid that if Steve had any doubts whatsoever, this decision would confirm and magnify them. 
But one of the reasons why Steve and I have worked so well together for so long is that parts of us 
are still boys who want to have fun despite what the "grown-ups" say. We were going to do it! 
We had something special and we knew it. So I offered the rights to publish the serial in the United 
States and the United Kingdom to Penguin, Signet's parent company. With HarperCollins no longer in play, 
it made sense to reverse the deal and start with Steve's U.S. publisher. The Penguin people were in a tizzy. 
They knew that HarperCollins had gotten a shot at this even before they were aware of it. It was the only 
time Stephen King had allowed that to happen during his more than fifteen-year exclusive relationship with 
Signet. As anxious as they were to make a deal, they didn't have a clue as to what they were buying. 
We had already established that there would be no hardcover. The novel was not only unfinished, but it 
would be published as it was being written. It was difficult for them to assess the value of this project. 
I made it as simple as possible so in the event of a failure, we could all pull back the rights and lick 
our wounds. We accepted less than the usual advance Penguin paid for a King novel, but we retained more 
than the usual rights; we exercised control in many areas normally reserved by the publisher; and we 
licensed them the rights only for a short period of time. This would be an experiment in publishing and 
I wanted to protect my client as well as I could.`;
const months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
const randomNames = [`Sofia Black D'Elia`, `Jake Cannavale`, `Pete Davidson`, `Seychelle Gabriel`, `Elizabeth Gillies`,
  `Ariana Grande`, `Rosabell Laurenti Sellers`, `Liana Liberato`, `Ali Lohan`, `Caitlyn Taylor Love`, `Ryan Malgarini`,
  `Gia Mantegna`, `Laura Marano`, `Vanessa Marano`, `Vincent Martella`, `Chris Massoglia`, `Julianna Rose Mauriello`,
  `Jennette McCurdy`, `Mitchel Musso`, `Dylan O'Brien`, `Jansen Panettiere`, `Cassie Scerbo`, `Christian Serratos`, `Bella Thorne`];
const countries = [`USA`, `United Kingdom`, `Australia`, `Germany`, `Canada`, `Italy`, `France`];
const getWordsFromRandomText = () => {
  randomText = randomText.replace(/[^a-zA-Z ]/g, ``); // удалить все спецсимволы кроме букв и цифр
  randomText = randomText.replace(/\s+/g, ` `).trim(); // удалить множественные пробелы
  return randomText.split(` `);
};
const wordsFromRandomText = getWordsFromRandomText();
const genres = [
  `Drama`,
  `Western`,
  `Thriller`,
  `Horror`,
  `Biography`,
  `Comedy`,
  `Action`,
  `Fantastic`,
  `Catastrophe`,
  `Melodrama`
];
const emojiPictures = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`,
  `trophy.png`,
];
const postersImageNames = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];
let descriptionFull = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, 
non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus 
varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, 
condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod 
diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. 
Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const getDescriptionSentences = () => {
  descriptionFull = descriptionFull.replace(/\s+/g, ` `).trim(); // удалить множественные пробелы
  return descriptionFull.split(`. `);
};
const descriptionSentences = getDescriptionSentences();
const getFilmTitle = () => {
  const MIN_WORD_SUM = 1;
  const MAX_WORD_SUM = 4;
  const wordCount = getRandomNum(MIN_WORD_SUM, MAX_WORD_SUM);
  const titleWords = [];
  for (let i = 0; i < wordCount; i++) {
    let randomWordFromTitleWords = wordsFromRandomText[getRandomNum(0, (wordsFromRandomText.length - 1))];
    const LAST_ELEMENT_INDEX_OF_TITLE_WORDS = wordCount - 1;
    if (i === 0) {
      randomWordFromTitleWords = randomWordFromTitleWords[i].toUpperCase() + randomWordFromTitleWords.substring(1);
    }
    if (i !== LAST_ELEMENT_INDEX_OF_TITLE_WORDS) { // если слово не будет последним словом в названии фильма
      randomWordFromTitleWords = `${randomWordFromTitleWords} `; // добавим пробел
    }
    titleWords.push(randomWordFromTitleWords);
  }
  return titleWords.join(``);
};
const getRatingVal = () => {
  const MIN_RATING_VALUE = 0;
  const MAX_RATING_VALUE = 9;
  const rating = getRandomNum(MIN_RATING_VALUE, MAX_RATING_VALUE, false);
  if (rating < 1 || rating > MAX_RATING_VALUE) {
    return Math.floor(rating);
  }
  return rating;
};
const getReleaseYear = () => {
  const FIRST_CINEMA_RELEASE_YEAR = 1895;
  const CURRENT_YEAR = new Date().getFullYear();
  return getRandomNum(FIRST_CINEMA_RELEASE_YEAR, CURRENT_YEAR);
};
const getFilmDuration = () => {
  const MIN_DURATION = 0;
  const MAX_DURATION_IN_HOURS = 3;
  const MAX_DURATION_IN_MUNUTES = 59;
  const durationInHours = getRandomNum(MIN_DURATION, MAX_DURATION_IN_HOURS);
  const durationInMinutes = getRandomNum(MIN_DURATION, MAX_DURATION_IN_MUNUTES);
  const durationValues = [
    durationInHours !== 0 ? `${durationInHours}h ` : ``,
    durationInMinutes !== 0 ? `${durationInMinutes}m` : ``
  ];
  return durationValues.join(``);
};
const getGenre = () => {
  const randomGenreIndex = getRandomNum(0, (genres.length - 1));
  return genres[randomGenreIndex];
};
const getPosterSrc = () => {
  const randomPosterIndex = getRandomNum(0, (postersImageNames.length - 1));
  return `./images/posters/${postersImageNames[randomPosterIndex]}`;
};
const getDescription = () => {
  const MIN_SENTENCES_SUM = 1;
  const MAX_SENTENCES_SUM = 3;
  const sentencesSum = getRandomNum(MIN_SENTENCES_SUM, MAX_SENTENCES_SUM);
  const generatedSentences = new Set();
  let i = 0;
  while (i < sentencesSum) {
    const randomIndexOfSentences = getRandomNum(0, (MAX_SENTENCES_SUM - 1));
    if (!(generatedSentences.has(descriptionSentences[randomIndexOfSentences]))) {
      generatedSentences.add(`${descriptionSentences[randomIndexOfSentences]}. `);
      i++;
    }
  }
  return [...generatedSentences].join(``);
};
const getCommentsSum = () => {
  const MIN_COMMENTS_SUM = 0;
  const MAX_COMMENTS_SUM = 6;
  return getRandomNum(MIN_COMMENTS_SUM, MAX_COMMENTS_SUM);
};
const getAgeLimit = () => {
  const MIN_AGE_LIMIT = 0;
  const MAX_AGE_LIMIT = 18;
  return `${getRandomNum(MIN_AGE_LIMIT, MAX_AGE_LIMIT)}+`;
};
const getName = () => {
  const LAST_ELEMENT_INDEX_OF_NAMES = randomNames.length - 1;
  const randomNameIndex = getRandomNum(0, LAST_ELEMENT_INDEX_OF_NAMES);
  return randomNames[randomNameIndex];
};
const getNamesList = () => {
  const MIN_NAMES_LENGTH = 3;
  const MAX_NAMES_LENGTH = 8;
  const namesLength = getRandomNum(MIN_NAMES_LENGTH, MAX_NAMES_LENGTH);
  const names = new Set();
  let i = 0;
  while (i < namesLength) {
    const randomName = getName();
    if (!(names.has(randomName))) {
      if (i < (namesLength - 1)) {
        names.add(`${randomName}, `);
      } else {
        names.add(`${randomName}.`);
      }
      i++;
    }
  }
  return [...names].join(``);
};
const getReleaseDate = (year) => {
  const monthDay = getRandomNum(1, 31);
  const month = months[getRandomNum(1, 12)];
  return `${monthDay} ${month} ${year}`;
};
const getCountry = () => {
  const MAX_INDEX_OF_COUNTRIES = countries.length - 1;
  return countries[getRandomNum(0, MAX_INDEX_OF_COUNTRIES)];
};
const getGenresList = (genreName) => {
  const genresList = new Set();
  genresList.add(genreName);
  const MAX_INDEX_OF_GENRES = genres.length - 1;
  const GENRES_ADDITIONAL_SUM = getRandomNum(0, 2);
  let i = 0;
  while (i < GENRES_ADDITIONAL_SUM) {
    const randomGenre = genres[getRandomNum(0, MAX_INDEX_OF_GENRES)];
    if (!(genresList.has(randomGenre))) {
      genresList.add(randomGenre);
      i++;
    }
  }
  return [...genresList];
};
const getRandomBoolean = () => Math.random() >= 0.5;
const getCommentDate = () => {
  let commentDate = ``;
  const daysAfterCommentPublication = getRandomNum(0, 18);
  if (daysAfterCommentPublication === 0) {
    commentDate = `Today`;
  } else if (daysAfterCommentPublication === 1) {
    commentDate = `Yesterday`;
  } else {
    commentDate = `${daysAfterCommentPublication} days ago`;
  }
  return commentDate;
};
const createRandomComment = () => {
  const LAST_INDEX_OF_EMOJI_PICTURES = emojiPictures.length - 1;
  const LAST_DESTRIPTION_SENTENCE_INDEX = descriptionSentences.length - 1;
  const LAST_INDEX_OF_NAMES = randomNames.length - 1;
  return {
    emojiPictureSrc: emojiPictures[getRandomNum(0, LAST_INDEX_OF_EMOJI_PICTURES)],
    commentText: `${descriptionSentences[getRandomNum(0, LAST_DESTRIPTION_SENTENCE_INDEX)]}.`,
    commentAuthor: randomNames[getRandomNum(0, LAST_INDEX_OF_NAMES)],
    commentDate: getCommentDate()
  };
};
const createRandomCommentsData = (commentsSum) => {
  const comments = [];
  if (commentsSum !== 0) {
    for (let i = 0; i < commentsSum; i++) {
      comments.push(createRandomComment());
    }
  }
  return comments;
};
export const generateFilmCardData = () => {
  const releaseYear = getReleaseYear();
  const genre = getGenre();
  const commentsSum = getCommentsSum();
  return {
    filmTitle: getFilmTitle(),
    ratingVal: +getRatingVal(),
    releaseYear,
    filmDuration: getFilmDuration(),
    genre,
    posterSrc: getPosterSrc(),
    description: getDescription(),
    commentsSum,
    ageLimit: getAgeLimit(),
    directorName: getName(),
    writers: getNamesList(),
    actors: getNamesList(),
    releaseDate: getReleaseDate(releaseYear),
    countryOfOrigin: getCountry(),
    genres: getGenresList(genre),
    isAlready: getRandomBoolean(),
    isInWatchlist: getRandomBoolean(),
    ifFavorites: getRandomBoolean(),
    comments: createRandomCommentsData(commentsSum)
  };
};
