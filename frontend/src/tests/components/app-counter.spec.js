import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AppCounter from "@/common/components/AppCounter.vue";

describe("Test app counter", () => {
  //1.КНОПКА ПЛЮС (УВЕЛИЧЕНИЕ)
  //1.1.Успешное увеличение значения
  it("Should emit input event on plus button click", async () => {
    const wrapper = mount(AppCounter, {
      props: { value: 1, max: 3 },
    });

    await wrapper.get(".counter__button--plus").trigger("click");

    expect(wrapper.emitted().input[0]).toEqual([2]);
  });

  //1.2.Блокировка кнопки «Плюс» на максимуме
  it("Should not emit input event on plus button click if value is max", async () => {
    const wrapper = mount(AppCounter, {
      props: { value: 3, max: 3 },
    });

    const plusButton = wrapper.get(".counter__button--plus");
    expect(plusButton.attributes()).toHaveProperty("disabled");

    await plusButton.trigger("click");
    expect(wrapper.emitted().input).toBeFalsy();
  });

  //2.КНОПКА МИНУС (УМЕНЬШЕНИЕ)
  //2.1.Успешное уменьшение значения
  it("Should emit input event on minus button click", async () => {
    const wrapper = mount(AppCounter, {
      props: { value: 2, min: 0 },
    });

    await wrapper.get(".counter__button--minus").trigger("click");

    expect(wrapper.emitted().input[0]).toEqual([1]);
  });

  //2.2.Блокировка кнопки «Минус» на минимуме
  it("Should not emit input event on minus button click if value is min", async () => {
    const wrapper = mount(AppCounter, {
      props: { value: 0, min: 0 },
    });

    const minusButton = wrapper.get(".counter__button--minus");
    expect(minusButton.attributes()).toHaveProperty("disabled");

    await minusButton.trigger("click");
    expect(wrapper.emitted().input).toBeFalsy();
  });

  //3.РУЧНОЙ ВВОД В ИНПУТ
  it("Should emit input event when typed into input field", async () => {
    const wrapper = mount(AppCounter, {
      props: { value: 1, min: 0, max: 3 },
    });

    const input = wrapper.get(".counter__input");

    await input.setValue("3");

    expect(wrapper.emitted().input[0]).toEqual([3]);
  });

  //4.СНЕПШОТ-ТЕСТЫ (ИНТЕРФЕЙС И ВЕРСТКА)
  //4.1.Состояние по умолчанию
  it("Should match snapshot in default state", () => {
    const wrapper = mount(AppCounter, {
      props: { value: 0, min: 0, max: 3 },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  //4.2.Состояние с акцентом
  it("Should match snapshot in accent state", () => {
    const wrapper = mount(AppCounter, {
      props: { value: 1, min: 0, max: 3, accent: true },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
