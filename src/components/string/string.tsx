import styles from "./string.module.css";
import React, { FormEvent, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/element-states";
import { getAnimations, parseAnimations } from "../../services";
import { TAnimation } from "../../types/animation";
import { ArrStyles } from "../../types/arrStyles";
import { useStateIfMounted } from "use-state-if-mounted";

export const StringComponent: React.FC = () => {
  const [isAnimation, setIsAnimation] = useStateIfMounted(false);
  const { values, handleChange } = useForm({ inputString: "" });
  const [{ type, data, arr }, setArr] = useStateIfMounted<TAnimation<string>>({
    type: ArrStyles.default,
    data: [],
    arr: [],
  });

  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    setIsAnimation(true);
    const wordToArr = values.inputString.split("");
    if (wordToArr.length > 1) {
      setArr({ type: ArrStyles.default, data: [], arr: wordToArr });
      let animations = getAnimations(wordToArr);
      await parseAnimations(animations, setArr);
    } else {
      setArr({ type: ArrStyles.swap, data: [1, 1], arr: wordToArr });
    }
    setIsAnimation(false);
  }

  return (
    <SolutionLayout title="Строка">
      <form className={styles.form} onSubmit={formSubmit}>
        <Input
          type={"text"}
          maxLength={11}
          max={11}
          placeholder={"Введите текст"}
          onChange={handleChange}
          name={"inputString"}
          isLimitText={true}
        ></Input>
        <Button
          type={"submit"}
          text={"Развернуть"}
          isLoader={isAnimation}
          disabled={values.inputString !== "" ? false : true}
        ></Button>
      </form>
      <div className={styles.container} data-testid={"string-container"}>
        {arr?.map((el, index) => {
          const [l, r] = data;
          let color = ElementStates.Default;
          if (type === ArrStyles.select && arr.length > 1) {
            if (l === index || r === index) color = ElementStates.Changing;
            if (l > index || r < index) color = ElementStates.Modified;
          }
          if (type === ArrStyles.swap) {
            if (l >= index || r <= index) color = ElementStates.Modified;
          }
          return <Circle letter={el} key={index} state={color}></Circle>;
        })}
      </div>
    </SolutionLayout>
  );
};
