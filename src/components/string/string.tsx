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

export const StringComponent: React.FC = () => {
  const [isAnimation, setIsAnimation] = useState(false);
  const { values, handleChange } = useForm({ inputString: "" });
  const [{ type, data, arr }, setArr] = useState<TAnimation>({
    type: "",
    data: [],
    arr: [],
  });

  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    setIsAnimation(true);
    const wordToArr = (values.inputString as string).split("");
    if (wordToArr.length > 1) {
      setArr({ type: "", data: [], arr: wordToArr });
      let animations = getAnimations(wordToArr);
      await parseAnimations(animations, setArr, 1000);
    } else {
      setArr({ type: "swap", data: [1, 1], arr: wordToArr });
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
        ></Button>
      </form>
      <div className={styles.container}>
        {arr?.map((el, index) => {
          const [l, r] = data as Array<number>;
          let color = ElementStates.Default;
          if (type === "select" && arr.length > 1) {
            if (l === index || r === index) color = ElementStates.Changing;
            if (l > index || r < index) color = ElementStates.Modified;
          }
          if (type === "swap") {
            if (l >= index || r <= index) color = ElementStates.Modified;
          }
          return (
            <Circle letter={String(el)} key={index} state={color}></Circle>
          );
        })}
      </div>
    </SolutionLayout>
  );
};
