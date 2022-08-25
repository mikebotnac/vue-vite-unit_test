import { shallowMount } from '@vue/test-utils';
import Button from '@/components/commons/buttons/Button.vue';


describe('ButtonField',() => {
  it('should display Button render', async () => {
    const wrapper = shallowMount(Button)
    wrapper.vm.loadingResource = false
    await wrapper.vm.$nextTick()
    const button = wrapper.find('button')
    expect(button.attributes().disabled).toBeUndefined()
  })
})

