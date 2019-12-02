export const getRandomNum = (min, max, toRound = true) => {
  const numbersLengthAfterPoint = 1;
  const number = Math.random() * (max - min) + min;
  return toRound ? Math.round(number) : number.toFixed(numbersLengthAfterPoint);
};
