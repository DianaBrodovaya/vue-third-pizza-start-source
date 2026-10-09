import { useDataStore } from "@/stores/data";

export const ingredientsQuantity = (pizza) => {
  const data = useDataStore();
  const pizzaIngredients = pizza.ingredients ?? [];
  return data.ingredients.reduce((acc, val) => {
    acc[val.id] =
      pizzaIngredients.find((item) => item.ingredientId === val.id)
        ?.quantity ?? 0;
    return acc;
  }, {});
};
