import React, { FormEvent, useEffect, useState } from "react";
import styles from "./sorting-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import {
  randomArr,
  getAnimationToChoiceSort,
  parseAnimations,
  getAnimationToBubbleSort,
} from "../../services";
import { TAnimation } from "../../types/animation";
import { Column } from "../ui/column/column";
import { ElementStates } from "../../types/element-states";

export const SortingPage: React.FC = () => {
  const [isAnimation, setIsAnimation] = useState(false);
  const [loader, setLoader] = useState<string>("");
  const [checkedInput, setCheckedInput] = useState<string>("choice");
  const [{ type, data, arr }, setArr] = useState<TAnimation>({
    type: "",
    data: [],
    arr: [],
  });

  useEffect(() => {
    const arr = randomArr();
    setArr({ type: "", data: [], arr: arr });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parent = e.currentTarget.parentElement;
    if (parent?.classList.contains("bubble")) setCheckedInput("bubble");
    else if (parent?.classList.contains("choice")) setCheckedInput("choice");
  }

  async function createArr(e: FormEvent) {
    e.preventDefault();
    const arr = randomArr();
    setArr({ type: "", data: [], arr: arr });
  }

  async function startAnimation(sortFlag: string) {
    setIsAnimation(true);
    setLoader(sortFlag);
    let animation;
    if (checkedInput === "choice")
      animation = getAnimationToChoiceSort(arr as Array<number>, sortFlag);
    if (checkedInput === "bubble")
      animation = getAnimationToBubbleSort(arr as Array<number>, sortFlag);
    if (animation) await parseAnimations(animation, setArr, 400);
    setIsAnimation(false);
    setLoader("");
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <RadioInput
            label={"Выбор"}
            checked={checkedInput === "choice" ? true : false}
            name={"radio"}
            onChange={handleChange}
            extraClass={"choice"}
          ></RadioInput>
          <RadioInput
            label={"Пузырёк"}
            checked={checkedInput === "bubble" ? true : false}
            name={"radio"}
            onChange={handleChange}
            extraClass={"bubble"}
          ></RadioInput>
          <div className={styles.buttonContainer}>
            <Button
              text={"По возрастанию"}
              type={"button"}
              onClick={() => {
                startAnimation("up");
              }}
              disabled={isAnimation}
              isLoader={loader === "up" ? true : false}
            ></Button>
            <Button
              text={"По убыванию"}
              type={"button"}
              onClick={() => {
                startAnimation("down");
              }}
              disabled={isAnimation}
              isLoader={loader === "down" ? true : false}
            ></Button>
          </div>
        </div>
        <Button
          text={"Новый массив"}
          onClick={createArr}
          type={"button"}
          disabled={isAnimation}
        ></Button>
      </div>
      <div className={styles.columnContainer}>
        {arr?.map((el, index) => {
          const [l, r, last] = data as Array<number>;
          let color = ElementStates.Default;
          if (type === "select") {
            if (l === index || r === index) color = ElementStates.Changing;
            if (l > index && checkedInput === "choice")
              color = ElementStates.Modified;
            if (last < index && checkedInput === "bubble")
              color = ElementStates.Modified;
          }
          if (type === "swap") {
            const max = Math.max(l, r);
            if (max >= index && checkedInput === "choice")
              color = ElementStates.Modified;
            if (last <= index && checkedInput === "bubble")
              color = ElementStates.Modified;
          }
          return <Column index={Number(el)} key={index} state={color}></Column>;
        })}
      </div>
    </SolutionLayout>
  );
};
