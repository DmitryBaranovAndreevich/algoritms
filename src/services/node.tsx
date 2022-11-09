export class Node<T> {
  value: T;
  next: Node<T|any> | null;
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}