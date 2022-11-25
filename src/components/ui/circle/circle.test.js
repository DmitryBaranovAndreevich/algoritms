import renderer from "react-test-renderer";
import { render, screen, fireEvent } from "@testing-library/react";
import { Circle } from "./circle";

it("Пустой компонент Circle рендерится без ошибок", () => {
  const emptyCircle = renderer.create(<Circle></Circle>).toJSON();
  expect(emptyCircle).toMatchSnapshot();
});

it("Компонент Circle с буквами рендерится без ошибок", () => {
  const textCircle = renderer.create(<Circle letter="X"></Circle>).toJSON();
  expect(textCircle).toMatchSnapshot();
});

it("Компонент Circle с text head рендерится без ошибок", () => {
  const headTextCircle = renderer.create(<Circle letter="X" head={'head'}></Circle>).toJSON();
  expect(headTextCircle).toMatchSnapshot();
});

it("Компонент Circle с React element in head рендерится без ошибок", () => {
  const headElementCircle = renderer
    .create(<Circle letter="X" head={<Circle letter="X"></Circle>}></Circle>)
    .toJSON();
  expect(headElementCircle).toMatchSnapshot();
});

it("Компонент Circle с text tail рендерится без ошибок", () => {
  const textTailCircle = renderer
    .create(<Circle letter="X" tail={"tail"}></Circle>)
    .toJSON();
  expect(textTailCircle).toMatchSnapshot();
});

it("Компонент Circle с React element in tail рендерится без ошибок", () => {
  const tailElementCircle = renderer
    .create(<Circle letter="X" tail={<Circle letter={"X"}></Circle>}></Circle>)
    .toJSON();
  expect(tailElementCircle).toMatchSnapshot();
});

it("Компонент Circle с index рендерится без ошибок", () => {
  const indexCircle = renderer
    .create(<Circle index={1}></Circle>)
    .toJSON();
  expect(indexCircle).toMatchSnapshot();
});

it("small компонент Circle  рендерится без ошибок", () => {
  const smallCircle = renderer.create(<Circle isSmall={true}></Circle>).toJSON();
  expect(smallCircle).toMatchSnapshot();
});

it("default компонент Circle  рендерится без ошибок", () => {
  const defaultCircle = renderer
    .create(<Circle state={"default"}></Circle>)
    .toJSON();
  expect(defaultCircle).toMatchSnapshot();
});

it("changing компонент Circle  рендерится без ошибок", () => {
  const changingCircle = renderer
    .create(<Circle state={"changing"}></Circle>)
    .toJSON();
  expect(changingCircle).toMatchSnapshot();
});

it("modified компонент Circle  рендерится без ошибок", () => {
  const modifiedCircle = renderer
    .create(<Circle state={"modified"}></Circle>)
    .toJSON();
  expect(modifiedCircle).toMatchSnapshot();
});