const checkElement = (item) => {
  if (item instanceof Element) {
    return item;
  } else {
    return item.getElement();
  }
};

export default class pageController {
  constructor(element, container, where = `append`) {
    this._element = element;
    this._container = container;
    this._where = where;
  }
  render() {
    const element = checkElement(this._element);
    const containerForElement = checkElement(this._container);

    switch (this._where) {
      case `append`:
        containerForElement.append(element);
        break;
      case `prepend`:
        containerForElement.prepend(element);
        break;
      case `before`:
        containerForElement.before(element);
        break;
      case `after`:
        containerForElement.after(element);
        break;
      case `replaceWith`:
        containerForElement.replaceWith(element);
        break;
    }
  }
}
