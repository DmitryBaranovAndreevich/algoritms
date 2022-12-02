import React, { useState } from "react";
import styles from "./queue-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useForm } from "../../hooks/useForm";
import { Queue, sleep } from "../../services";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { ArrStyles } from "../../types/arrStyles";

export const QueuePage: React.FC = () => {
  const { values, handleChange, setValues } = useForm({ inputNumber: "" });
  const [queue, setQueue] = useState(new Queue<string>(7));
  const [{ type, arr, num }, setArr] = useState<{
    type: string;
    arr: Array<string | null>;
    num: number | null;
  }>({ type: ArrStyles.finish, arr: [...queue.getArr], num: null });
  const [isStart, setIsStart] = useState(false);
  const [isAddValue, setIsAddValue] = useState(false);
  const [isDelValue, setIsDelValue] = useState(false);

  async function renderAnimation(
    arr1: Array<string | null>,
    arr2: Array<string | null>,
    index: number | null,
    callback?: Function
  ) {
    setArr({ type: ArrStyles.select, arr: arr1, num: index });
    await sleep();
    if (callback) callback();
    setArr({ type: ArrStyles.finish, arr: arr2, num: null });
  }

  async function addElement() {
    setIsAddValue(true);
    const addValue = values.inputNumber;
    const arr1 = [...queue.getArr];
    const tail = queue.tail;
    queue.enqueue(addValue);
    setValues({ inputNumber: "" });
    if (!isStart) setIsStart(true);
    await renderAnimation(arr1, queue.getArr, tail);
    setIsAddValue(false);
  }

  async function deleteElement() {
    setIsDelValue(true);
    const arr1 = [...queue.getArr];
    const head = queue.head;
    await renderAnimation(arr1, queue.getArr, head, queue.dequeue);
    setIsDelValue(false);
  }

  function clear() {
    setQueue(new Queue<typeof values.inputNumber>(7));
    setIsStart(false);
    setArr({ type: ArrStyles.finish, arr: Array(7).fill(null), num: null });
  }

  return (
    <SolutionLayout title="Очередь">
      <form className={styles.wrapper} onSubmit={(e) => e.preventDefault()}>
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
            disabled={queue.isEmpty || isDelValue}
            isLoader={isDelValue}
          ></Button>
        </div>
        <Button type={"button"} text={"Очистить"} onClick={clear}></Button>
      </form>
      <div className={styles.circleContainer}>
        {arr.map((el, index) => {
          let letter = el === null ? "" : el;
          let color = ElementStates.Default;

          if (index === num && type === ArrStyles.select) {
            color = ElementStates.Changing;
          }
          return (
            <Circle
              letter={letter}
              key={index}
              head={index === queue.head && isStart ? "head" : ""}
              tail={
                index === queue.tail - 1 && isStart && !queue.isEmpty
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
