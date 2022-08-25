import { mount } from '@vue/test-utils';
import ForceResetPassword from '@/components/pages/login/ForceResetPassword.vue';
import Card from '@/components/Commons/Card.vue';


describe('PasswordField', () => {
  const wrapper = mount(ForceResetPassword, {
    global: {
      stubs: {
        'Card': Card
     },
    }
  })

  test('does a wrapper exist', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('password is empty by default', ()=>{
    expect(wrapper.vm.creds.password).toBe("")
  })

  it('password confirm field is empty by default', ()=>{
    expect(wrapper.vm.creds.repeat_password).toBe("")
  })

  it('reset button is enabled by default', ()=>{
    expect(wrapper.vm.v$.$invalid).toBe(true)
  })

  it('has a button', ()=> {
    expect(wrapper.find('button').exists()).toBe(true)
  })
  
})

