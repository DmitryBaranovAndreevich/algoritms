import { ILinkedList } from "../types/linkedList";
import { Node } from "./node";
import { stackToArr } from "./stackToArr";

export class LinkedList<T> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;
  constructor() {
    this.head = null;
    this.size = 0;
  }

  insertAt(element: T, index: number) {
    if (index < 0 || index > this.size) {
      console.log("Enter a valid index");
      return;
    } else {
      const node = new Node(element);

      if (index === 0) {
        if (this.head) {
          node.next = this.head;
          this.head = node;
        } else {
          this.head = node;
        }
      } else {
        let curr = this.head;
        let currIndex = 0;

        while (currIndex !== index - 1 && curr) {
          curr = curr.next;
          currIndex++;
        }
        if (curr) {
          node.next = curr.next;
          curr.next = node;
        }
      }

      this.size++;
    }
  }

  appendHead(element: T) {
    this.insertAt(element, this.size);
  }

  removeHead() {
    this.removeElements(this.size - 1);
  }

  appendTail(element: T) {
    this.insertAt(element, 0);
  }

  removeTail() {
    this.removeElements(0);
  }

  getSize() {
    return this.size;
  }

  removeElements(val: number): void {
    if (val > this.getSize() || val < 0) throw new Error("Invalid index");
    else {
      let dummyHead = new Node(0);
      dummyHead.next = this.head;
      let curr = dummyHead;
      let index = -1;
      while (curr.next) {
        if (index === val - 1) {
          curr.next = curr.next.next;
          break;
        } else {
          curr = curr.next;
          index++;
        }
      }
      this.size--;
      this.head = dummyHead.next;
    }
  }

  getArr() {
    return this.head ? (stackToArr(this.head as Node<T>) as Array<T>) : [];
  }
}
