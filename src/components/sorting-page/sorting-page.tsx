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
import { ArrStyles } from "../../types/arrStyles";
import { SortTypes } from "../../types/sortType";
import { useStateIfMounted } from "use-state-if-mounted";

export const SortingPage: React.FC = () => {
  const [isAnimation, setIsAnimation] = useStateIfMounted(false);
  const [loader, setLoader] = useStateIfMounted<string>("");
  const [checkedInput, setCheckedInput] = useState<string>(SortTypes.choice);
  const [{ type, data, arr }, setArr] = useStateIfMounted<TAnimation<number>>({
    type: ArrStyles.default,
    data: [],
    arr: [],
  });

  useEffect(() => {
    const arr = randomArr();
    setArr({ type: ArrStyles.default, data: [], arr: arr });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parent = e.currentTarget.parentElement;
    if (parent?.classList.contains(SortTypes.bubble))
      setCheckedInput(SortTypes.bubble);
    else if (parent?.classList.contains(SortTypes.choice))
      setCheckedInput(SortTypes.choice);
  }

  async function createArr(e: FormEvent) {
    e.preventDefault();
    const arr = randomArr();
    setArr({ type: ArrStyles.default, data: [], arr: arr });
  }

  async function startAnimation(sortFlag: string) {
    setIsAnimation(true);
    setLoader(sortFlag);
    let animation;
    if (checkedInput === SortTypes.choice)
      animation = getAnimationToChoiceSort(arr, sortFlag);
    if (checkedInput === SortTypes.bubble)
      animation = getAnimationToBubbleSort(arr, sortFlag);
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
            checked={checkedInput === SortTypes.choice ? true : false}
            name={"radio"}
            onChange={handleChange}
            extraClass={SortTypes.choice}
            value={checkedInput}
          ></RadioInput>
          <RadioInput
            label={"Пузырёк"}
            checked={checkedInput === SortTypes.bubble ? true : false}
            name={"radio"}
            onChange={handleChange}
            extraClass={SortTypes.bubble}
            value={checkedInput}
          ></RadioInput>
          <div className={styles.buttonContainer}>
            <Button
              text={"По возрастанию"}
              type={"button"}
              onClick={() => {
                startAnimation(SortTypes.up);
              }}
              disabled={isAnimation}
              isLoader={loader === SortTypes.up ? true : false}
            ></Button>
            <Button
              text={"По убыванию"}
              type={"button"}
              onClick={() => {
                startAnimation(SortTypes.down);
              }}
              disabled={isAnimation}
              isLoader={loader === SortTypes.down ? true : false}
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
        {arr.map((el, index) => {
          const [l, r, last] = data;
          let color = ElementStates.Default;
          if (type === ArrStyles.select) {
            if (l === index || r === index) color = ElementStates.Changing;
            if (l > index && checkedInput === SortTypes.choice)
              color = ElementStates.Modified;
            if (last < index && checkedInput === SortTypes.bubble)
              color = ElementStates.Modified;
          }
          if (type === ArrStyles.swap) {
            const max = Math.max(l, r);
            if (max >= index && checkedInput === SortTypes.choice)
              color = ElementStates.Modified;
            if (last <= index && checkedInput === SortTypes.bubble)
              color = ElementStates.Modified;
          }
          return <Column index={el} key={index} state={color}></Column>;
        })}
      </div>
    </SolutionLayout>
  );
};
