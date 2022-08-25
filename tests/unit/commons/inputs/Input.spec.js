import { mount } from '@vue/test-utils';
import Input from '@/components/commons/inputs/Input.vue';

describe('Input', () => {
  it('should display proper render', () => {
    const wrapper = mount(Input, { props: { label: 'Input label' } })
    const labelText = wrapper.find('label');
    expect(labelText.text()).toContain('Input label')
  })
})