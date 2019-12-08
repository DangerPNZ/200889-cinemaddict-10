export const compare = (property) => {
  return (a, b) => {
    if (a[property] < b[property]) {
      return 1;
    }
    if (a[property] > b[property]) {
      return -1;
    }
    return 0;
  };
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

/* Сергей, обрати внимание на этот метод. По критериям, переменная должна начинаться с маленькой буквы,
но это вызовет конфликт линтера */
export const multipleInsertElementsInMarkup = (ComponentReturningElement, dataElements, container, where = `append`) => {
  for (const oneDataElement of dataElements) {
    const element = new ComponentReturningElement(oneDataElement);
    insertElementInMarkup(element, container, where);
  }
};
