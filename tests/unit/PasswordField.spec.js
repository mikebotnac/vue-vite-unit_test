import { mount } from '@vue/test-utils';
import PasswordField from '@/components/fields/PasswordField.vue';
import { EyeIcon, EyeOffIcon } from "@heroicons/vue/solid";

describe('PasswordField', () => {
  it('should display proper render', () => {
    const wrapper = mount(PasswordField, { props: { label: 'Password' } })
    const labelText = wrapper.find('label');
    expect(labelText.text()).toContain('Password')
  })
})

