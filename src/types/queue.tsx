export interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  get getArr(): Array<T>;
  get isEmpty(): boolean;
}
