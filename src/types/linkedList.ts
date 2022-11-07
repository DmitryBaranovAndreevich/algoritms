export interface ILinkedList<T> {
  appendHead: (element: T) => void;
  removeHead: () => void;
  appendTail: (element: T) => void;
  removeTail: () => void;
  insertAt: (element: T, position: number) => void;
  getSize: () => number;
  getArr: () => Array<T>;
}
