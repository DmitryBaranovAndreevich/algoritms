export function randomArr(initSize = 17) {
  let size = randomNumber(initSize);
  while (size < 3) {
    size = randomNumber(initSize);
  }
  return Array.from({ length: size }, () => randomNumber(100));
}

function randomNumber(maxNumber: number) {
  return Math.floor(Math.random() * maxNumber);
}
