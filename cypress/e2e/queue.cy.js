import { Queue } from "../../src/services/";

describe("проверка анимации работы очереди", () => {
  before(function () {
    cy.visit("http://localhost:3000");
    cy.get(`a[href = "/queue"]`).click();
  });

  const queue = new Queue(7);
  const count = 7;
  let queueToArr = [];

  it("при пустом инпуте кнопка добавления заблокирована", function () {
    cy.contains("button", "Добавить").should("be.disabled");
  });

  it("проверка анимации добавления элемента в очередь", function () {
    cy.clock();
    cy.contains("button", "Добавить").as("add");
    cy.get("input").as("input");
    for (let i = 0; i < count; i++) {
      const elToAdd = Math.floor(Math.random() * 19 + 1);
      let arr = [];
      cy.get("@input").type(elToAdd);
      cy.get("@add").click();

      getArrElements(arr, count);

      queueToArr = queue.getArr;

      arr.forEach((el, index) => {
        if (index === queue.tail) {
          el.get(`@${index + 1}`)
            .should("have.text", ``)
            .should("have.class", "circle_changing__uaqMc");
          el.get(`@${index + 1}`)
            .next()
            .next()
            .should("have.text", `tail`);
        } else if (index === queue.head && index !== queue.tail) {
          el.get(`@${index + 1}`)
            .should("have.text", `${queueToArr[index]}`)
            .should("have.class", "circle_default__lA5yg");
          el.get(`@${index + 1}`)
            .prev()
            .should("have.text", `head`);
        } else {
          el.get(`@${index + 1}`)
            .should(
              "have.text",
              `${queueToArr[index] ? queueToArr[index] : ""}`
            )
            .should("have.class", "circle_default__lA5yg");

          el.get(`@${index + 1}`)
            .next()
            .should("have.text", `${index}`);
        }
      });
      queue.enqueue(elToAdd);
      queueToArr = queue.getArr;
      arr = [];
      cy.tick(500);

      getArrElements(arr, count);

      arr.forEach((el, index) => {
        el.get(`@${index + 1}`)
          .should("have.text", `${queueToArr[index] ? queueToArr[index] : ""}`)
          .should("have.class", "circle_default__lA5yg");
      });
    }
  });

  it("проверка анимации удаления элемента из очереди", function () {
    cy.clock();
    cy.contains("button", "Удалить").as("delete");
    for (let i = 0; i < count; i++) {
      let arr = [];
      cy.get("@delete").click();

      getArrElements(arr, count);

      arr.forEach((el, index) => {
        if (index === queue.head) {
          el.get(`@${index + 1}`)
            .should("have.text", `${queueToArr[index]}`)
            .should("have.class", "circle_changing__uaqMc");
          el.get(`@${index + 1}`)
            .prev()
            .should("have.text", `head`);
        } else if (index === queue.tail && index !== head) {
          el.get(`@${index + 1}`)
            .should("have.text", ``)
            .should("have.class", "circle_default__lA5yg");
          el.get(`@${index + 1}`)
            .next()
            .next()
            .should("have.text", `tail`);
        } else {
          el.get(`@${index + 1}`)
            .should(
              "have.text",
              `${queueToArr[index] ? queueToArr[index] : ""}`
            )
            .should("have.class", "circle_default__lA5yg");

          el.get(`@${index + 1}`)
            .next()
            .should("have.text", `${index}`);
        }
      });
      queue.dequeue();
      queueToArr = queue.getArr;
      arr = [];
      cy.tick(500);

      getArrElements(arr, count);

      arr.forEach((el, index) => {
        if (index === queue.head) {
          el.get(`@${index + 1}`).should(
            "have.text",
            `${queueToArr[index] ? queueToArr[index] : ""}`
          );
          el.get(`@${index + 1}`)
            .prev()
            .should("have.text", `head`);
        }
        if (index === queue.tail) {
          cy.log(queue.tail, queue.head);
          el.get(`@${index + 1}`).should("have.text", ``);
          el.get(`@${index + 1}`)
            .next()
            .next()
            .should("have.text", `${queue.tail === queue.head ? "" : tail}`);
        }
        el.get(`@${index + 1}`)
          .should("have.text", `${queueToArr[index] ? queueToArr[index] : ""}`)
          .should("have.class", "circle_default__lA5yg");
      });
    }
  });

  it("проверка анимации очищения очереди", function () {
    cy.clock();
    let arr = [];
    cy.contains("button", "Добавить").as("add");
    cy.get("input").as("input");
    for (let i = 0; i < count; i++) {
      const elToAdd = Math.floor(Math.random() * 19 + 1);
      cy.get("@input").type(elToAdd);
      cy.get("@add").click();
      queue.enqueue(elToAdd);
      cy.tick(500);
    }
    queueToArr = queue.getArr;
    getArrElements(arr, count);

    arr.forEach((el, index) =>
      el
        .get(`@${index + 1}`)
        .should("have.text", `${queueToArr[index] ? queueToArr[index] : ""}`)
    );

    cy.contains("button", "Очистить").click();
    arr = [];
    const checkArr = new Array(7).fill(null);

    getArrElements(arr, count);

    arr.forEach((el, index) =>
      el
        .get(`@${index + 1}`)
        .should("have.text", `${checkArr[index] ? checkArr[index] : ""}`)
    );
  });
});

function getArrElements(arr, count) {
  for (let j = 0; j < count; j++) {
    arr.push(
      cy
        .get('div[data-testid = "circle_text_container"]')
        .eq(`${j}`)
        .as(`${j + 1}`)
    );
  }
}
