export const removeIt = (element) => {
  if (element instanceof Element) {
    element.remove();
  } else {
    element.removeElement();
  }
};
