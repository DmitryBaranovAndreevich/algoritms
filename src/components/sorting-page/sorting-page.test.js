import {
  render,
  fireEvent,
  getAllByTestId,
  waitFor,
  screen,
} from "@testing-library/react";
import { SortingPage } from "./sorting-page";
import { BrowserRouter } from "react-router-dom";

function getArray(container) {
  return getAllByTestId(container, "column").map((el) =>
    Number(el.textContent)
  );
}

function compareArrs(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}
jest.useFakeTimers("modern");
describe("Тест страницы сортировки массива", () => {
  
  it("Сортировка выбором по возрастанию", async () => {
    const { container } = render(
      <BrowserRouter>
        <SortingPage />
      </BrowserRouter>
    );

    const sortUpButon = screen.getByText(/По возрастанию/i);
    const sortChoiceLabel = screen.getByLabelText("Выбор");

    const startArr = getArray(container);
    fireEvent.click(sortChoiceLabel);
    fireEvent.click(sortUpButon);
    jest.runAllTimers();

    await waitFor(
      () => {
        const sortArr = getArray(container);
        const sortStartArr = [...startArr].sort((a, b) => a - b);
        expect(compareArrs(sortStartArr, sortArr)).toBe(true);
      },
      { timeout: startArr.length * startArr.length * 500 }
    );
  });

  it("Сортировка выбором по убыванию", async () => {
    const { container } = render(
      <BrowserRouter>
        <SortingPage />
      </BrowserRouter>
    );
    const sortDownButon = screen.getByText(/По убыванию/i);
    const sortChoiceLabel = screen.getByLabelText("Выбор");

    const startArr = getArray(container);
    fireEvent.click(sortChoiceLabel);
    fireEvent.click(sortDownButon);
    jest.runAllTimers();

    await waitFor(
      () => {
        const sortArr = getArray(container);
        const sortStartArr = [...startArr].sort((a, b) => b - a);
        expect(compareArrs(sortStartArr, sortArr)).toBe(true);
      },
      { timeout: startArr.length * startArr.length * 500 }
    );
  });

  it("Сортировка пузырьком по убыванию", async () => {
    const { container } = render(
      <BrowserRouter>
        <SortingPage />
      </BrowserRouter>
    );
    const sortDownButon = screen.getByText(/По убыванию/i);
    const sortBubleLabel = screen.getByLabelText("Пузырёк");

    const startArr = getArray(container);
    fireEvent.click(sortBubleLabel);
    fireEvent.click(sortDownButon);
    jest.runAllTimers();

    await waitFor(
      () => {
        const sortStartArr = [...startArr].sort((a, b) => b - a);
        const sortArr = getArray(container);
        expect(compareArrs(sortStartArr, sortArr)).toBe(true);
      },
      {
        timeout: startArr.length * startArr.length * 500,
      }
    );
  });

  it("Сортировка пузырьком по убыванию", async () => {
    const { container } = render(
      <BrowserRouter>
        <SortingPage />
      </BrowserRouter>
    );

    const sortUpButon = screen.getByText(/По возрастанию/i);
    const sortBubleLabel = screen.getByLabelText("Пузырёк");

    const startArr = getArray(container);
    fireEvent.click(sortBubleLabel);
    fireEvent.click(sortUpButon);
    jest.runAllTimers();

    await waitFor(
      () => {
        const sortStartArr = [...startArr].sort((a, b) => a - b);
        const sortArr = getArray(container);
        expect(compareArrs(sortStartArr, sortArr)).toBe(true);
      },
      {
        timeout: startArr.length * startArr.length * 500,
      }
    );
  });
});
