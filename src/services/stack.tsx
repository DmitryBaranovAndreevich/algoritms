import { IStack } from "../types/stack";
import { Node } from "./node";
import { stackToArr } from "./stackToArr";

export class Stack<T> implements IStack<T> {
  private top: Node<T> | null = null;

  constructor(node: Node<T> | null) {
    this.top = node;
  }
  push = (item: T): void => {
    const newNode = new Node(item, this.top);
    this.top = newNode;
  };

  pop = (): void => {
    if (this.isEmpty()) {
      throw new Error("stack is empty");
    }
    if (this.top) this.top = this.top.next;
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("stack is empty");
    }
    return this.top?.value || null;
  };

  isEmpty = (): boolean => {
    return this.top === null;
  };

  getArr = () =>{
    return this.top?stackToArr(this.top as Node<T>):[]
  }
}
