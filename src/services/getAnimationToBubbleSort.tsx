import { TAnimation } from "../types/animation";
import { swap } from "./swap";

export  function getAnimationToBubbleSort(arr: Array<number>, sortFlag: string) {
    const arrCopy = [...arr];
    const animations: Array<TAnimation> = [];

    for (let j = arr.length - 1; j > 0; j--) {
      for (let i = 0; i < j; i++) {
        animations.push({
          type: "select",
          data: [i, i + 1, j],
          arr: [...arrCopy],
        });
        if (sortFlag === "down") {
          if (arrCopy[i] < arrCopy[i + 1]) {
            swap(arrCopy, i, i + 1);
          }
        }
        if(sortFlag === "up") {
          if (arrCopy[i] > arrCopy[i + 1]) {
            swap(arrCopy, i, i + 1);
          }
        }
      }
    }
    animations.push({ type: "swap", data: [0, 0, 0], arr: [...arrCopy] });
    return animations;
  }
