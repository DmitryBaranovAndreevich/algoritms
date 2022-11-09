import { useState } from "react";

export function useForm<T = string>(inputValues: Record<string, T>) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> & { target: { value: T } }
  ) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value as T });
  };
  return { values, handleChange, setValues };
}
