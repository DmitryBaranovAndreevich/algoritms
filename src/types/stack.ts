export interface IStack<T> {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  get getArr(): Array<T>;
  get isEmpty(): boolean;
}
