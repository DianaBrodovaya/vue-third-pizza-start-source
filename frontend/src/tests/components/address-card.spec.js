import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AddressCard from "@/common/components/address/AddressCard.vue";

describe("Test AddressCard snapshots", () => {
  const mockAddress = {
    name: "Дом",
    comment: "Вход под арку, третий подъезд",
  };

  // 1. Снэпшот режима просмотра (v-if)
  it("Should match snapshot in display mode", () => {
    const wrapper = mount(AddressCard, {
      props: {
        address: mockAddress,
        index: 1,
      },
      global: {
        stubs: {
          AddressEditForm: true,
        },
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  // 2. Снэпшот режима редактирования (v-else)
  it("Should match snapshot in edit mode", async () => {
    const wrapper = mount(AddressCard, {
      props: {
        address: mockAddress,
        index: 1,
      },
      global: {
        stubs: {
          AddressEditForm: true,
        },
      },
    });

    const editButton = wrapper.get(".address-form__edit button");
    await editButton.trigger("click");

    expect(wrapper.html()).toMatchSnapshot();
  });

  // 3. Отрицательный снепшот-тест: проверка, что компонент AddressEditForm не рендерится в режиме просмотра
  it("Should NOT render address-edit-form in display mode", () => {
    const wrapper = mount(AddressCard, {
      props: {
        address: mockAddress,
        index: 1,
      },
      global: {
        stubs: {
          AddressEditForm: true,
        },
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.html()).not.toContain("address-edit-form");
  });
});
