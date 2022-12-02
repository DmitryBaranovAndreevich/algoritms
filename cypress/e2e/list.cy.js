import {
  CIRCLE_ATTRIBUTE,
  DEFAULT_STYLE_COLOR,
  CHANGING_STYLE_COLOR,
  MODIFIED_STYLE_COLOR,
  SLEEP_TIME,
  HEAD,
  TAIL,
} from "./constans";

describe("проверка анимации работы списка", () => {
  before(function () {
    cy.visit("");
    cy.get(`a[href = "/list"]`).click();
  });

  it("при пустом инпуте кнопка добавления в head,tail и по индексу заблокированы, кнопка удаления по индексу заблокирована", function () {
    cy.contains("button", "Добавить по индексу").should("be.disabled");
    cy.contains("button", "Удалить по индексу").should("be.disabled");
    cy.contains("button", "Добавить в head").should("be.disabled");
    cy.contains("button", "Добавить в tail").should("be.disabled");
  });

  it("проверка дефолтного списка", function () {
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      cy.wrap(el)
        .invoke("attr", "class")
        .should("contain", DEFAULT_STYLE_COLOR);
      cy.wrap(el).next().should("have.text", index);
      if (index === 0) {
        cy.wrap(el).prev().should("have.text", HEAD);
      }

      if (index === list.length) {
        cy.wrap(el).next().next().should("have.text", TAIL);
      }
    });
  });

  it("проверка добавления элемента в head", function () {
    cy.clock();
    cy.contains("button", "Добавить в head").as("add");
    cy.get("input").eq(0).as("input");
    const elToAdd = Math.floor(Math.random() * 19 + 1);
    cy.get("@input").type(elToAdd);
    cy.get("@add").click();
    // элемент появляется в розом круге над 1 элементом
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      if (index !== 0) {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        cy.wrap(el)
          .next()
          .should("have.text", index - 1);
      }
      if (index === 0) {
        cy.wrap(el).should("have.text", elToAdd);
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", CHANGING_STYLE_COLOR);
      }

      if (index === list.length) {
        cy.wrap(el).next().next().should("have.text", TAIL);
      }
    });

    cy.tick(SLEEP_TIME);
    // элемент появляется в зеленом круге перед 1 элементом
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      if (index !== 0) {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        cy.wrap(el).next().should("have.text", index);
      }
      if (index === 0) {
        cy.wrap(el).prev().should("have.text", HEAD);
        cy.wrap(el).should("have.text", elToAdd);
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", MODIFIED_STYLE_COLOR);
        cy.wrap(el).next().should("have.text", index);
      }

      if (index === list.length) {
        cy.wrap(el).next().next().should("have.text", TAIL);
      }
    });

    cy.tick(SLEEP_TIME);
    //  все элементы синие
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      cy.wrap(el)
        .invoke("attr", "class")
        .should("contain", DEFAULT_STYLE_COLOR);
      cy.wrap(el).next().should("have.text", index);
      if (index === 0) {
        cy.wrap(el).prev().should("have.text", HEAD);
      }

      if (index === list.length) {
        cy.wrap(el).next().next().should("have.text", TAIL);
      }
    });
  });

  it("проверка добавления элемента в tail", function () {
    cy.clock();
    cy.contains("button", "Добавить в tail").as("add");
    cy.get("input").eq(0).as("input");
    const elToAdd = Math.floor(Math.random() * 19 + 1);
    cy.get("@input").type(elToAdd);
    cy.get("@add").click();
    // элемент появляется в розом круге над последним элементом
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      if (index === list.length - 1) {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        cy.wrap(el)
          .next()
          .should("have.text", index - 1);
      } else if (index === list.length - 2) {
        cy.wrap(el).should("have.text", elToAdd);
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", CHANGING_STYLE_COLOR);
      } else {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        cy.wrap(el).next().should("have.text", index);
      }
    });

    cy.tick(SLEEP_TIME);
    // элемент появляется в зеленом круге после последнего элементом
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      if (index === 0) {
        cy.wrap(el).prev().should("have.text", HEAD);
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        cy.wrap(el).next().should("have.text", index);
      } else if (index === list.length - 1) {
        cy.wrap(el).should("have.text", elToAdd);
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", MODIFIED_STYLE_COLOR);
        cy.wrap(el).next().should("have.text", index);
        cy.wrap(el).should("have.text", elToAdd);
        cy.wrap(el).next().next().should("have.text", TAIL);
      } else {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
        cy.wrap(el).next().should("have.text", index);
      }
    });
    cy.tick(SLEEP_TIME);
    //  все элементы синие
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      cy.wrap(el)
        .invoke("attr", "class")
        .should("contain", DEFAULT_STYLE_COLOR);
      cy.wrap(el).next().should("have.text", index);
      if (index === 0) {
        cy.wrap(el).prev().should("have.text", HEAD);
      }

      if (index === list.length) {
        cy.wrap(el).next().next().should("have.text", TAIL);
      }
    });
  });

  it("проверка добавления элемента по индексу", function () {
    cy.clock();
    const elToAdd = Math.floor(Math.random() * 19 + 1);
    const arr = Cypress.$(CIRCLE_ATTRIBUTE).length - 1;
    const indexToAdd = Math.floor(Math.random() * arr + 1);
    cy.get("input").eq(0).as("inputElement").type(elToAdd);
    cy.get("input").eq(1).as("inputIndex").type(indexToAdd);
    cy.get("button").contains("Добавить по индексу").click();
    // проверяем, что все элементы до пройденного индекса подсвечиваются розовым
    for (let i = 0; i <= indexToAdd; i++) {
      cy.get(CIRCLE_ATTRIBUTE).each((el, index) => {
        if (index <= i) {
          cy.wrap(el)
            .invoke("attr", "class")
            .should("contain", CHANGING_STYLE_COLOR);
        } else {
          cy.wrap(el)
            .invoke("attr", "class")
            .should("contain", DEFAULT_STYLE_COLOR);
        }
      });

      cy.tick(SLEEP_TIME);
    }
    cy.tick(SLEEP_TIME);
    // проверяем, что элемент добавился на указаныый индес и подсвечивается зеленым
    cy.get(CIRCLE_ATTRIBUTE).each((el, index) => {
      if (index === indexToAdd) {
        cy.log(el);
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", MODIFIED_STYLE_COLOR);
      } else {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
      }
    });
    cy.tick(SLEEP_TIME);
    // все элементы стали синими
    cy.get(CIRCLE_ATTRIBUTE).each((el) => {
      cy.wrap(el)
        .invoke("attr", "class")
        .should("contain", DEFAULT_STYLE_COLOR);
    });
  });

  it("проверка удаления из head", function () {
    cy.clock();
    cy.get("button").contains("Удалить из head").click();
    // проверяем, что первый кружок стал пустым, элемент для удаления стал розовым
    cy.get(CIRCLE_ATTRIBUTE).each((el, index) => {
      if (index === 0) {
        cy.wrap(el)
          .should("have.text", "")
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
      } else if (index === 1) {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", CHANGING_STYLE_COLOR);
      } else {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
      }
    });
    cy.tick(500);
    // все кружки снова синие
    cy.get(CIRCLE_ATTRIBUTE).each((el) => {
      cy.wrap(el)
        .invoke("attr", "class")
        .should("contain", DEFAULT_STYLE_COLOR);
    });
    cy.tick(500);
  });

  it("проверка удаления из tail", function () {
    cy.clock();
    cy.get("button").contains("Удалить из tail").click();
    // проверяем, что последний кружок стал пустым, элемент для удаления стал розовым
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      if (index === list.length - 2) {
        cy.wrap(el)
          .should("have.text", "")
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
      } else if (index === list.length - 1) {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", CHANGING_STYLE_COLOR);
      } else {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
      }
    });
    cy.tick(500);
    // все кружки снова синие
    cy.get(CIRCLE_ATTRIBUTE).each((el) => {
      cy.wrap(el)
        .invoke("attr", "class")
        .should("contain", DEFAULT_STYLE_COLOR);
    });
    cy.tick(500);
  });

  it("проверка удаления элемента по индексу", function () {
    cy.clock();
    const arr = Cypress.$(CIRCLE_ATTRIBUTE).length - 1;
    const indexToDel = Math.floor(Math.random() * arr + 1);
    cy.get("input").eq(1).as("inputIndex").type(indexToDel);
    cy.get("button").contains("Удалить по индексу").click();
    cy.tick(500);
    // проверяем что круги окрашиваются в розовый цвет до нужного индекса
    for (let i = 0; i < indexToDel; i++) {
      cy.get(CIRCLE_ATTRIBUTE).each((el, index) => {
        if (index <= i) {
          cy.wrap(el)
            .invoke("attr", "class")
            .should("contain", CHANGING_STYLE_COLOR);
        } else {
          cy.wrap(el)
            .invoke("attr", "class")
            .should("contain", DEFAULT_STYLE_COLOR);
        }
      });
      cy.tick(500);
    }
    // кружок по индексу для удаления стал пустым и имеет синюю рамку и  под ним появился розовый круг
    cy.get(CIRCLE_ATTRIBUTE).each((el, index, list) => {
      if (index === indexToDel) {
        cy.wrap(el)
          .should("have.text", "")
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
      } else if (index === indexToDel + 1) {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", CHANGING_STYLE_COLOR);
      } else {
        cy.wrap(el)
          .invoke("attr", "class")
          .should("contain", DEFAULT_STYLE_COLOR);
      }
    });
    cy.tick(500);
    // все кружки снова синие
    cy.get(CIRCLE_ATTRIBUTE).each((el) => {
      cy.wrap(el)
        .invoke("attr", "class")
        .should("contain", DEFAULT_STYLE_COLOR);
    });
    cy.tick(500);
  });
});
