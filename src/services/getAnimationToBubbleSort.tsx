import { TAnimation } from "../types/animation";
import { swap } from "./swap";
import { ArrStyles } from "../types/arrStyles";

export function getAnimationToBubbleSort(arr: Array<number>, sortFlag: string) {
  const arrCopy = [...arr];
  const animations: Array<TAnimation<number>> = [];

  for (let j = arr.length - 1; j > 0; j--) {
    for (let i = 0; i < j; i++) {
      animations.push({
        type: ArrStyles.select,
        data: [i, i + 1, j],
        arr: [...arrCopy],
      });
      if (sortFlag === "down") {
        if (arrCopy[i] < arrCopy[i + 1]) {
          swap(arrCopy, i, i + 1);
        }
      }
      if (sortFlag === "up") {
        if (arrCopy[i] > arrCopy[i + 1]) {
          swap(arrCopy, i, i + 1);
        }
      }
    }
  }
  animations.push({ type: ArrStyles.swap, data: [0, 0, 0], arr: [...arrCopy] });
  return animations;
}
