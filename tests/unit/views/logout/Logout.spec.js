import { mount } from '@vue/test-utils';
import Logout from '@/views/logout/Logout.vue';
describe('Logout', () => {
  it('should display $q proper render', () => {
    const wrapper = mount(Logout, { props: { label: 'Login you out...' } })
    const labelText = wrapper.find('span');
    expect(labelText.text()).toContain('Login you out...')
  })
})

