import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { ingredientsQuantity } from "@/common/helpers/ingredients-quantity";
import { prepareData } from "../helpers/prepare-data";

describe("Ingredients quantity test", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    prepareData();
  });

  // 1. Позитивный тест
  it("Should return object with ingredients", () => {
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

    const result = ingredientsQuantity(pizza);
    expect(result).toEqual({
      1: 1, 2: 0, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
    });
  });

  // 2. Проверка защиты от отсутствующего поля ingredients
  it("Should handle missing ingredients property correctly", () => {
    const pizza = {
      name: "Pizza without ingredients property",
      sauceId: 1,
      doughId: 1,
      sizeId: 1
    };

    const result = ingredientsQuantity(pizza);
    expect(result).toEqual({
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
    });
  });

  // 3. Пустой массив ингредиентов
  it("Should return all zeros if ingredients array is empty", () => {
    const pizza = {
      name: "Empty ingredients pizza",
      sauceId: 1,
      doughId: 1,
      sizeId: 1,
      ingredients: [] 
    };

    const result = ingredientsQuantity(pizza);   
    expect(result).toEqual({
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0
    });
  });
});
