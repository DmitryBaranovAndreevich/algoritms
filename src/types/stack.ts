import { Node } from "../services";
export interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  getArr: () => Array<T>;
}
