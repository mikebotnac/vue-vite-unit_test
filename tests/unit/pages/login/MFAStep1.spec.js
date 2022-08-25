import { mount} from '@vue/test-utils';
import MFAStep1 from '@/components/pages/login/MFAStep1.vue';
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { inject, reactive, ref } from "vue";
import Card from '@/components/Commons/Card.vue';

describe('MFAStep1', () => {

  const wrapper = mount(MFAStep1, {
    global: {
      stubs: {
        'Card': Card
     },
    }
  })

  test('does a wrapper exist', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('Email is empty by default', ()=>{
    expect(wrapper.vm.credentials.username).toBe("")
  })

  it('password is empty by default', ()=>{
    expect(wrapper.vm.credentials.password).toBe("")
  })

  it('check the validity of username and password', async () => {
    const username = "mmarjs22@gmail.com"
    const password = "d252765CAFCA(A2C07F684e03"

    const credentials = reactive({
      username: username,
      password: password
    });
    const rules = {
      username: {
        required,
        email,
      },
      password: {
        required,
      },
    };
    const $v = await useVuelidate(rules, credentials);
    $v.value.$validate();

    expect($v.value.$invalid).toBe(false)

  })
  
  it('sign button is disabled by default', ()=>{
    expect(wrapper.vm.v$.$invalid).toBe(true)
  })

  it('has a button', ()=> {
    expect(wrapper.find('button').exists()).toBe(true)
  })


})

