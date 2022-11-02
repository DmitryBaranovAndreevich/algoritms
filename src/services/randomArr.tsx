export function randomArr() {
  let size = randomNumber(17);
  while(size < 3) {
    size = randomNumber(17);
  }
  return Array.from({length: size}, () => randomNumber(100));
}



function randomNumber(maxNumber: number) {
  return Math.floor(Math.random() * maxNumber);
}