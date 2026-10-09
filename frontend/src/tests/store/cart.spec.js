import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCartStore } from "@/stores/cart";
import { useDataStore } from "@/stores/data";
import { useAuthStore } from "@/stores/auth";
import { prepareData } from "../helpers/prepare-data";
import resources from "@/services/resources";

describe("Test cart store", () => {
  let cartStore;

  const mockPizza = {
    name: "Test pizza",
    sauceId: 1,
    doughId: 1,
    sizeId: 1, 
    ingredients: [
      { ingredientId: 1, quantity: 1 }, 
      { ingredientId: 3, quantity: 2 }, 
    ],
  }; 

  beforeEach(() => {
    setActivePinia(createPinia());
    prepareData();
    cartStore = useCartStore();
  });

  // 1. ТЕСТЫ ГЕТТЕРОВ (GETTERS)
  describe("Getters", () => {
    //1.1.Рассчет общей стоимости заказа (Happy Path)
    it("Should return cart total", () => {
      cartStore.pizzas = [{ quantity: 1, ...mockPizza }];
      cartStore.misc = [
        { miscId: 1, quantity: 1 }, // Coca-Cola за 56 рублей
        { miscId: 2, quantity: 2 }, // Острый соус за 30 рублей * 2 = 60 рублей
      ];

      // 467 + 56 + 60 = 583
      expect(cartStore.total).toBe(583);
    });

    //1.2.Проверка стоимости пустой корзины
    it("Should return 0 total for an empty cart", () => {
      expect(cartStore.total).toBe(0);
    });

    //1.3.Обогащение данных пиццы информацией из базы данных
    it("Should extend pizza data with entities from data store", () => {
      cartStore.pizzas = [{ quantity: 1, ...mockPizza }];
      
      const extendedPizza = cartStore.pizzasExtended[0];
      
      expect(extendedPizza.name).toBe("Test pizza");
      expect(extendedPizza.dough).toBeDefined();
      expect(extendedPizza.sauce).toBeDefined();
      expect(extendedPizza.size).toBeDefined();
      expect(extendedPizza.price).toBe(467);
    });

    //1.4.Мапинг всех доступных товаров в miscExtended
    it("Should map all misc items from data store inside miscExtended", () => {
      cartStore.misc = [{ miscId: 1, quantity: 2 }];
      
      const extendedMisc = cartStore.miscExtended;
      const firstItem = extendedMisc.find((item) => item.id === 1);
      const secondItem = extendedMisc.find((item) => item.id === 2);

      expect(extendedMisc.length).toBeGreaterThan(0);
      expect(firstItem.quantity).toBe(2);
      expect(secondItem.quantity).toBe(0); // Элемента нет в корзине — количество 0
    });
  });

  // 2. ТЕСТЫ ОПЕРАЦИЙ С КОРЗИНОЙ (ACTIONS)
  describe("Cart Management Actions", () => {
    //2.1.Добавление новой пиццы (index: null)
    it("Should add a new pizza when index is null", () => {
      cartStore.savePizza({ index: null, ...mockPizza, name: "Brand New Pizza" });

      expect(cartStore.pizzas.length).toBe(1);
      expect(cartStore.pizzas[0].name).toBe("Brand New Pizza");
      expect(cartStore.pizzas[0].quantity).toBe(1);
    });

    //2.2.Редактирование существующей пиццы с сохранением количества
    it("Should update existing pizza and keep its current quantity", () => {
      cartStore.pizzas = [{ quantity: 3, ...mockPizza, name: "Original Pizza" }];

      cartStore.savePizza({ index: 0, ...mockPizza, name: "Modified Pizza" });

      expect(cartStore.pizzas.length).toBe(1);
      expect(cartStore.pizzas[0].name).toBe("Modified Pizza");
      expect(cartStore.pizzas[0].quantity).toBe(3);
    });

    //2.3.Прямое изменение количества пиццы
    it("Should change pizza quantity via setPizzaQuantity", () => {
      cartStore.pizzas = [{ quantity: 1, ...mockPizza }];
      
      cartStore.setPizzaQuantity(0, 5);
      
      expect(cartStore.pizzas[0].quantity).toBe(5);
    });

    //2.4.Добавление нового дополнительного товара
    it("Should add a new misc item with quantity 1 when not present", () => {
      cartStore.setMiscQuantity(1, 4); 

      expect(cartStore.misc.length).toBe(1);
      expect(cartStore.misc[0].miscId).toBe(1);
      expect(cartStore.misc[0].quantity).toBe(1); 
    });

    //2.5.Полное удаление дополнительного товара из корзины при количестве 0
    it("Should remove misc item completely if quantity is set to 0", () => {
      cartStore.misc = [{ miscId: 1, quantity: 2 }];

      cartStore.setMiscQuantity(1, 0);

      expect(cartStore.misc.length).toBe(0);
    });

    //2.6.Полный сброс корзины
    it("Should reset store state to initial values", () => {
      cartStore.phone = "123456";
      cartStore.address = { street: "Test", building: "1", flat: "2", comment: "Call" };
      cartStore.pizzas = [{ quantity: 1 }];
      cartStore.misc = [{ miscId: 1 }];

      cartStore.reset();

      expect(cartStore.phone).toBe("");
      expect(cartStore.pizzas.length).toBe(0);
      expect(cartStore.misc.length).toBe(0);
      expect(cartStore.address.street).toBe("");
    });
  });

  // 3. ТЕСТЫ СЕТТЕРОВ И ЗАГРУЗКИ (FORM & LOAD)
  describe("Form and Load Actions", () => {
    //3.1.Корректное заполнение контактных данных и адреса
    it("Should properly set basic contact and address info", () => {
      cartStore.setPhone("79991112233");
      cartStore.setStreet("Lenina");
      cartStore.setBuilding("10/1");
      cartStore.setFlat("42");
      cartStore.setComment("Don't wake the baby");

      expect(cartStore.phone).toBe("79991112233");
      expect(cartStore.address.street).toBe("Lenina");
      expect(cartStore.address.building).toBe("10/1");
      expect(cartStore.address.flat).toBe("42");
      expect(cartStore.address.comment).toBe("Don't wake the baby");
    });

    //3.2.Мапинг сложного объекта заказа из истории в формат стора
    it("Should map full order object structure inside load action", () => {
      const incomingOrder = {
        phone: "777",
        orderPizzas: [
          {
            name: "Loaded Pizza",
            sauce: { id: 1 },
            dough: { id: 2 },
            size: { id: 3 },
            quantity: 2,
            ingredients: [{ id: 1, quantity: 3 }],
          },
        ],
        orderMisc: [{ id: 5, quantity: 4 }],
      };

      cartStore.load(incomingOrder);

      expect(cartStore.phone).toBe("777");
      expect(cartStore.pizzas.length).toBe(1);
      expect(cartStore.pizzas[0].name).toBe("Loaded Pizza");
      expect(cartStore.pizzas[0].sauceId).toBe(1);
      expect(cartStore.pizzas[0].ingredients[0].ingredientId).toBe(1);
      expect(cartStore.misc[0].miscId).toBe(5);
    });
  });
});
