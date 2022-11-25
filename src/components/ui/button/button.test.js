import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

const testOnClick = () => {
  alert('Click на кнопку');
}


it("Пустая кнопка рендерится без ошибок", () => {
  const emptyButton = renderer.create(<Button></Button>).toJSON();
  expect(emptyButton).toMatchSnapshot();
});

it("Кнопка с текстом рендериться без ошибок", () => {
  const textButton = renderer.create(<Button text="Нажми меня"></Button>).toJSON();
  expect(textButton).toMatchSnapshot();
});

it("Заблокированная кнопка рендериться без ошибок", () => {
  const disabledButton = renderer
    .create(<Button text="Нажми меня" disabled="true"></Button>)
    .toJSON();
  expect(disabledButton).toMatchSnapshot();
});

it("Кнопка с loader рендериться без ошибок", () => {
  const loaderButton = renderer
    .create(<Button text="Нажми меня" isLoader="true"></Button>)
    .toJSON();
  expect(loaderButton).toMatchSnapshot();
});

it("Нажатие на кнопку вызывает корректный alert", () => {
  window.alert = jest.fn();

  render(<Button text="Кликни меня" onClick={testOnClick}></Button>);

  const button = screen.getByText("Кликни меня");
  fireEvent.click(button);

  expect(window.alert).toHaveBeenCalledWith("Click на кнопку");
});