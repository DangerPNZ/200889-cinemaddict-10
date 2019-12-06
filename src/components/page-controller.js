const checkElement = (item) => {
  if (item instanceof Element) {
    return item;
  } else {
    return item.getElement();
  }
};

export default class pageController {
  render(elementNodeOrComponent, containerNodeOrComponent, where = `append`) {
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
  }
}
