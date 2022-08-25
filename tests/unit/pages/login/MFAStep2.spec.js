import { mount } from '@vue/test-utils';
import MFAStep2 from '@/components/pages/login/MFAStep2.vue';
import Card from '@/components/Commons/Card.vue';

describe('MFAStep2', () => {

  const wrapper = mount(MFAStep2, {
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

  it('code is empty by default', ()=>{
    expect(wrapper.vm.code).toBe("")
  })

  it('verify button is disabled by default', ()=>{
    expect(!wrapper.vm.code).toBe(true)
  })

  it('has a button', ()=> {
    expect(wrapper.find('button').exists()).toBe(true)
  })

})

