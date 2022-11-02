import { swap } from "./swap";
import { TAnimation } from "../types/animation"
export function getAnimations(arr: Array<string>) {
  const arrCopy = [...arr];
  const animations: Array<TAnimation> = [];
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    animations.push({ type: "select", data: [l, r], arr: [...arrCopy] });
    swap(arrCopy, l, r);
    if(l===r||r - l === 1)animations.push({ type: "swap", data: [l, r], arr: [...arrCopy] });
    l++;
    r--;
  }
  return animations;
}