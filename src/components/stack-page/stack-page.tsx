import React, { useState } from "react";
import styles from "./stack-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Stack, Node, sleep } from "../../services";
import { useForm } from "../../hooks/useForm";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";

export const StackPage: React.FC = () => {
  const { values, handleChange, setValues } = useForm({ inputString: "" });
  const [stack, setStack] = useState(
    new Stack<typeof values.inputString>(null)
  );
  const [{ type, arr }, setArr] = useState<{
    type: string;
    arr: Array<typeof values.inputString>;
  }>({ type: "", arr: [] });
  const [isLoad, seIsLoad] = useState(false);

  async function renderAnimation(
    arr1: Array<typeof values.inputString>,
    arr2: Array<typeof values.inputString>
  ) {
    setArr({ type: "select", arr: arr1 });
    await sleep(500);
    setArr({ type: "finish", arr: arr2 });
  }

  async function addNode() {
    const addValue = values.inputString;
    if (addValue !== "") stack.push(addValue);
    setValues({ inputString: "" });
    if (stack.top) {
      const arr = stackToArr(stack?.top);
      renderAnimation(arr, arr);
    } else setArr({ type: "", arr: [] });
    console.log(arr);
  }

  async function delNode() {
    const cloneArr = [...arr];
    stack.pop();
    if (stack.top) {
      const arr = stackToArr(stack?.top);
      renderAnimation(cloneArr, arr);
    } else {
      renderAnimation(cloneArr, []);
      await sleep(500);
      setArr({ type: "", arr: [] });
    }
  }

  function clear() {
    setStack(new Stack<typeof values.inputString>(null));
    setArr({ type: "", arr: [] });
  }

  function stackToArr<T>(top: Node<T>): Array<T> {
    if (!top?.next) return [top.value];
    else {
      const value = [top.value];
      return [...stackToArr(top?.next), ...value];
    }
  }

  return (
    <SolutionLayout title="Стек">
      <form className={styles.wrapper}>
        <div className={styles.container}>
          <Input
            type={"text"}
            maxLength={4}
            max={4}
            placeholder={"Введите текст"}
            name={"inputString"}
            isLimitText={true}
            onChange={handleChange}
            value={values.inputString}
          ></Input>
          <Button
            type={"button"}
            text={"Добавить"}
            onClick={addNode}
            disabled={values.inputString === "" ? true : false}
          ></Button>
          <Button
            type={"button"}
            text={"Удалить"}
            onClick={delNode}
            disabled={stack.isEmpty() ? true : false}
          ></Button>
        </div>
        <Button
          type={"button"}
          text={"Очистить"}
          onClick={clear}
          disabled={stack.isEmpty() ? true : false}
        ></Button>
      </form>
      <div className={styles.circleContainer}>
        {arr.map((el, index) => {
          let color = ElementStates.Default;
          if (index === arr.length - 1 && type === "select") {
            color = ElementStates.Changing;
          }
          return (
            <Circle
              letter={String(el)}
              key={index}
              head={index === arr.length - 1 ? "Top" : ""}
              index={index}
              state={color}
            ></Circle>
          );
        })}
      </div>
    </SolutionLayout>
  );
};
