import React, { FormEvent, useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./fibonacci-page.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { useForm } from "../../hooks/useForm";
import { fibonacci, sleep } from "../../services";

export const FibonacciPage: React.FC = () => {
  const { values, handleChange } = useForm({ inputNumber: "" });
  const [isAnimation, setIsAnimation] = useState(false);
  const [arr, setArr] = useState<Array<number>>([]);

  async function formSubmit(e: FormEvent) {
    e.preventDefault();
    setArr([]);
    setIsAnimation(true);
    await fibAnimation(Number(values.inputNumber));
    setIsAnimation(false);
  }

  async function fibAnimation(n: number) {
    for (let i = 0; i <= n; i++) {
      await sleep(1000);
      const num = fibonacci(i);
      setArr((priv) => {
        return [...priv, num]
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
          disabled={Number(values.inputNumber) > 19||Number(values.inputNumber) < 0? true: false}
        ></Button>
      </form>
      <div className={styles.container}>
        {arr?.map((num,index) => {
          return <Circle letter={String(num)} index={index} key={index}></Circle>
        })}
      </div>
    </SolutionLayout>
  );
};
