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

export const ListPage: React.FC = () => {
  const { values, handleChange, setValues } = useForm({
    inputIndex: "",
    inputString: "",
  });
  const [linkedList] = useState(new LinkedList());
  const [{ style, type, arr, value, indexEl }, setArr] = useState<{
    style?: string;
    type: string;
    arr: Array<typeof values.inputString | null>;
    value?: typeof values.inputString | null;
    indexEl?: number | null;
  }>({ type: "finish", arr: [] });
  const [isAnimation, setIsAnimation] = useState(false);
  const [loader, setLoader] = useState({
    addHeadLoader: false,
    delHeadLoader: false,
    addTailLoader: false,
    delTailLoader: false,
    addToIndex: false,
    delToIndex: false,
  });

  useEffect(() => {
    const initArr = ["0", "34", "8", "1"];

    if (!linkedList.getSize()) {
      for (let num of initArr) {
        linkedList.appendTail(num);
      }
    }

    const arr = linkedList.getArr();
    setArr({ type: "finish", arr: arr as Array<string> });
  }, []);

  async function renderAnimation(
    arr1: Array<typeof values.inputString>,
    arr2: Array<typeof values.inputString>,
    addElement: typeof values.inputString | null = null,
    index: number | string,
    change: string
  ) {
    const position1 = typeof index === "number" ? index : arr1.length - 1;
    setArr({
      style: change,
      type: "newEl",
      arr: arr1,
      value: addElement,
      indexEl: position1,
    });
    await sleep(500);
    const position2 = typeof index === "number" ? index : arr2.length - 1;
    setArr({
      style: change,
      type: "select",
      arr: arr2,
      value: addElement,
      indexEl: position2,
    });
    await sleep(500);
    setArr({ type: "finish", arr: arr2 });
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
    const arr1 = linkedList.getArr() as Array<typeof values.inputString>;
    func.call(linkedList, addValue);
    const arr2 = linkedList.getArr() as Array<typeof values.inputString>;
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
    const arr1 = linkedList.getArr() as Array<typeof values.inputString>;
    const delValue = position === "head" ? arr1[0] : arr1[arr1.length - 1];
    func.call(linkedList);
    const arr2 = linkedList.getArr() as Array<typeof values.inputString>;
    const positionToAnimation = position === "tail" ? position : 0;
    await renderAnimation(
      arr1,
      arr2,
      delValue as string,
      positionToAnimation,
      "remove"
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
    const index = Number(values.inputIndex);
    setValues({ inputIndex: "", inputString: "" });
    const arr1 = linkedList.getArr() as Array<typeof values.inputString>;
    for (let i = 0; i <= index; i++) {
      setArr({
        style: "addToIndex",
        type: "search",
        arr: arr1,
        value: addValue,
        indexEl: i,
      });
      await sleep(500);
    }
    linkedList.insertAt(addValue, linkedList.getSize() - index);
    const arr2 = linkedList.getArr() as Array<typeof values.inputString>;
    await renderAnimation(arr1, arr2, addValue, index, "add");
    setIsAnimation(false);
    setLoader({ ...loader, addToIndex: false });
  }

  async function delToIndex() {
    setIsAnimation(true);
    setLoader({ ...loader, delToIndex: true });
    const index = Number(values.inputIndex);
    setValues({ ...values, inputIndex: "" });
    const arr1 = linkedList.getArr() as Array<typeof values.inputString>;
    for (let i = 0; i <= index; i++) {
      setArr({ style: "delToIndex", type: "search", arr: arr1, indexEl: i });
      await sleep(500);
    }
    linkedList.removeElements(linkedList.getSize() - index - 1);
    const arr2 = linkedList.getArr() as Array<typeof values.inputString>;
    await renderAnimation(
      arr1 as Array<typeof values.inputString>,
      arr2 as Array<typeof values.inputString>,
      arr1[index],
      index,
      "remove"
    );
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
          disabled={isAnimation || linkedList.getSize() === 0}
          isLoader={loader.delHeadLoader}
        ></Button>
        <Button
          text={"Удалить из tail"}
          onClick={() => removeElement(linkedList.removeTail, "tail")}
          disabled={isAnimation || linkedList.getSize() === 0}
          isLoader={loader.delTailLoader}
        ></Button>
      </div>
      <div className={styles.container}>
        <Input
          value={values.inputIndex}
          type={"number"}
          placeholder={"Введите индекс"}
          onChange={handleChange}
          name={"inputIndex"}
          extraClass={styles.inputWidth}
        ></Input>
        <Button
          text={"Добавить по индексу"}
          onClick={addToIndex}
          extraClass={styles.buttonWidth}
          disabled={
            isAnimation ||
            (values.inputIndex as unknown as number) >
              linkedList.getSize() - 1 ||
            (values.inputIndex as unknown as number) < 0 ||
            values.inputIndex === "" ||
            values.inputString === ""
          }
          isLoader={loader.addToIndex}
        ></Button>
        <Button
          text={"Удалить по индексу"}
          extraClass={styles.buttonWidth}
          disabled={
            isAnimation ||
            (values.inputIndex as unknown as number) >
              linkedList.getSize() - 1 ||
            (values.inputIndex as unknown as number) < 0 ||
            values.inputIndex === ""
          }
          isLoader={loader.delToIndex}
          onClick={delToIndex}
        ></Button>
      </div>
      <div className={styles.circlesContainer}>
        {arr.map((el, index) => {
          let letter = String(el);
          let head: ReactElement | string = index === 0 ? "head" : "";
          let tail: ReactElement | string =
            index === arr.length - 1 ? "tail" : "";
          let color = ElementStates.Default;

          if (style === "add" && index === indexEl) {
            if (type === "newEl") {
              head = (
                <Circle
                  letter={value as string}
                  state={ElementStates.Changing}
                  isSmall={true}
                ></Circle>
              );
            }
            if (type === "select") {
              color = ElementStates.Modified;
            }
          }

          if (style === "remove" && index === indexEl) {
            if (type === "newEl") {
              tail = (
                <Circle
                  letter={value as string}
                  state={ElementStates.Changing}
                  isSmall={true}
                ></Circle>
              );
              letter = "";
            }
          }

          if (type === "search" && typeof indexEl === "number") {
            if (index < indexEl) color = ElementStates.Changing;
            if (index === indexEl && style === "addToIndex")
              head = (
                <Circle
                  letter={value as string}
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
