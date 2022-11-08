import { TAnimation } from "../types/animation";
import { swap } from "./swap";
import { ArrStyles } from "../types/arrStyles";

export function getAnimationToChoiceSort(arr: Array<number>, sortFlag: string) {
  const arrCopy = [...arr];
  const animations: Array<TAnimation<number>> = [];

  for (let i = 0; i < arr.length; i++) {
    let min = i;

    for (let j = i + 1; j < arr.length; j++) {
      animations.push({
        type: ArrStyles.select,
        data: [i, j],
        arr: [...arrCopy],
      });
      if (sortFlag === "up") {
        if (arrCopy[j] < arrCopy[min]) {
          min = j;
        }
      } else {
        if (arrCopy[j] > arrCopy[min]) {
          min = j;
        }
      }
    }
    if (min !== i) {
      swap(arrCopy, i, min);
    }
  }
  animations.push({
    type: ArrStyles.swap,
    data: [arr.length - 2, arr.length - 1],
    arr: [...arrCopy],
  });
  return animations;
}
