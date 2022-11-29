describe("проверка анимации работы стека", () => {
  const stack = [];
  before(function () {
    cy.visit("http://localhost:3000");
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
    for (let i = 0; i < 6; i++) {
      const el = Math.floor(Math.random() * 19 + 1);
      let arr = [];
      cy.get("@input").type(el);
      cy.get("@add").click();
      stack.push(el);
      //  проверяем ввод первого элемента
      if (i === 0) {
        //  первый элемент с фиолетовой рамкой
        cy.get('div[data-testid = "circle_text_container"]')
          .prev()
          .should("have.text", `Top`);
        cy.get('div[data-testid = "circle_text_container"]')
          .should("have.text", `${el}`)
          .should("have.class", "circle_changing__uaqMc");
        cy.get('div[data-testid = "circle_text_container"]')
          .next()
          .should("have.text", `0`);
        cy.tick(500);
        //  первый элемент с синей рамкой
        cy.get('div[data-testid = "circle_text_container"]')
          .prev()
          .should("have.text", `Top`);
        cy.get('div[data-testid = "circle_text_container"]')
          .should("have.text", `${el}`)
          .should("have.class", "circle_default__lA5yg");
        cy.get('div[data-testid = "circle_text_container"]')
          .next()
          .should("have.text", `0`);
        cy.tick(500);
      } else {
        // проверяем ввод более 1 элемента, появляется с фиолетовой рамкой
        for (let j = 0; j <= i; j++) {
          arr.push(
            cy
              .get('div[data-testid = "circle_text_container"]')
              .eq(`${j}`)
              .as(`${j + 1}`)
          );
        }
        cy.log(arr);
        arr.forEach((el, index) => {
          if (index === arr.length - 1) {
            el.get(`@${index + 1}`)
              .prev()
              .should("have.text", `Top`);
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .should("have.class", "circle_changing__uaqMc");
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", `${index}`);
          } else {
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .should("have.class", "circle_default__lA5yg");
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", `${index}`);
          }
        });

        cy.tick(500);
        arr = [];
        // проверяем ввод более 1 элемента,  фиолетовая рамка становиться синей
        for (let j = 0; j <= i; j++) {
          arr.push(
            cy
              .get('div[data-testid = "circle_text_container"]')
              .eq(`${j}`)
              .as(`${j + 1}`)
          );
        }

        arr.forEach((el, index) => {
          if (index === arr.length - 1) {
            el.get(`@${index + 1}`)
              .prev()
              .should("have.text", `Top`);
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .should("have.class", "circle_default__lA5yg");
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", `${index}`);
          } else {
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .should("have.class", "circle_default__lA5yg");
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", `${index}`);
          }
        });

        cy.tick(500);
      }
    }
  });

  it("проверка анимации удаления элемента из стека", () => {
    cy.clock();
    cy.contains("button", "Удалить").as("delete");
    for (let i = 0; i < 6; i++) {
      let arr = [];
      cy.get("@delete").click();
      if (i === 5) {
        //  первый элемент с фиолетовой рамкой перед удалением
        cy.get('div[data-testid = "circle_text_container"]')
          .prev()
          .should("have.text", `Top`);
        cy.get('div[data-testid = "circle_text_container"]')
          .should("have.text", `${stack[0]}`)
          .should("have.class", "circle_changing__uaqMc");
        cy.get('div[data-testid = "circle_text_container"]')
          .next()
          .should("have.text", `0`);
        cy.tick(500);
        //  все элементы удалены
        cy.get('div[data-testid = "circle_text_container"]').should(
          "have.length",
          0
        );
        cy.tick(500);
      } else {
        // кандидат на удаление подсвечивается фиолетовым
        for (let j = 0; j < 6 - i; j++) {
          arr.push(
            cy
              .get('div[data-testid = "circle_text_container"]')
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
              .should("have.class", "circle_changing__uaqMc");
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", `${index}`);
          } else {
            el.get(`@${index + 1}`)
              .should("have.text", `${stack[index]}`)
              .should("have.class", "circle_default__lA5yg");
            el.get(`@${index + 1}`)
              .next()
              .should("have.text", `${index}`);
          }
        });

        cy.tick(500);
        // проверяем удаление 1 элемента
        cy.get('div[data-testid = "circle_text_container"]').should(
          "have.length",
          5 - i
        );
        stack.pop();
      }
    }
  });
});
