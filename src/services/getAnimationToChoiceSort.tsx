import { TAnimation } from "../types/animation";
import { swap } from "./swap";

export function getAnimationToChoiceSort(arr: Array<number>, sortFlag: string) {
  const arrCopy = [...arr];
  const animations: Array<TAnimation> = [];

  for (let i = 0; i < arr.length; i++) {
    let min = i;

    for (let j = i + 1; j < arr.length; j++) {
      animations.push({ type: "select", data: [i, j], arr: [...arrCopy] });
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
      if (i >= arr.length - 2)
        animations.push({ type: "swap", data: [i, min], arr: [...arrCopy] });
    } else {
      if (i >= arr.length - 2)
        animations.push({ type: "swap", data: [i, min], arr: [...arrCopy] });
    }
  }

  return animations;
}
