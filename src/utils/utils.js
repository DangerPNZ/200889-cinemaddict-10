import moment from 'moment';

const ResultValueForCompare = {
  FIRST_LESS_SECOND: 1,
  FIRST_MORE_SECOND: -1,
  FIRST_EQUAL_SECOND: 0
};

export const compare = (property, byDate = false) => {
  if (byDate === false) {
    return (a, b) => {
      if (a[property] < b[property]) {
        return ResultValueForCompare.FIRST_LESS_SECOND;
      }
      if (a[property] > b[property]) {
        return ResultValueForCompare.FIRST_MORE_SECOND;
      }
      return ResultValueForCompare.FIRST_EQUAL_SECOND;
    };
  } else {
    return (a, b) => {
      if (new Date(a[property]) < new Date(b[property])) {
        return ResultValueForCompare.FIRST_LESS_SECOND;
      }
      if (new Date(a[property]) > new Date(b[property])) {
        return ResultValueForCompare.FIRST_MORE_SECOND;
      }
      return ResultValueForCompare.FIRST_EQUAL_SECOND;
    };
  }
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
