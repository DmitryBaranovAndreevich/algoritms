import React, { ReactElement, useEffect, useState } from "react";
import styles from "./list-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { useForm } from "../../hooks/useForm";
import { LinkedList } from "../../services/linkedList";
import { sleep } from "../../services";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { ElementStates } from "../../types/element-states";
import { randomArr } from "../../services";
import { ArrStyles } from "../../types/arrStyles";

export const ListPage: React.FC = () => {
  const { values, handleChange, setValues } = useForm({
    inputString: "",
  });
  const {
    values: inputValues,
    handleChange: inputHandleChange,
    setValues: inputSetValues,
  } = useForm<number>({
    inputIndex: -1,
  });
  const [linkedList] = useState(
    new LinkedList(randomArr(6).map((el) => String(el)))
  );
  const [{ style, type, arr, value, indexEl }, setArr] = useState<{
    style?: string;
    type: string;
    arr: Array<string>;
    value: string;
    indexEl?: number | null;
  }>({ type: ArrStyles.finish, value: "", arr: [] });
  const [isAnimation, setIsAnimation] = useState(false);
  const [loader, setLoader] = useState({
    addHeadLoader: false,
    delHeadLoader: false,
    addTailLoader: false,
    delTailLoader: false,
    addToIndex: false,
    delToIndex: false,
  });
  /* eslint-disable */
  useEffect(() => {
    const arr = linkedList.getArr;
    setArr({ type: ArrStyles.finish, value: "", arr: arr });
  }, []);
  /* eslint-enable */
  async function renderAnimation(
    arr1: Array<string>,
    arr2: Array<string>,
    addElement: string = "",
    index: number | string,
    change: string
  ) {
    const position1 = typeof index === "number" ? index : arr1.length - 1;
    setArr({
      style: change,
      type: ArrStyles.newEl,
      arr: arr1,
      value: addElement,
      indexEl: position1,
    });
    await sleep();
    const position2 = typeof index === "number" ? index : arr2.length - 1;
    setArr({
      style: change,
      type: ArrStyles.select,
      arr: arr2,
      value: addElement,
      indexEl: position2,
    });
    await sleep();
    setArr({ type: ArrStyles.finish, value: "", arr: arr2 });
  }

  async function addElement(func: Function, position: string, index: number) {
    setIsAnimation(true);
    setLoader(
      position === "head"
        ? { ...loader, addHeadLoader: true }
        : { ...loader, addTailLoader: true }
    );
    const addValue = values.inputString;
    setValues({ ...values, inputString: "" });
    const arr1 = linkedList.getArr;
    func.call(linkedList, addValue);
    const arr2 = linkedList.getArr;
    const positionToAnimation = position === "tail" ? position : index;
    await renderAnimation(arr1, arr2, addValue, positionToAnimation, "add");
    setIsAnimation(false);
    setLoader(
      position === "head"
        ? { ...loader, addHeadLoader: false }
        : { ...loader, addTailLoader: false }
    );
  }

  async function removeElement(func: Function, position: string) {
    setIsAnimation(true);
    setLoader(
      position === "head"
        ? { ...loader, delHeadLoader: true }
        : { ...loader, delTailLoader: true }
    );
    const arr1 = linkedList.getArr;
    const delValue = position === "head" ? arr1[0] : arr1[arr1.length - 1];
    func.call(linkedList);
    const arr2 = linkedList.getArr;
    const positionToAnimation = position === "tail" ? position : 0;
    await renderAnimation(
      arr1,
      arr2,
      delValue,
      positionToAnimation,
      ArrStyles.remove
    );
    setIsAnimation(false);
    setLoader(
      position === "head"
        ? { ...loader, delHeadLoader: false }
        : { ...loader, delTailLoader: false }
    );
  }

  async function addToIndex() {
    setIsAnimation(true);
    setLoader({ ...loader, addToIndex: true });
    const addValue = values.inputString;
    const index = Number(inputValues.inputIndex);
    setValues({ inputString: "" });
    inputSetValues({ inputIndex: -1 });
    const arr1 = linkedList.getArr;
    for (let i = 0; i <= index; i++) {
      setArr({
        style: ArrStyles.addToIndex,
        type: ArrStyles.search,
        arr: arr1,
        value: addValue,
        indexEl: i,
      });
      await sleep();
    }
    linkedList.insertAt(addValue, linkedList.getSize - index);
    const arr2 = linkedList.getArr;
    await renderAnimation(arr1, arr2, addValue, index, "add");
    setIsAnimation(false);
    setLoader({ ...loader, addToIndex: false });
  }

  async function delToIndex() {
    setIsAnimation(true);
    setLoader({ ...loader, delToIndex: true });
    const index = Number(inputValues.inputIndex);
    inputSetValues({ inputIndex: -1 });
    const arr1 = linkedList.getArr;
    for (let i = 0; i <= index; i++) {
      setArr({
        style: ArrStyles.delToIndex,
        value: "",
        type: ArrStyles.search,
        arr: arr1,
        indexEl: i,
      });
      await sleep();
    }
    linkedList.removeElements(linkedList.getSize - index - 1);
    const arr2 = linkedList.getArr;
    await renderAnimation(arr1, arr2, arr1[index], index, ArrStyles.remove);
    setIsAnimation(false);
    setLoader({ ...loader, delToIndex: false });
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={styles.container}>
        <Input
          type={"text"}
          value={values.inputString}
          maxLength={4}
          placeholder={"Введите значение"}
          onChange={handleChange}
          name={"inputString"}
          isLimitText={true}
          extraClass={styles.inputWidth}
        ></Input>
        <Button
          text={"Добавить в head"}
          onClick={() => addElement(linkedList.appendHead, "head", 0)}
          disabled={isAnimation || values.inputString === ""}
          isLoader={loader.addHeadLoader}
        ></Button>
        <Button
          text={"Добавить в tail"}
          onClick={() => addElement(linkedList.appendTail, "tail", 4)}
          disabled={isAnimation || values.inputString === ""}
          isLoader={loader.addTailLoader}
        ></Button>
        <Button
          text={"Удалить из head"}
          onClick={() => removeElement(linkedList.removeHead, "head")}
          disabled={isAnimation || linkedList.getSize === 0}
          isLoader={loader.delHeadLoader}
        ></Button>
        <Button
          text={"Удалить из tail"}
          onClick={() => removeElement(linkedList.removeTail, "tail")}
          disabled={isAnimation || linkedList.getSize === 0}
          isLoader={loader.delTailLoader}
        ></Button>
      </div>
      <div className={styles.container}>
        <Input
          value={inputValues.inputIndex < 0 ? "" : inputValues.inputIndex}
          type={"number"}
          placeholder={"Введите индекс"}
          onChange={inputHandleChange}
          name={"inputIndex"}
          extraClass={styles.inputWidth}
        ></Input>
        <Button
          text={"Добавить по индексу"}
          onClick={addToIndex}
          extraClass={styles.buttonWidth}
          disabled={
            isAnimation ||
            inputValues.inputIndex > linkedList.getSize - 1 ||
            inputValues.inputIndex < 0 ||
            values.inputString === ""
          }
          isLoader={loader.addToIndex}
        ></Button>
        <Button
          text={"Удалить по индексу"}
          extraClass={styles.buttonWidth}
          disabled={
            isAnimation ||
            inputValues.inputIndex > linkedList.getSize - 1 ||
            inputValues.inputIndex < 0
          }
          isLoader={loader.delToIndex}
          onClick={delToIndex}
        ></Button>
      </div>
      <div className={styles.circlesContainer}>
        {arr.map((el, index) => {
          let letter = el;
          let head: ReactElement | string = index === 0 ? "head" : "";
          let tail: ReactElement | string =
            index === arr.length - 1 ? "tail" : "";
          let color = ElementStates.Default;

          if (style === "add" && index === indexEl) {
            if (type === ArrStyles.newEl) {
              head = (
                <Circle
                  letter={value}
                  state={ElementStates.Changing}
                  isSmall={true}
                ></Circle>
              );
            }
            if (type === ArrStyles.select) {
              color = ElementStates.Modified;
            }
          }

          if (style === ArrStyles.remove && index === indexEl) {
            if (type === ArrStyles.newEl) {
              tail = (
                <Circle
                  letter={value}
                  state={ElementStates.Changing}
                  isSmall={true}
                ></Circle>
              );
              letter = "";
            }
          }

          if (type === ArrStyles.search && typeof indexEl === "number") {
            if (index < indexEl) color = ElementStates.Changing;
            if (index === indexEl && style === ArrStyles.addToIndex)
              head = (
                <Circle
                  letter={value}
                  state={ElementStates.Changing}
                  isSmall={true}
                ></Circle>
              );
          }
          return (
            <div className={styles.wrapper} key={index}>
              <Circle
                letter={letter}
                head={head}
                tail={tail}
                index={index}
                state={color}
              ></Circle>
              {index !== arr.length - 1 && <ArrowIcon></ArrowIcon>}
            </div>
          );
        })}
      </div>
    </SolutionLayout>
  );
};
