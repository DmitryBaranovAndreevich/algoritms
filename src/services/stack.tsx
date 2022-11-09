import { IStack } from "../types/stack";
import { Node } from "./node";
import { stackToArr } from "./stackToArr";

export class Stack<T> implements IStack<T> {
  constructor(private top: Node<T> | null = null) {}
  push = (item: T) => {
    const newNode = new Node(item, this.top);
    this.top = newNode;
  };

  pop = () => {
    if (this.isEmpty) {
      throw new Error("stack is empty");
    }
    if (this.top) this.top = this.top.next;
  };

  peak = () => {
    if (this.isEmpty) {
      throw new Error("stack is empty");
    }
    return this.top?.value || null;
  };

  get isEmpty() {
    return this.top === null;
  }

  get getArr() {
    return this.top ? stackToArr(this.top as Node<T>) : [];
  }
}
