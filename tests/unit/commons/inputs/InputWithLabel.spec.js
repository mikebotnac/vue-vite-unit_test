import { mount } from '@vue/test-utils';
import InputWithLabel from '@/components/commons/inputs/InputWithLabel.vue';


describe('InputWithLabel', () => {
  it('should display proper render', () => {
    const wrapper = mount(InputWithLabel, { props: { label: 'Hello' } })
    const labelText = wrapper.find('label');
    expect(labelText.text()).toContain('Hello')
  })
})

