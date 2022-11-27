import {
  render,
  getByTestId,
  fireEvent,
  getAllByTestId,
  queryByTestId,
  waitFor,
} from "@testing-library/react";
import { StringComponent } from "./string";
import { BrowserRouter } from "react-router-dom";

function inputValue(container, value) {
  const input = getByTestId(container, "input");
  fireEvent.change(input, { target: { value: value } });
  const button = getByTestId(container, "button");
  fireEvent.click(button);
  jest.runAllTimers();
}

function checkResponce(container, inputValue) {
  {
    const reverseWord = getAllByTestId(container, "circle_text_container");
    const word = reverseWord.reduce((priv, el) => {
      const letter = el.textContent;
      return priv + letter;
    }, "");
    expect(word).toBe([...inputValue].reverse().join(""));
  }
}

jest.useFakeTimers("modern");
describe("Тест страницы с анимацией разворота строки", () => {
  
  it("Разворот строки с четным кол-ом символов", async () => {
    const { container } = render(
      <BrowserRouter>
        <StringComponent />
      </BrowserRouter>
    );
    const value = "1234";
    inputValue(container, value);

    await waitFor(() => checkResponce(container, value), {
      timeout: value.length * 500,
    });
  });

  it("Разворот строки с нечетным кол-ом символов", async () => {
    const { container } = render(
      <BrowserRouter>
        <StringComponent />
      </BrowserRouter>
    );
    const value = "12534";
    inputValue(container, value);

    await waitFor(() => checkResponce(container, value), {
      timeout: value.length * 500,
    });
  });

  it("Разворот строки с 1 символом", async () => {
    const { container } = render(
      <BrowserRouter>
        <StringComponent />
      </BrowserRouter>
    );
    const value = "1";
    inputValue(container, value);

    await waitFor(() => checkResponce(container, value), {
      timeout: value.length * 500,
    });
  });

  it("Разворот пустой строки", async () => {
    const { container } = render(
      <BrowserRouter>
        <StringComponent />
      </BrowserRouter>
    );
    const value = "";
    inputValue(container, value);

    await waitFor(
      () => {
        const reverseWord = queryByTestId(container, "circle_text_container");
        expect(reverseWord).toBeNull();
      },
      { timeout: value.length * 500 }
    );
  });
});
