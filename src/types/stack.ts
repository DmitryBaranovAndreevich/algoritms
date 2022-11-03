import { Node } from "../services";
export interface IStack<T> {
  top: Node<T>|null;
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
}