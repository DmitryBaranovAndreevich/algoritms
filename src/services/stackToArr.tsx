import { Node } from "./node";

export function stackToArr<T>(top: Node<T>): Array<T> {
    if (!top?.next) return [top.value];
    else {
      const value = [top.value];
      return [...stackToArr(top?.next), ...value];
    }
  }