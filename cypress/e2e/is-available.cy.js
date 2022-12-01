describe("приложение активно", () => {
  it("должно быть доступно на адресе localhost:3000", () => {
    cy.visit("http://localhost:3000");
  });
});
