import { mount } from '@vue/test-utils';
import Profile from '@/views/profile/Profile.vue';
import PasswordField from '@/components/fields/PasswordField.vue'
describe('Profile', () => {
  it('should display $q proper render', () => {
    const wrapper = mount(Profile)
    const passwordField = wrapper.findAllComponents(PasswordField)
    expect(passwordField).toBeTruthy()
    expect(true).toBe(true);
  })
})

