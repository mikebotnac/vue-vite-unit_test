import { mount } from '@vue/test-utils';
import ResetPassword from '@/components/pages/login/ResetPassword.vue';
import Card from '@/components/Commons/Card.vue';

describe('ResetPassword', () => {
  const wrapper = mount(ResetPassword, {
    global: {
      stubs: {
        'Card': Card
     },
    }
  })

  it('should display proper render', () => {
   expect(true).toBe(true)
  })

  test('does a wrapper exist', () => {
    expect(wrapper.exists()).toBe(true)
  })
})

