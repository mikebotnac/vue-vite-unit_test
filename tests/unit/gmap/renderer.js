import { mount } from '@vue/test-utils';
import PasswordField from '@/components/fields/PasswordField.vue';


describe('PasswordField', () => {
  it('should display proper render', () => {
    const wrapper = mount(PasswordField, { props: { label: 'Password' } })
    const labelText = wrapper.find('label');
    expect(labelText.text()).toContain('Password')
  })
})

