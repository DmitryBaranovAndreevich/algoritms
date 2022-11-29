import {
  render,
  fireEvent,
  getAllByTestId,
  waitFor,
  screen,
} from "@testing-library/react";
import { SortingPage } from "./sorting-page";
import { BrowserRouter } from "react-router-dom";
import {
  getAnimationToBubbleSort,
  getAnimationToChoiceSort,
} from "../../services";

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

beforeAll(() => jest.useFakeTimers("modern"));
afterAll(() => jest.useRealTimers());

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

  it("Тест алгоритма сортировки выбором с один элементом", () => {
    const arr = [1];
    const sortArr = getAnimationToChoiceSort(arr, "up");
    expect(compareArrs(arr, sortArr[sortArr.length - 1].arr)).toBe(true);
  });

  it("Тест алгоритма сортровки выбором без элементов", () => {
    const arr = [];
    const sortArr = getAnimationToChoiceSort(arr, "up");
    expect(compareArrs(arr, sortArr[sortArr.length - 1].arr)).toBe(true);
  });

  it("Тест алгоритма сортировки пузырьком с один элементом", () => {
    const arr = [1];
    const sortArr = getAnimationToBubbleSort(arr, "up");
    expect(compareArrs(arr, sortArr[sortArr.length - 1].arr)).toBe(true);
  });

  it("Тест алгоритма сортровки пузырьком без элементов", () => {
    const arr = [];
    const sortArr = getAnimationToBubbleSort(arr, "up");
    expect(compareArrs(arr, sortArr[sortArr.length - 1].arr)).toBe(true);
  });
});
