import { TAnimation } from "../types/animation";
import { sleep } from "./sleep";

export async function parseAnimations(animations: Array<TAnimation>,callback: Function, time: number ) {
    for (let animation of animations) {
     await sleep(time);
      callback((priv: TAnimation) => {
        priv = animation;
        return priv;
      });
    }
  }
