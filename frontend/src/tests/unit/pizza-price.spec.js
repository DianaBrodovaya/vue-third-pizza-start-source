import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { pizzaPrice } from "@/common/helpers/pizza-price";
import { prepareData } from "../helpers/prepare-data";

describe("Test pizza price", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    prepareData();
  });

  // 1. Позитивный тест
  it("Should return price of the pizza with basic size and ingredients", () => {
    const pizza = {
      name: "Test pizza",
      sauceId: 1,
      doughId: 1,
      sizeId: 1, 
      ingredients: [
        { ingredientId: 1, quantity: 1 }, 
        { ingredientId: 3, quantity: 2 },
      ],
    };

    expect(pizzaPrice(pizza)).toBe(467);
  });

  // 2. Тест другого размера (множителя)
  it("Should apply size multiplier to the whole pizza price", () => {
    const pizza = {
      name: "Large pizza",
      sauceId: 1,
      doughId: 1, 
      sizeId: 2,
      ingredients: [
        { ingredientId: 1, quantity: 1 },
      ],
    };

    expect(pizzaPrice(pizza)).toBe(766);
  });

  // 3. Тест пиццы без ингредиентов
  it("Should calculate price correctly when there are no ingredients", () => {
    const pizza = {
      name: "Only Crust and Sauce",
      sauceId: 1,
      doughId: 1, 
      sizeId: 1,
      ingredients: [],
    };

    expect(pizzaPrice(pizza)).toBe(350);
  });

  // 4. Тест ингредиентов с нулевым количеством
  it("Should not add cost for ingredients with zero quantity", () => {
    const pizza = {
      name: "Pizza with ghost ingredients",
      sauceId: 1,
      doughId: 1,
      sizeId: 1,
      ingredients: [
        { ingredientId: 1, quantity: 0 },
        { ingredientId: 3, quantity: 2 },
      ],
    };
 
    expect(pizzaPrice(pizza)).toBe(434);
  });

  // 5. Тест на устойчивость к отсутствию поля ingredients (Защита от падения)
  it("Should handle missing ingredients property correctly", () => {
    const pizza = {
      name: "Undefined ingredients pizza",
      sauceId: 1,
      doughId: 1, 
      sizeId: 1,
    };

    expect(pizzaPrice(pizza)).toBe(350);
  });
});
