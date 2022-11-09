import { TAnimation } from "../types/animation";
import { sleep } from "./sleep";

export async function parseAnimations<T>(
  animations: Array<TAnimation<T>>,
  callback: Function,
  time?: number
) {
  for (let animation of animations) {
    await sleep(time);
    callback((priv: TAnimation<T>) => {
      priv = animation;
      return priv;
    });
  }
}
