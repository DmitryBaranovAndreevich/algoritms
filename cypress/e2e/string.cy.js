import { swap, randomArr } from "../../src/services";

describe("проверка анимации разворота строки", function () {
  const input = randomArr().join("").substring(0, 9);
  const inputToArr = [...input];
  before(function () {
    cy.visit("http://localhost:3000");
    cy.get(`a[href = "/recursion"]`).click();
  });

  it("кнопка заблокирована при пустом инпуте", function () {
    cy.get("button").should("be.disabled");
  });

  it("кнопка активна при заполненом инпуте", function () {
    cy.get("input").type(input);
    cy.get("button").should("not.be.disabled");
  });

  it("проверка анимации", function () {
    cy.clock();
    cy.get('button[data-testid = "button"]').click();
    const arr = [];
    for (let i = 0; i < input.length; i++) {
      arr.push(
        cy
          .get('div[data-testid = "circle_text_container"]')
          .eq(`${i}`)
          .as(`${i + 1}`)
      );
    }
    // проверяем начальное сотояние, все буквы синего цвета
    arr.forEach((el, index) =>
      el
        .get(`@${index + 1}`)
        .should("have.text", `${inputToArr[index]}`)
        .should("have.class", "circle_default__lA5yg")
    );

    cy.tick(500);
    let l = 0;
    let r = inputToArr.length - 1;
    // проверяем аинмацию процесса разворота
    while (l <= r) {
      arr.forEach((el, index) => {
        if (index < l || index > r) {
          el.get(`@${index + 1}`)
            .should("have.text", `${inputToArr[index]}`)
            .should("have.class", `circle_modified__s2Pgv`);
        } else if (index === l || index === r) {
          el.get(`@${index + 1}`)
            .should("have.text", `${inputToArr[index]}`)
            .should("have.class", `circle_changing__uaqMc`);
        } else {
          el.get(`@${index + 1}`)
            .should("have.text", `${inputToArr[index]}`)
            .should("have.class", "circle_default__lA5yg");
        }
      });
      swap(inputToArr, l, r);

      l++;
      r--;
      cy.tick(500);
    }
    // проверям конечное состояние, строка развернута, все буквы зеленые
    arr.forEach((el, index) =>
      el
        .get(`@${index + 1}`)
        .should("have.text", `${inputToArr[index]}`)
        .should("have.class", "circle_modified__s2Pgv")
    );
  });
});
