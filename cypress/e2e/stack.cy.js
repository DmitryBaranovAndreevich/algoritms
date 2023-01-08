import {
  CIRCLE_ATTRIBUTE,
  DEFAULT_STYLE_COLOR,
  CHANGING_STYLE_COLOR,
  TOP,
  SLEEP_TIME,
} from "./constans";

describe("проверка анимации работы стека", () => {
  const count = 6;
  const stack = [];
  before(function () {
    cy.visit("");
    cy.get(`a[href = "/stack"]`).click();
  });

  it("кнопка заблокирована при пустом инпуте", function () {
    cy.contains("button", "Добавить").should("be.disabled");
  });

  it("проверка анимации добавления элемента в стек", () => {
    cy.clock();
    cy.contains("button", "Добавить").as("add");
    cy.get("input").as("input");
    // тестируем добавление 6 случайных элементов
    for (let i = 0; i < count; i++) {
      const el = Math.floor(Math.random() * 19 + 1);
      let arr = [];
      cy.get("@input").type(el);
      cy.get("@add").click();
      stack.push(el);
      //  проверяем ввод первого элемента
      if (i === 0) {
        //  первый элемент с фиолетовой рамкой
        cy.get(CIRCLE_ATTRIBUTE).prev().should("have.text", TOP);
        cy.get(CIRCLE_ATTRIBUTE)
          .should("have.text", `${el}`)
          .invoke("attr", "class")
          .should("contain", CHANGING_STYLE_COLOR);
        cy.get(CIRCLE_ATTRIBUTE).next().should("have.text", "0");
        cy.tick(SLEEP_TIME);
        //  первый элемент с синей рамкой
        cy.get(CIRCLE_ATTRIBUTE).prev().should("have.text", TOP);
        cy.get(CIRCLE_ATTRIBUTE)
          .should("have.text", `${el}`)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        cy.get(CIRCLE_ATTRIBUTE).next().should("have.text", "0");
        cy.tick(SLEEP_TIME);
      } else {
        // проверяем ввод более 1 элемента, появляется с фиолетовой рамкой
        for (let j = 0; j <= i; j++) {
          arr.push(
            cy
              .get(CIRCLE_ATTRIBUTE)
              .eq(`${j}`)
              .as(`${j + 1}`)
          );
        }

        arr.forEach((el, index) => {
          if (index === arr.length - 1) {
            el.get(`@${index + 1}`)
              .prev()
              .should("have.text", TOP);
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .invoke("attr", "class")
              .should("contain", CHANGING_STYLE_COLOR);
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", index);
          } else {
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .invoke("attr", "class")
              .should("contain", DEFAULT_STYLE_COLOR);
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", index);
          }
        });

        cy.tick(SLEEP_TIME);
        arr = [];
        // проверяем ввод более 1 элемента,  фиолетовая рамка становиться синей
        for (let j = 0; j <= i; j++) {
          arr.push(
            cy
              .get(CIRCLE_ATTRIBUTE)
              .eq(`${j}`)
              .as(`${j + 1}`)
          );
        }

        arr.forEach((el, index) => {
          if (index === arr.length - 1) {
            el.get(`@${index + 1}`)
              .prev()
              .should("have.text", TOP);
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .invoke("attr", "class")
              .should("contain", DEFAULT_STYLE_COLOR);
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", index);
          } else {
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .invoke("attr", "class")
              .should("contain", DEFAULT_STYLE_COLOR);
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", index);
          }
        });

        cy.tick(SLEEP_TIME);
      }
    }
  });

  it("проверка анимации удаления элемента из стека", () => {
    cy.clock();
    cy.contains("button", "Удалить").as("delete");
    for (let i = 0; i < count; i++) {
      let arr = [];
      cy.get("@delete").click();
      if (i === count - 1) {
        //  первый элемент с фиолетовой рамкой перед удалением
        cy.get(CIRCLE_ATTRIBUTE).prev().should("have.text", `Top`);
        cy.get(CIRCLE_ATTRIBUTE)
          .should("have.text", `${stack[0]}`)
          .invoke("attr", "class")
          .should("contain", CHANGING_STYLE_COLOR);
        cy.get(CIRCLE_ATTRIBUTE).next().should("have.text", `0`);
        cy.tick(500);
        //  все элементы удалены
        cy.get(CIRCLE_ATTRIBUTE).should("have.length", 0);
        cy.tick(500);
      } else {
        // кандидат на удаление подсвечивается фиолетовым
        for (let j = 0; j < count - i; j++) {
          arr.push(
            cy
              .get(CIRCLE_ATTRIBUTE)
              .eq(`${j}`)
              .as(`${j + 1}`)
          );
        }

        arr.forEach((el, index) => {
          cy.log("add");
          if (index === arr.length - 1) {
            el.get(`@${index + 1}`)
              .prev()
              .should("have.text", `Top`);
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .invoke("attr", "class")
              .should("contain", CHANGING_STYLE_COLOR);
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", index);
          } else {
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .invoke("attr", "class")
              .should("contain", DEFAULT_STYLE_COLOR);
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", index);
          }
        });

        cy.tick(SLEEP_TIME);
        // проверяем удаление 1 элемента
        cy.get(CIRCLE_ATTRIBUTE).should("have.length", count - 1 - i);
        stack.pop();
      }
    }
  });

  it("по нажатию на кнопку очистить весь стек очищается", function () {
    cy.clock();
    cy.contains("button", "Добавить").as("add");
    cy.contains("button", "Очистить").as("clear");
    cy.get("input").as("input");
    for (let i = 0; i < count; i++) {
      const el = Math.floor(Math.random() * 19 + 1);
      cy.get("@input").type(el);
      cy.get("@add").click();
      cy.tick(1000);
    }
    cy.get("@clear").click();
    cy.get(CIRCLE_ATTRIBUTE).should("have.length", 0);
  });
});
