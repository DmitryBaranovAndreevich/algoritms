describe("проверка роутинга на странице", function () {
  before(function () {
    cy.visit("http://localhost:3000");
  });

  it("должна быть открыта главная страница", function () {
    cy.contains("МБОУ АЛГОСОШ");
  });

  it("переход на страницу StringPage", function () {
    cy.get(`a[href = "/recursion"]`).click();
    cy.contains("Строка");
    cy.get(`a[href = "/"]`).click();
  });

  it("переход на страницу FibonacciPage", function () {
    cy.get(`a[href = "/fibonacci"]`).click();
    cy.contains("Последовательность Фибоначчи");
    cy.get(`a[href = "/"]`).click();
  });

  it("переход на страницу SortingPage", function () {
    cy.get(`a[href = "/sorting"]`).click();
    cy.contains("Сортировка массива");
    cy.get(`a[href = "/"]`).click();
  });

  it("переход на страницу StackPage", function () {
    cy.get(`a[href = "/stack"]`).click();
    cy.contains("Стек");
    cy.get(`a[href = "/"]`).click();
  });

  it("переход на страницу QueuePage", function () {
    cy.get(`a[href = "/queue"]`).click();
    cy.contains("Очередь");
    cy.get(`a[href = "/"]`).click();
  });

  it("переход на страницу ListPage", function () {
    cy.get(`a[href = "/list"]`).click();
    cy.contains("Связный список");
    cy.get(`a[href = "/"]`).click();
  });
});
