import React, { FormEvent, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./fibonacci-page.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { useForm } from "../../hooks/useForm";
import { fibonacci, sleep } from "../../services";

export const FibonacciPage: React.FC = () => {
  const { values, handleChange } = useForm<number>({ inputNumber: 0 });
  const [isAnimation, setIsAnimation] = useState(false);
  const [arr, setArr] = useState<Array<number>>([]);

  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    setArr([]);
    setIsAnimation(true);
    await fibAnimation(values.inputNumber);
    setIsAnimation(false);
  }

  async function fibAnimation(n: number) {
    for (let i = 0; i <= n; i++) {
      await sleep();
      const num = fibonacci(i);
      setArr((priv) => {
        return [...priv, num];
      });
    }
  }
  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <form className={styles.form} onSubmit={formSubmit}>
        <Input
          type={"number"}
          maxLength={11}
          max={19}
          placeholder={"Введите текст"}
          onChange={handleChange}
          name={"inputNumber"}
          isLimitText={true}
        ></Input>
        <Button
          type={"submit"}
          text={"Раccчитать"}
          isLoader={isAnimation}
          disabled={
            values.inputNumber > 19 || values.inputNumber < 0 ? true : false
          }
        ></Button>
      </form>
      <div className={styles.container}>
        {arr?.map((num, index) => {
          return <Circle letter={num} index={index} key={index}></Circle>;
        })}
      </div>
    </SolutionLayout>
  );
};
