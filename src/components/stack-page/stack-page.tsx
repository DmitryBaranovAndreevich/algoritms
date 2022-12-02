import React, { useState } from "react";
import styles from "./stack-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Stack, sleep } from "../../services";
import { useForm } from "../../hooks/useForm";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { ArrStyles } from "../../types/arrStyles";

export const StackPage: React.FC = () => {
  const { values, handleChange, setValues } = useForm({ inputString: "" });
  const [isDelete, setIsDelete] = useState(false);
  const [stack, setStack] = useState(new Stack<string>(null));
  const [{ type, arr }, setArr] = useState<{
    type: string;
    arr: Array<string>;
  }>({ type: ArrStyles.default, arr: [] });

  async function renderAnimation(arr1: Array<string>, arr2: Array<string>) {
    setArr({ type: ArrStyles.select, arr: arr1 });
    await sleep();
    setArr({ type: ArrStyles.finish, arr: arr2 });
  }

  async function addNode() {
    const addValue = values.inputString;
    if (addValue !== "") stack.push(addValue);
    setValues({ inputString: "" });
    if (stack.getArr) {
      const arr = stack.getArr;
      renderAnimation(arr, arr);
    } else setArr({ type: ArrStyles.default, arr: [] });
  }

  async function delNode() {
    setIsDelete(true);
    const cloneArr = [...arr];
    stack.pop();
    if (stack.getArr) {
      const arr = stack.getArr;
      await renderAnimation(cloneArr, arr);
      setIsDelete(false);
    } else {
      await renderAnimation(cloneArr, []);
      await sleep();
      setArr({ type: ArrStyles.default, arr: [] });
      setIsDelete(false);
    }
  }

  function clear() {
    setStack(new Stack<string>(null));
    setArr({ type: ArrStyles.default, arr: [] });
  }

  return (
    <SolutionLayout title="Стек">
      <form className={styles.wrapper} onSubmit={(e) => e.preventDefault()}>
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
            disabled={stack.isEmpty || isDelete}
          ></Button>
        </div>
        <Button
          type={"button"}
          text={"Очистить"}
          onClick={clear}
          disabled={stack.isEmpty ? true : false}
        ></Button>
      </form>
      <div className={styles.circleContainer}>
        {arr.map((el, index) => {
          let color = ElementStates.Default;
          if (index === arr.length - 1 && type === ArrStyles.select) {
            color = ElementStates.Changing;
          }
          return (
            <Circle
              letter={el}
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
