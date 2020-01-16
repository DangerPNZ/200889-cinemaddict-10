import moment from 'moment';

export const compare = (property, byDate = false) => {
  if (byDate === false) {
    return (a, b) => {
      if (a[property] < b[property]) {
        return 1;
      }
      if (a[property] > b[property]) {
        return -1;
      }
      return 0;
    };
  } else {
    return (a, b) => {
      if (new Date(a[property]) < new Date(b[property])) {
        return 1;
      }
      if (new Date(a[property]) > new Date(b[property])) {
        return -1;
      }
      return 0;
    };
  }
};

export const getRandomNum = (min, max, toRound = true) => {
  const numbersLengthAfterPoint = 1;
  const number = Math.random() * (max - min) + min;
  return toRound ? Math.round(number) : number.toFixed(numbersLengthAfterPoint);
};

export const createElement = (templateContent) => {
  const element = document.createElement(`template`);
  element.innerHTML = templateContent;
  return element.content.firstElementChild;
};

const checkElement = (item) => {
  if (item instanceof Element) {
    return item;
  } else {
    return item.getElement();
  }
};
export const insertElementInMarkup = (elementNodeOrComponent, containerNodeOrComponent, where = `append`) => {
  const elementNode = checkElement(elementNodeOrComponent);
  const containerNode = checkElement(containerNodeOrComponent);

  switch (where) {
    case `append`:
      containerNode.append(elementNode);
      break;
    case `prepend`:
      containerNode.prepend(elementNode);
      break;
    case `before`:
      containerNode.before(elementNode);
      break;
    case `after`:
      containerNode.after(elementNode);
      break;
    case `replaceWith`:
      containerNode.replaceWith(elementNode);
      break;
  }
};
export const formatDate = (date, formatStr) => {
  return moment(date).format(formatStr);
};
const MINUTES_IN_HOUR = 60;
export const getFilmDuration = (duration) => {
  const durationInHours = Math.floor(duration / MINUTES_IN_HOUR);
  const durationInMinutes = Math.floor(duration % MINUTES_IN_HOUR);
  const durationValues = [
    durationInHours !== 0 ? `${durationInHours}h ` : ``,
    durationInMinutes !== 0 ? `${durationInMinutes}m` : ``
  ];
  return durationValues.join(``);
};
export const removeIt = (element) => {
  if (element instanceof Element) {
    element.remove();
  } else {
    element.getElement().remove();
    element.removeElement();
  }
};
