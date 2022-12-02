import { CIRCLE_ATTRIBUTE, DEFAULT_STYLE_COLOR, SLEEP_TIME } from "./constans";

describe("проверка анимации отрисовки ряда Фибоначи", () => {
  const input = Math.floor(Math.random() * 10 + 1);
  const arrFib = [
    1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
    4181,
  ];
  before(function () {
    cy.visit("");
    cy.get(`a[href = "/fibonacci"]`).click();
  });

  it("кнопка заблокирована при пустом инпуте", function () {
    cy.get("button").should("be.disabled");
  });

  it("кнопка активна при заполненом инпуте", function () {
    cy.get("input").type(input);
    cy.get("button").should("not.be.disabled");
  });

  it("проверка анимации", () => {
    cy.clock();
    cy.get('button[data-testid = "button"]').click();

    cy.tick(SLEEP_TIME);

    cy.get(CIRCLE_ATTRIBUTE)
      .should("have.text", `${1}`)
      .invoke("attr", "class")
      .should("contain", DEFAULT_STYLE_COLOR);

    cy.get(CIRCLE_ATTRIBUTE).next().should("have.text", `0`);

    cy.tick(SLEEP_TIME);

    for (let i = 2; i < input; i++) {
      const arr = [];

      for (let j = 0; j < i; j++) {
        arr.push(
          cy
            .get(CIRCLE_ATTRIBUTE)
            .eq(`${j}`)
            .as(`${j + 1}`)
        );
      }

      arr.forEach((el, index) => {
        el.get(`@${index + 1}`)
          .should("have.text", `${arrFib[index]}`)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        el.get(`@${index + 1}`)
          .next()
          .should("have.text", `${index}`);
      });
      cy.tick(SLEEP_TIME);
    }
    cy.tick(SLEEP_TIME);
  });
});
