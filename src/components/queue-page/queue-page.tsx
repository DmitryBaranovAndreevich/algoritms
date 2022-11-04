import React, { useState } from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useForm } from "../../hooks/useForm";
import { Queue, sleep } from "../../services";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";

export const QueuePage: React.FC = () => {
  const { values, handleChange, setValues } = useForm({ inputNumber: "" });
  const [queue, setQueue] = useState(new Queue<typeof values.inputNumber>(7));
  const [{ type, arr, num }, setArr] = useState<{
    type: string;
    arr: Array<typeof values.inputNumber | null>;
    num: number | null;
  }>({ type: "finish", arr: [...queue.container], num: null });
  const [isStart, setIsStart] = useState(false);
  const [isAddValue, setIsAddValue] = useState(false);

  async function renderAnimation(
    arr1: Array<typeof values.inputString | null>,
    arr2: Array<typeof values.inputString | null>,
    index: number | null,
    callback?: Function
  ) {
    setArr({ type: "select", arr: arr1, num: index });
    await sleep(500);
    if (callback) callback();
    setArr({ type: "finish", arr: arr2, num: null });
  }

  async function addElement() {
    setIsAddValue(true);
    const addValue = values.inputNumber;
    const arr1 = [...queue.container];
    const tail = queue.tail;
    queue.enqueue(addValue);
    setValues({ inputNumber: "" });
    if (!isStart) setIsStart(true);
    await renderAnimation(arr1, queue.container, tail);
    setIsAddValue(false);
  }

  function deleteElement() {
    const arr1 = [...queue.container];
    const head = queue.head;
    renderAnimation(arr1, queue.container, head, queue.dequeue);
  }

  function clear() {
    setQueue(new Queue<typeof values.inputNumber>(7));
    setIsStart(false);
    setArr({ type: "finish", arr: Array(7).fill(null), num: null });
  }

  return (
    <SolutionLayout title="Очередь">
      <form className={styles.wrapper}>
        <div className={styles.container}>
          <Input
            type={"text"}
            maxLength={4}
            placeholder={"Введите значение"}
            name={"inputNumber"}
            isLimitText={true}
            onChange={handleChange}
            value={values.inputNumber}
          ></Input>
          <Button
            type={"button"}
            text={"Добавить"}
            onClick={addElement}
            disabled={
              values.inputNumber === "" || queue.length === queue.size
                ? true
                : false
            }
            isLoader={isAddValue}
          ></Button>
          <Button
            type={"button"}
            text={"Удалить"}
            onClick={deleteElement}
            disabled={queue.isEmpty() ? true : false}
          ></Button>
        </div>
        <Button type={"button"} text={"Очистить"} onClick={clear}></Button>
      </form>
      <div className={styles.circleContainer}>
        {arr.map((el, index) => {
          let letter = el === null ? "" : el;
          let color = ElementStates.Default;

          if (index === num && type === "select") {
            color = ElementStates.Changing;
          }
          return (
            <Circle
              letter={String(letter)}
              key={index}
              head={index === queue.head && isStart ? "head" : ""}
              tail={
                index === queue.tail - 1 && isStart && !queue.isEmpty()
                  ? "tail"
                  : ""
              }
              index={index}
              state={color}
            ></Circle>
          );
        })}
      </div>
    </SolutionLayout>
  );
};
