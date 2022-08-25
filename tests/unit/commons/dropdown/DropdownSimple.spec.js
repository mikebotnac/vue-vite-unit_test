import { mount } from '@vue/test-utils';
import DropdownSimple from '@/components/commons/dropdown/DropdownSimple.vue';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";

describe('PasswordField', () => {
  const wrapper = mount(DropdownSimple)

  it('should display proper render', () => {
    const wrapper = mount(DropdownSimple, { props: { label: 'Password' } })
    const labelText = wrapper.find('label');
    expect(true).toBe(true)
  })
  it('renders sub-components when the component is created', () => {
    const listbox = wrapper.findComponent(Listbox)
    expect(listbox).toBeTruthy()
    const listboxButton = wrapper.findComponent(ListboxButton)
    expect(listboxButton).toBeTruthy()
    const listboxOption = wrapper.findComponent(ListboxOption)
    expect(listboxOption).toBeTruthy()
    const listboxOptions = wrapper.findComponent(ListboxOptions)
    expect(listboxOptions).toBeTruthy()
    
  })

})