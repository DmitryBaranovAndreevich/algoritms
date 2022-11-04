import { IQueue } from "../types/queue";

export class Queue<T> implements IQueue<T> {
  container: (T | null)[] = [];
  head = 0;
  tail = 0;
  readonly size: number = 0;
  length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size).fill(null);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }
    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    this.container[this.head % this.size] = null;
    if(this.length > 1)this.head++;
    else { this.tail = this.head}
    this.length--;
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    return this.container[this.head % this.size]; // Ваш код
  };

  isEmpty = () => this.length === 0;
}
